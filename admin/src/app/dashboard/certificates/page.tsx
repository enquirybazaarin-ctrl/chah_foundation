'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getCertificates, type Certificate, type PaginatedCertificates } from '@/lib/certificates.api';
import { formatCurrency, formatDate, donorFullName } from '@/lib/utils';
import { Mail, Download } from 'lucide-react';

const PAGE_LIMIT = 25;

export default function CertificatesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedCertificates | null>(null);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    let cancelled = false;

    async function loadCertificates() {
      setLoading(true);
      try {
        const data = await getCertificates({ page, limit: PAGE_LIMIT });
        if (!cancelled) setResult(data);
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCertificates();
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">80G Certificates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track certificate generation and email delivery status for successful donations.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Certificate #</TableHead>
              <TableHead>Donation #</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Generated At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  No certificates found.
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((cert) => (
                <TableRow key={cert.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs text-gray-900 font-semibold">
                    {cert.certificate_number}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {cert.donation?.donation_number || '—'}
                  </TableCell>
                  <TableCell>
                    {cert.donation?.donor ? donorFullName(cert.donation.donor.first_name, cert.donation.donor.last_name, false) : '—'}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {cert.donation ? formatCurrency(Number(cert.donation.amount)) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {cert.generated_at ? formatDate(cert.generated_at) : '—'}
                  </TableCell>
                  <TableCell>
                    {cert.status === 'GENERATED' ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Generated
                      </span>
                    ) : cert.status === 'GENERATING' ? (
                      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        Generating
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                        Failed
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button disabled={cert.status !== 'GENERATED'} className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-50" title="Resend Email">
                        <Mail className="h-4 w-4" />
                      </button>
                      {cert.pdf_url ? (
                        <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600" title="Download">
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <button disabled className="p-1.5 text-gray-400 opacity-50" title="No PDF available">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
