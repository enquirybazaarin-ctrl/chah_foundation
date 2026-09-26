'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DonationStatusBadge, PaymentMethodBadge } from '@/components/ui/DonationStatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { getDonorById, getDonorDonations } from '@/lib/donors.api';
import { formatCurrency, formatDate, donorFullName } from '@/lib/utils';
import type { Donor, Donation, PaginatedResponse } from '@/lib/types';

const PAGE_LIMIT = 10;

export default function DonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [donorLoading, setDonorLoading] = useState(true);
  const [donorError, setDonorError] = useState<string | null>(null);

  const [donations, setDonations] = useState<PaginatedResponse<Donation> | null>(null);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationsPage, setDonationsPage] = useState(1);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadDonor() {
      setDonorLoading(true);
      setDonorError(null);
      try {
        const data = await getDonorById(id);
        if (!cancelled) setDonor(data);
      } catch {
        if (!cancelled) setDonorError('Failed to load donor profile.');
      } finally {
        if (!cancelled) setDonorLoading(false);
      }
    }

    void loadDonor();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadDonations() {
      setDonationsLoading(true);
      try {
        const data = await getDonorDonations(id, { page: donationsPage, limit: PAGE_LIMIT });
        if (!cancelled) setDonations(data);
      } catch {
        // Silently fail — table will show empty state
      } finally {
        if (!cancelled) setDonationsLoading(false);
      }
    }

    void loadDonations();
    return () => { cancelled = true; };
  }, [id, donationsPage]);

  if (donorError) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-6 text-red-700">
        <p className="font-semibold">Error</p>
        <p className="mt-1 text-sm">{donorError}</p>
        <button
          className="mt-4 text-sm text-red-600 underline"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    );
  }

  const fullName = donor
    ? donorFullName(donor.first_name, donor.last_name, donor.is_anonymous)
    : '';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Go back to donors list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Donors
      </button>

      {/* ── Donor Profile Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
          {donorLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-64 bg-blue-500" />
              <Skeleton className="h-4 w-40 bg-blue-500" />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <p className="mt-1 font-mono text-blue-200 text-sm">{donor?.donor_number}</p>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 sm:grid-cols-4">
          <StatCell
            label="Total Donated"
            value={donorLoading ? null : formatCurrency(donor?.total_donated ?? '0')}
            loading={donorLoading}
          />
          <StatCell
            label="Donations Made"
            value={donorLoading ? null : String(donations?.meta.total ?? '—')}
            loading={donorLoading || donationsLoading}
          />
          <StatCell
            label="City"
            value={donorLoading ? null : donor?.city ?? '—'}
            loading={donorLoading}
          />
          <StatCell
            label="Member Since"
            value={donorLoading ? null : formatDate(donor?.created_at ?? '')}
            loading={donorLoading}
          />
        </div>

        {/* Contact Details */}
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Contact Information
          </h2>
          {donorLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <ContactField icon={<Mail className="h-4 w-4" />} label="Email" value={donor?.email ?? '—'} />
              <ContactField icon={<Phone className="h-4 w-4" />} label="Phone" value={donor?.phone ?? '—'} />
              <ContactField
                icon={<CreditCard className="h-4 w-4" />}
                label="PAN Number"
                value={donor?.pan_number ?? '—'}
                mono
              />
              <ContactField
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={
                  [donor?.address, donor?.city, donor?.state]
                    .filter(Boolean)
                    .join(', ') || '—'
                }
              />
              <ContactField
                icon={<Calendar className="h-4 w-4" />}
                label="Last Updated"
                value={donor ? formatDate(donor.updated_at) : '—'}
              />
              <ContactField
                icon={<span className="h-4 w-4 text-xs font-bold">Anon</span>}
                label="Anonymous Donor"
                value={donor?.is_anonymous ? 'Yes' : 'No'}
              />
            </dl>
          )}
        </div>
      </div>

      <Separator />

      {/* ── Donation History ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Donation #</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : donations?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                    No donations recorded for this donor.
                  </TableCell>
                </TableRow>
              ) : (
                donations?.data.map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {donation.donation_number}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatCurrency(donation.amount)}
                    </TableCell>
                    <TableCell>
                      <DonationStatusBadge status={donation.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentMethodBadge method={donation.payment_method} />
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {donation.campaign?.title ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {donation.certificate_issued ? (
                        <span className="text-green-600 font-medium">Issued</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(donation.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {donations && donations.meta.totalPages > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 px-4">
              <Pagination
                currentPage={donationsPage}
                totalPages={donations.meta.totalPages}
                onPageChange={setDonationsPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

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
          <span className="text-lg font-semibold text-gray-900">{value}</span>
        )}
      </dd>
    </div>
  );
}

function ContactField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-gray-400 uppercase tracking-wider">{label}</dt>
        <dd className={`mt-0.5 text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</dd>
      </div>
    </div>
  );
}
