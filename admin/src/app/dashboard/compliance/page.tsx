'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getDonors } from '@/lib/donors.api';
import { formatCurrency, donorFullName } from '@/lib/utils';
import type { Donor, PaginatedResponse } from '@/lib/types';
import { AlertTriangle, Mail } from 'lucide-react';

const PAGE_LIMIT = 50;

export default function CompliancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Donor> | null>(null);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    let cancelled = false;

    async function loadDonors() {
      setLoading(true);
      try {
        // We fetch donors and highlight those without PAN
        const data = await getDonors({ page, limit: PAGE_LIMIT });
        if (!cancelled) setResult(data);
      } catch (err) {
        console.error('Failed to load donors for compliance', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDonors();
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const missingPanDonors = result?.data.filter(d => !d.pan_number && parseFloat(d.total_donated) > 0) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">80G Compliance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor missing PAN numbers required for 80G tax exemptions.
          </p>
        </div>
        {missingPanDonors.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
            <AlertTriangle className="h-4 w-4" />
            {missingPanDonors.length} missing PAN on this page
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Donor #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email / Phone</TableHead>
              <TableHead>Total Donated</TableHead>
              <TableHead>PAN Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  No donors found.
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((donor) => {
                const missing = !donor.pan_number && parseFloat(donor.total_donated) > 0;
                return (
                  <TableRow key={donor.id} className={`hover:bg-gray-50 ${missing ? 'bg-amber-50/30' : ''}`}>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {donor.donor_number}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {donorFullName(donor.first_name, donor.last_name, donor.is_anonymous)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{donor.email || '—'}</div>
                      <div className="text-xs text-gray-400">{donor.phone || '—'}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {formatCurrency(donor.total_donated)}
                    </TableCell>
                    <TableCell>
                      {donor.pan_number ? (
                        <span className="text-green-600 font-medium text-sm">Provided</span>
                      ) : (
                        <span className="text-amber-600 font-medium text-sm flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Missing
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button disabled={!missing || !donor.email} className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-50" title="Request PAN via Email">
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <Pagination currentPage={page} totalPages={result.meta.totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
