'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getEnquiries, updateEnquiryStatus } from '@/lib/operations.api';
import { formatDate } from '@/lib/utils';
import type { Enquiry, EnquiryStatus, PaginatedResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Filter } from 'lucide-react';

const PAGE_LIMIT = 20;

export default function EnquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Enquiry> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Counts state for badges
  const [counts, setCounts] = useState({ unread: 0, read: 0, resolved: 0, total: 0 });

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const statusFilter = (searchParams.get('status') ?? 'ALL') as EnquiryStatus | 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        // Load main table data
        const data = await getEnquiries({
          page,
          limit: PAGE_LIMIT,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        });
        if (!cancelled) setResult(data);

        // Load counts in background (could be optimized with a dedicated backend endpoint)
        const [unread, read, resolved] = await Promise.all([
          getEnquiries({ limit: 1, status: 'UNREAD' }),
          getEnquiries({ limit: 1, status: 'READ' }),
          getEnquiries({ limit: 1, status: 'RESOLVED' })
        ]);
        
        if (!cancelled) {
          setCounts({
            unread: unread.meta.total,
            read: read.meta.total,
            resolved: resolved.meta.total,
            total: unread.meta.total + read.meta.total + resolved.meta.total
          });
        }
      } catch (err) {
        console.error('Failed to load enquiries', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();
    return () => { cancelled = true; };
  }, [page, statusFilter]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const handleStatusClick = (status: string) => {
    updateFilter('status', status);
  };

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage contact form submissions and general enquiries.
          </p>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => handleStatusClick('ALL')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${statusFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          All <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'ALL' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-500'}`}>{counts.total}</span>
        </button>
        <button 
          onClick={() => handleStatusClick('UNREAD')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${statusFilter === 'UNREAD' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
        >
          New / Unread <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'UNREAD' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>{counts.unread}</span>
        </button>
        <button 
          onClick={() => handleStatusClick('READ')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${statusFilter === 'READ' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
        >
          In Progress <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'READ' ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-600'}`}>{counts.read}</span>
        </button>
        <button 
          onClick={() => handleStatusClick('RESOLVED')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${statusFilter === 'RESOLVED' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'}`}
        >
          Resolved <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'RESOLVED' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>{counts.resolved}</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search enquiries..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="text-sm border-gray-300 rounded-md py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-700"
              value={statusFilter}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="ALL">Status: All</option>
              <option value="UNREAD">Status: New</option>
              <option value="READ">Status: In Progress</option>
              <option value="RESOLVED">Status: Resolved</option>
            </select>
          </div>
          <select className="text-sm border-gray-300 rounded-md py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-700">
            <option>Date: All time</option>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>This month</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-600">Contact</TableHead>
              <TableHead className="font-semibold text-gray-600">Subject</TableHead>
              <TableHead className="font-semibold text-gray-600">Received</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-600 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-base font-medium text-gray-900">No enquiries found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((enquiry) => (
                <TableRow key={enquiry.id} className="hover:bg-gray-50 group border-b border-gray-100 last:border-0">
                  <TableCell>
                    <p className="font-semibold text-gray-900">{enquiry.name}</p>
                    <p className="text-sm text-gray-500">{enquiry.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900 max-w-[250px] truncate" title={enquiry.subject}>
                      {enquiry.subject}
                    </p>
                    <p className="text-sm text-gray-500 max-w-[250px] truncate" title={enquiry.message}>
                      {enquiry.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 font-medium">{formatDate(enquiry.created_at)}</p>
                  </TableCell>
                  <TableCell>
                    {enquiry.status === 'UNREAD' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold border-0">NEW</Badge>}
                    {enquiry.status === 'READ' && <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-bold border-0">IN PROGRESS</Badge>}
                    {enquiry.status === 'RESOLVED' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-bold border-0">RESOLVED</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <Pagination currentPage={page} totalPages={result.meta.totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
