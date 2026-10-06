'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ExternalLink, Sparkles, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CampaignStatusBadge, FundraisingProgress } from '@/components/ui/CampaignStatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { getCampaignsAdmin, getFeaturedCampaignSectionAdmin, updateFeaturedCampaignSectionSettings, getMedicalEmergencySectionAdmin, updateMedicalEmergencySectionSettings } from '@/lib/campaigns.api';
import { formatDate } from '@/lib/utils';
import type { Campaign, PaginatedResponse, CampaignStatus } from '@/lib/types';

const PAGE_LIMIT = 20;

const STATUS_FILTER_OPTIONS: { label: string; value: CampaignStatus | 'ALL' }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const nativeSelectClass =
  'h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';

export default function CampaignsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Campaign> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Homepage Section Settings state
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [sectionBadge, setSectionBadge] = useState('');
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionSubheading, setSectionSubheading] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [featuredData, setFeaturedData] = useState<{
    featured: Campaign | null;
    supporting: Campaign[];
  } | null>(null);

  // Medical Section Settings state
  const [showMedicalSectionSettings, setShowMedicalSectionSettings] = useState(false);
  const [medicalSectionBadge, setMedicalSectionBadge] = useState('');
  const [medicalSectionHeading, setMedicalSectionHeading] = useState('');
  const [medicalSectionSubheading, setMedicalSectionSubheading] = useState('');
  const [savingMedicalSettings, setSavingMedicalSettings] = useState(false);
  const [medicalSettingsSuccess, setMedicalSettingsSuccess] = useState<string | null>(null);
  const [medicalFeaturedData, setMedicalFeaturedData] = useState<{
    featured: Campaign | null;
    supporting: Campaign[];
  } | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const statusFilter = (searchParams.get('status') ?? 'ALL') as CampaignStatus | 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadCampaigns() {
      setLoading(true);
      setError(null);
      try {
        const [data, featuredSection, medicalSection] = await Promise.all([
          getCampaignsAdmin({ page, limit: PAGE_LIMIT }),
          getFeaturedCampaignSectionAdmin().catch(() => null),
          getMedicalEmergencySectionAdmin().catch(() => null),
        ]);
        if (!cancelled) {
          setResult(data);
          if (featuredSection) {
            setSectionBadge(featuredSection.section.badge || '');
            setSectionHeading(featuredSection.section.heading || '');
            setSectionSubheading(featuredSection.section.subheading || '');
            setFeaturedData({
              featured: featuredSection.featured,
              supporting: featuredSection.supporting,
            });
          }
          if (medicalSection) {
            setMedicalSectionBadge(medicalSection.section.badge || '');
            setMedicalSectionHeading(medicalSection.section.heading || '');
            setMedicalSectionSubheading(medicalSection.section.subheading || '');
            setMedicalFeaturedData({
              featured: medicalSection.featured,
              supporting: medicalSection.supporting,
            });
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load campaigns. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCampaigns();
    return () => { cancelled = true; };
  }, [page]);

  const handleSaveSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(null);
    try {
      await updateFeaturedCampaignSectionSettings({
        badge: sectionBadge,
        heading: sectionHeading,
        subheading: sectionSubheading,
      });
      setSettingsSuccess('Homepage section headings updated successfully!');
      setTimeout(() => setSettingsSuccess(null), 4000);
    } catch {
      alert('Failed to update homepage section settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveMedicalSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMedicalSettings(true);
    setMedicalSettingsSuccess(null);
    try {
      await updateMedicalEmergencySectionSettings({
        badge: medicalSectionBadge,
        heading: medicalSectionHeading,
        subheading: medicalSectionSubheading,
      });
      setMedicalSettingsSuccess('Medical section headings updated successfully!');
      setTimeout(() => setMedicalSettingsSuccess(null), 4000);
    } catch {
      alert('Failed to update medical section settings.');
    } finally {
      setSavingMedicalSettings(false);
    }
  };

  // Filter client-side by status (admin list returns all)
  const filteredData = statusFilter === 'ALL'
    ? result?.data
    : result?.data.filter((c) => c.status === statusFilter);

  const updateStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all fundraising campaigns and customize the Homepage Featured Donation section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setShowSectionSettings(!showSectionSettings); setShowMedicalSectionSettings(false); }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium border shadow-sm transition-colors ${
              showSectionSettings
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Settings2 className="h-4 w-4 text-amber-600" />
            Extreme Needs Settings
          </button>
          <button
            type="button"
            onClick={() => { setShowMedicalSectionSettings(!showMedicalSectionSettings); setShowSectionSettings(false); }}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium border shadow-sm transition-colors ${
              showMedicalSectionSettings
                ? 'bg-rose-50 text-rose-900 border-rose-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Settings2 className="h-4 w-4 text-rose-600" />
            Medical Needs Settings
          </button>
          <Link
            href="/dashboard/campaigns/new"
            id="create-campaign-btn"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Homepage Section Settings Panel */}
      {showSectionSettings && (
        <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/70">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Homepage &quot;Fundraising for Extreme Needs&quot; Section
              </h2>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full border border-amber-300">
              Live on Homepage
            </span>
          </div>

          <form onSubmit={handleSaveSectionSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Section Eyebrow / Badge
                </label>
                <input
                  type="text"
                  value={sectionBadge}
                  onChange={(e) => setSectionBadge(e.target.value)}
                  placeholder="FUNDRAISING FOR EXTREME NEEDS"
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={sectionHeading}
                  onChange={(e) => setSectionHeading(e.target.value)}
                  placeholder="Help a child continue their journey of learning."
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Section Subheading / Short Description
                </label>
                <input
                  type="text"
                  value={sectionSubheading}
                  onChange={(e) => setSectionSubheading(e.target.value)}
                  placeholder="Help children access education, school essentials and the opportunities they deserve."
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                To feature a specific campaign as the prominent large card on the homepage, check{' '}
                <span className="font-semibold text-gray-700">&quot;Feature prominently on Homepage&quot;</span> when creating or editing it.
              </div>
              <div className="flex items-center gap-3">
                {settingsSuccess && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> {settingsSuccess}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Section Headings'}
                </button>
              </div>
            </div>
          </form>

          {/* Current Live Featured Preview */}
          {featuredData && (
            <div className="pt-3 border-t border-amber-200/60 mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  Primary Featured Card
                </span>
                {featuredData.featured ? (
                  <div>
                    <p className="font-semibold text-gray-900 truncate">{featuredData.featured.title}</p>
                    <p className="text-gray-500 mt-0.5">
                      {featuredData.featured.beneficiary_name ? `Child: ${featuredData.featured.beneficiary_name}` : 'Beneficiary not set'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No featured campaign selected</p>
                )}
              </div>
              <div className="md:col-span-3 bg-white p-3 rounded-lg border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Supporting Cards ({featuredData.supporting.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {featuredData.supporting.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-gray-700">
                      {c.beneficiary_name || c.title}
                    </span>
                  ))}
                  {featuredData.supporting.length === 0 && (
                    <span className="text-gray-400 italic">No supporting active campaigns</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medical Section Settings Panel */}
      {showMedicalSectionSettings && (
        <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/70">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Homepage &quot;Medical Emergency Cases&quot; Section
              </h2>
            </div>
            <span className="text-xs bg-rose-100 text-rose-800 font-medium px-2.5 py-0.5 rounded-full border border-rose-300">
              Live on Homepage
            </span>
          </div>

          <form onSubmit={handleSaveMedicalSectionSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Section Eyebrow / Badge
                </label>
                <input
                  type="text"
                  value={medicalSectionBadge}
                  onChange={(e) => setMedicalSectionBadge(e.target.value)}
                  placeholder="MEDICAL EMERGENCY CASES"
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={medicalSectionHeading}
                  onChange={(e) => setMedicalSectionHeading(e.target.value)}
                  placeholder="Health cannot wait."
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Section Subheading / Short Description
                </label>
                <input
                  type="text"
                  value={medicalSectionSubheading}
                  onChange={(e) => setMedicalSectionSubheading(e.target.value)}
                  placeholder="When medical emergencies happen, timely support can make all the difference."
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                To feature a specific medical campaign, ensure it has the <span className="font-semibold text-gray-700">Medical Emergency</span> category and check{' '}
                <span className="font-semibold text-gray-700">&quot;Feature prominently on Homepage&quot;</span>.
              </div>
              <div className="flex items-center gap-3">
                {medicalSettingsSuccess && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> {medicalSettingsSuccess}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingMedicalSettings}
                  className="rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50"
                >
                  {savingMedicalSettings ? 'Saving...' : 'Save Section Headings'}
                </button>
              </div>
            </div>
          </form>

          {/* Current Live Featured Preview */}
          {medicalFeaturedData && (
            <div className="pt-3 border-t border-rose-200/60 mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                  Primary Featured Card
                </span>
                {medicalFeaturedData.featured ? (
                  <div>
                    <p className="font-semibold text-gray-900 truncate">{medicalFeaturedData.featured.title}</p>
                    <p className="text-gray-500 mt-0.5">
                      {medicalFeaturedData.featured.beneficiary_name ? `Patient: ${medicalFeaturedData.featured.beneficiary_name}` : 'Patient not set'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No featured campaign selected</p>
                )}
              </div>
              <div className="md:col-span-3 bg-white p-3 rounded-lg border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Supporting Cards ({medicalFeaturedData.supporting.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {medicalFeaturedData.supporting.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-gray-700">
                      {c.beneficiary_name || c.title}
                    </span>
                  ))}
                  {medicalFeaturedData.supporting.length === 0 && (
                    <span className="text-gray-400 italic">No supporting active campaigns</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Filter */}
      <div className="flex items-center gap-3">
        <label htmlFor="campaign-status-filter" className="text-sm text-gray-600">
          Filter:
        </label>
        <select
          id="campaign-status-filter"
          className={nativeSelectClass}
          value={statusFilter}
          onChange={(e) => updateStatusFilter(e.target.value)}
          aria-label="Filter by campaign status"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {result && (
          <span className="text-sm text-gray-400">
            {filteredData?.length ?? 0} of {result.meta.total} campaigns
          </span>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Campaign</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[180px]">Progress</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  {statusFilter !== 'ALL'
                    ? `No ${statusFilter.toLowerCase()} campaigns.`
                    : 'No campaigns yet. Create your first one!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                >
                  <TableCell>
                    <div className="max-w-[280px]">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {campaign.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                            ★ Homepage Featured
                          </span>
                        )}
                        {campaign.is_urgent && (
                          <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700 border border-red-200">
                            🚨 {campaign.urgency_label || 'Urgent'}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 truncate">{campaign.title}</p>
                      {campaign.beneficiary_name && (
                        <p className="text-xs text-blue-700 font-medium truncate mt-0.5">
                          Child: {campaign.beneficiary_name}
                          {campaign.beneficiary_age ? ` (${campaign.beneficiary_age}y)` : ''}
                          {campaign.location ? ` • ${campaign.location}` : ''}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                        /{campaign.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {campaign.category?.name ?? '—'}
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell>
                    <FundraisingProgress
                      raised={campaign.raised_amount}
                      target={campaign.target_amount}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {campaign.start_date ? formatDate(campaign.start_date) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {campaign.end_date ? formatDate(campaign.end_date) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(campaign.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        aria-label={`Edit ${campaign.title}`}
                        title="Edit campaign"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500">
                {result.meta.total} campaign{result.meta.total !== 1 ? 's' : ''} total
              </span>
              <Pagination
                currentPage={page}
                totalPages={result.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
