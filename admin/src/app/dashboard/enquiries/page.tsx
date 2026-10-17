'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getEnquiries, updateEnquiryStatus } from '@/lib/operations.api';
import { formatDate } from '@/lib/utils';
import type { Enquiry, EnquiryStatus, PaginatedResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Eye, Filter, Mail, Phone, User, 
  CheckCircle2, Clock, X, ExternalLink, MessageSquare, 
  Smile, HeartHandshake, Check, Loader2 
} from 'lucide-react';

const PAGE_LIMIT = 20;

export default function EnquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Enquiry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VOLUNTEER' | 'PARTNERSHIP' | 'GENERAL'>('ALL');
  
  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Counts state for badges
  const [counts, setCounts] = useState({ unread: 0, read: 0, resolved: 0, total: 0 });

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const statusFilter = (searchParams.get('status') ?? 'ALL') as EnquiryStatus | 'ALL';

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries({
        page,
        limit: PAGE_LIMIT,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setResult(data);

      const [unread, read, resolved] = await Promise.all([
        getEnquiries({ limit: 1, status: 'UNREAD' }),
        getEnquiries({ limit: 1, status: 'READ' }),
        getEnquiries({ limit: 1, status: 'RESOLVED' })
      ]);
      
      setCounts({
        unread: unread.meta.total,
        read: read.meta.total,
        resolved: resolved.meta.total,
        total: unread.meta.total + read.meta.total + resolved.meta.total
      });
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
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

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateEnquiryStatus(enquiryId, newStatus);
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      // Update item in current table view
      if (result) {
        setResult({
          ...result,
          data: result.data.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
        });
      }
      // Refresh count badges
      void loadData();
    } catch (err) {
      console.error('Failed to update enquiry status', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper to categorize lead type from subject
  const getLeadType = (subject: string = '') => {
    const s = subject.toLowerCase();
    if (s.includes('volunteer')) return 'VOLUNTEER';
    if (s.includes('partnership') || s.includes('csr') || s.includes('collaborate')) return 'PARTNERSHIP';
    return 'GENERAL';
  };

  // Filter items client-side by search query and type filter
  const filteredEnquiries = useMemo(() => {
    if (!result?.data) return [];
    return result.data.filter((item) => {
      // Type filter
      if (typeFilter !== 'ALL') {
        const itemType = getLeadType(item.subject);
        if (itemType !== typeFilter) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q))
      );
    });
  }, [result?.data, searchQuery, typeFilter]);

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enquiries &amp; Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming volunteer applications, partnership proposals, and contact enquiries.
          </p>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => updateFilter('status', 'ALL')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border cursor-pointer ${statusFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          All <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'ALL' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-500'}`}>{counts.total}</span>
        </button>
        <button 
          onClick={() => updateFilter('status', 'UNREAD')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border cursor-pointer ${statusFilter === 'UNREAD' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
        >
          New / Unread <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'UNREAD' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>{counts.unread}</span>
        </button>
        <button 
          onClick={() => updateFilter('status', 'READ')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border cursor-pointer ${statusFilter === 'READ' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
        >
          In Progress <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'READ' ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-600'}`}>{counts.read}</span>
        </button>
        <button 
          onClick={() => updateFilter('status', 'RESOLVED')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border cursor-pointer ${statusFilter === 'RESOLVED' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'}`}
        >
          Resolved <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === 'RESOLVED' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>{counts.resolved}</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email, text..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Category / Lead Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="text-sm border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-700 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="ALL">All Types</option>
              <option value="VOLUNTEER">Volunteer Leads Only</option>
              <option value="PARTNERSHIP">Partnership Enquiries</option>
              <option value="GENERAL">General Enquiries</option>
            </select>
          </div>

          {/* Status Select */}
          <select
            className="text-sm border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-700 bg-white"
            value={statusFilter}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="ALL">Status: All</option>
            <option value="UNREAD">Status: New</option>
            <option value="READ">Status: In Progress</option>
            <option value="RESOLVED">Status: Resolved</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700">Contact</TableHead>
              <TableHead className="font-semibold text-gray-700">Type / Subject</TableHead>
              <TableHead className="font-semibold text-gray-700">Phone</TableHead>
              <TableHead className="font-semibold text-gray-700">Received</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-700 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3.5 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">No enquiries found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search query.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enquiry) => {
                const leadType = getLeadType(enquiry.subject);
                const isVolunteer = leadType === 'VOLUNTEER';
                const isPartnership = leadType === 'PARTNERSHIP';

                return (
                  <TableRow key={enquiry.id} className="hover:bg-gray-50/70 group border-b border-gray-100 last:border-0">
                    <TableCell>
                      <p className="font-bold text-gray-900">{enquiry.name}</p>
                      <p className="text-xs text-gray-500">{enquiry.email}</p>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 mb-1">
                        {isVolunteer && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                            <Smile className="w-3 h-3 text-sky-600" />
                            Volunteer Lead
                          </span>
                        )}
                        {isPartnership && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                            <HeartHandshake className="w-3 h-3 text-purple-600" />
                            Partnership
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 max-w-[220px] truncate text-sm" title={enquiry.subject}>
                        {enquiry.subject}
                      </p>
                      <p className="text-xs text-gray-500 max-w-[220px] truncate" title={enquiry.message}>
                        {enquiry.message}
                      </p>
                    </TableCell>

                    <TableCell>
                      {enquiry.phone ? (
                        <a 
                          href={`tel:${enquiry.phone}`} 
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{enquiry.phone}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-gray-600 font-medium">{formatDate(enquiry.created_at)}</p>
                    </TableCell>

                    <TableCell>
                      {enquiry.status === 'UNREAD' && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold border-0 text-[11px]">
                          NEW
                        </Badge>
                      )}
                      {enquiry.status === 'READ' && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-bold border-0 text-[11px]">
                          IN PROGRESS
                        </Badge>
                      )}
                      {enquiry.status === 'RESOLVED' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold border-0 text-[11px]">
                          RESOLVED
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <button 
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <Pagination currentPage={page} totalPages={result.meta.totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* ─── LEAD / ENQUIRY DETAIL MODAL ────────────────────────────── */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getLeadType(selectedEnquiry.subject) === 'VOLUNTEER' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                      <Smile className="w-3.5 h-3.5 text-sky-600" />
                      Volunteer Application
                    </span>
                  )}
                  {getLeadType(selectedEnquiry.subject) === 'PARTNERSHIP' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                      <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                      Partnership Lead
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    ID #{selectedEnquiry.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedEnquiry.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Received on {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Quick Contact Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                  <a 
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5 truncate"
                  >
                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="truncate">{selectedEnquiry.email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone / WhatsApp</span>
                  {selectedEnquiry.phone ? (
                    <div className="flex items-center gap-3">
                      <a 
                        href={`tel:${selectedEnquiry.phone}`}
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                        <span>{selectedEnquiry.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not provided</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Subject</span>
                <p className="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                  {selectedEnquiry.subject}
                </p>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Message / Details</span>
                <div className="p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 font-normal leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Update Lead Status
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdatingStatus || selectedEnquiry.status === 'UNREAD'}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'UNREAD')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedEnquiry.status === 'UNREAD'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    Mark as New
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus || selectedEnquiry.status === 'READ'}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'READ')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedEnquiry.status === 'READ'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                  >
                    Mark In Progress
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus || selectedEnquiry.status === 'RESOLVED'}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'RESOLVED')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedEnquiry.status === 'RESOLVED'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    Mark as Resolved
                  </button>
                  {isUpdatingStatus && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-2" />
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

