'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CampaignStatusBadge, FundraisingProgress } from '@/components/ui/CampaignStatusBadge';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import {
  getCampaignById,
  updateCampaign,
  cancelCampaign,
} from '@/lib/campaigns.api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Campaign, CreateCampaignPayload, UpdateCampaignPayload } from '@/lib/types';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get('created') === '1' ? 'Campaign created successfully!' : null
  );

  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadCampaign() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getCampaignById(id);
        if (!cancelled) setCampaign(data);
      } catch {
        if (!cancelled) setLoadError('Campaign not found or failed to load.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCampaign();
    return () => { cancelled = true; };
  }, [id]);

  // Auto-dismiss success message after 5s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleUpdate = async (payload: CreateCampaignPayload | UpdateCampaignPayload) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateCampaign(id, payload as UpdateCampaignPayload);
      setCampaign(updated);
      setSuccessMessage('Campaign updated successfully!');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        axiosErr?.response?.data?.message ?? 'Failed to update campaign. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!id || !campaign) return;
    setIsCancelling(true);
    try {
      const updated = await cancelCampaign(id);
      setCampaign(updated);
      setCancelConfirm(false);
      setSuccessMessage('Campaign has been cancelled.');
    } catch {
      setSubmitError('Failed to cancel campaign.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loadError) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-6 text-red-700 max-w-3xl">
        <p className="font-semibold">Error</p>
        <p className="mt-1 text-sm">{loadError}</p>
        <button className="mt-4 text-sm text-red-600 underline" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back Navigation */}
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Back to campaigns list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      {/* Success Banner */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-700"
        >
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {/* ── Campaign Stats Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-64 bg-blue-500" />
              <Skeleton className="h-4 w-32 bg-blue-500" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{campaign?.title}</h1>
                <p className="mt-1 font-mono text-blue-200 text-sm truncate">
                  /{campaign?.slug}
                </p>
              </div>
              {campaign && <CampaignStatusBadge status={campaign.status} />}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 sm:grid-cols-4">
          <StatCell
            label="Raised"
            value={loading ? null : formatCurrency(campaign?.raised_amount ?? '0')}
            loading={loading}
          />
          <StatCell
            label="Target"
            value={loading ? null : (campaign?.target_amount ? formatCurrency(campaign.target_amount) : 'No limit')}
            loading={loading}
          />
          <StatCell
            label="Start"
            value={loading ? null : (campaign?.start_date ? formatDate(campaign.start_date) : '—')}
            loading={loading}
          />
          <StatCell
            label="End"
            value={loading ? null : (campaign?.end_date ? formatDate(campaign.end_date) : '—')}
            loading={loading}
          />
        </div>

        {/* Progress */}
        {!loading && campaign && (
          <div className="px-6 py-4 border-b border-gray-200">
            <FundraisingProgress
              raised={campaign.raised_amount}
              target={campaign.target_amount}
            />
          </div>
        )}
      </div>

      {/* ── Edit Form ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Campaign</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update campaign details. The slug will not change after creation.
          </p>
        </div>
        <div className="px-6 py-6">
          {loading ? (
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
              <Skeleton className="h-40 w-full" />
            </div>
          ) : campaign ? (
            <CampaignForm
              initialData={campaign}
              onSubmit={handleUpdate as (p: UpdateCampaignPayload) => Promise<void>}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          ) : null}
        </div>
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────────────── */}
      {campaign && campaign.status !== 'CANCELLED' && (
        <>
          <Separator />
          <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-red-100 bg-red-50">
              <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-600">
                Cancelling a campaign is permanent. It will no longer accept donations.
              </p>
            </div>
            <div className="px-6 py-5">
              {!cancelConfirm ? (
                <button
                  id="cancel-campaign-btn"
                  onClick={() => setCancelConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Campaign
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-red-700">
                    Are you sure? This cannot be undone.
                  </span>
                  <button
                    id="confirm-cancel-btn"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    {isCancelling ? 'Cancelling…' : 'Yes, Cancel Campaign'}
                  </button>
                  <button
                    onClick={() => setCancelConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Keep active
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | null;
  loading: boolean;
}) {
  return (
    <div className="px-6 py-4">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1">
        {loading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <span className="text-base font-semibold text-gray-900">{value}</span>
        )}
      </dd>
    </div>
  );
}
