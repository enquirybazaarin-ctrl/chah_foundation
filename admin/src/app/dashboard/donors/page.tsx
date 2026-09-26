'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, UserPlus, ChevronRight, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getDonors } from '@/lib/donors.api';
import { formatCurrency, formatDate, donorFullName } from '@/lib/utils';
import type { Donor, PaginatedResponse } from '@/lib/types';

const PAGE_LIMIT = 20;

export default function DonorsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Donor> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const search = searchParams.get('search') ?? '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    let cancelled = false;

    async function loadDonors() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDonors({ page, limit: PAGE_LIMIT, search: search || undefined });
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError('Failed to load donors. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDonors();
    return () => { cancelled = true; };
  }, [page, search]);

  // Debounced search — push to URL after 400ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set('search', searchInput);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

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
          <h1 className="text-2xl font-semibold text-gray-900">Donors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view your donor database.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/donors/duplicates"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4 text-gray-500" />
            Duplicate Scanner
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            onClick={() => alert('Manual donor creation coming soon.')}
            aria-label="Add new donor"
          >
            <UserPlus className="h-4 w-4" />
            Add Donor
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          id="donor-search"
          placeholder="Search by name, email or PAN…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
          aria-label="Search donors"
        />
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
              <TableHead className="w-[120px]">Donor #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead className="text-right">Total Donated</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
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
                  {search ? `No donors found for "${search}".` : 'No donors yet.'}
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((donor) => (
                <TableRow
                  key={donor.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/donors/${donor.id}`)}
                >
                  <TableCell className="font-mono text-xs text-gray-500">
                    {donor.donor_number}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {donorFullName(donor.first_name, donor.last_name, donor.is_anonymous)}
                  </TableCell>
                  <TableCell className="text-gray-600">{donor.email}</TableCell>
                  <TableCell className="text-gray-600">{donor.phone ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {donor.pan_number ? `${donor.pan_number.substring(0, 2)}******${donor.pan_number.substring(8)}` : '—'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {formatCurrency(donor.total_donated)}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(donor.created_at)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/donors/${donor.id}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${donorFullName(donor.first_name, donor.last_name, donor.is_anonymous)}`}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500">
                {result.meta.total} donor{result.meta.total !== 1 ? 's' : ''} total
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
