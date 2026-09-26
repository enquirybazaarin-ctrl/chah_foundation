'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
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
import { getDonations } from '@/lib/donors.api';
import { formatCurrency, formatDate, donorFullName } from '@/lib/utils';
import type { Donation, PaginatedResponse, DonationStatus, PaymentMethod } from '@/lib/types';

const PAGE_LIMIT = 25;

const STATUS_OPTIONS: { label: string; value: DonationStatus | 'ALL' }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Refunded', value: 'REFUNDED' },
];

const METHOD_OPTIONS: { label: string; value: PaymentMethod | 'ALL' }[] = [
  { label: 'All Methods', value: 'ALL' },
  { label: 'Online', value: 'ONLINE' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
  { label: 'Other', value: 'OTHER' },
];

// Tailwind classes for native <select> to match the design system
const nativeSelectClass =
  'h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';

export default function DonationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Donation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const status = (searchParams.get('status') ?? 'ALL') as DonationStatus | 'ALL';
  const method = (searchParams.get('method') ?? 'ALL') as PaymentMethod | 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadDonations() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDonations({
          page,
          limit: PAGE_LIMIT,
          status: status !== 'ALL' ? status : undefined,
          payment_method: method !== 'ALL' ? method : undefined,
        });
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError('Failed to load donations. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDonations();
    return () => { cancelled = true; };
  }, [page, status, method]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Donations Ledger</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete record of all donations received by the Foundation.
          </p>
        </div>
        {result && (
          <span className="text-sm text-gray-500">
            {result.meta.total.toLocaleString('en-IN')} total records
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label htmlFor="filter-status" className="sr-only">Filter by status</label>
          <select
            id="filter-status"
            className={nativeSelectClass}
            value={status}
            onChange={(e) => updateFilter('status', e.target.value)}
            aria-label="Filter by donation status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-method" className="sr-only">Filter by payment method</label>
          <select
            id="filter-method"
            className={nativeSelectClass}
            value={method}
            onChange={(e) => updateFilter('method', e.target.value)}
            aria-label="Filter by payment method"
          >
            {METHOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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
              <TableHead>Donation #</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  No donations found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((donation) => (
                <TableRow key={donation.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-mono text-xs text-gray-500">
                    {donation.donation_number}
                  </TableCell>
                  <TableCell>
                    {donation.donor ? (
                      <Link
                        href={`/dashboard/donors/${donation.donor.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
                      >
                        {donorFullName(
                          donation.donor.first_name ?? '',
                          donation.donor.last_name ?? '',
                          donation.is_anonymous
                        )}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
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

        {/* Pagination */}
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <Pagination
              currentPage={page}
              totalPages={result.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
