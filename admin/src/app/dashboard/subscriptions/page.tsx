'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { getSubscriptions, updateSubscriptionStatus, type Subscription, type PaginatedSubscriptions } from '@/lib/subscriptions.api';
import { formatCurrency, formatDate, donorFullName } from '@/lib/utils';
import { toast } from 'sonner';

const PAGE_LIMIT = 20;

export default function SubscriptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedSubscriptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{sub: Subscription, action: 'PAUSE' | 'RESUME' | 'CANCEL'} | null>(null);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [frequencyFilter, setFrequencyFilter] = useState(searchParams.get('frequency') || 'ALL');

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    let cancelled = false;

    async function loadSubscriptions() {
      setLoading(true);
      try {
        const queryParams: any = { page, limit: PAGE_LIMIT };
        if (search) queryParams.search = search;
        if (statusFilter !== 'ALL') queryParams.status = statusFilter;
        if (frequencyFilter !== 'ALL') queryParams.frequency = frequencyFilter;
        
        const data = await getSubscriptions(queryParams);
        if (!cancelled) setResult(data);
      } catch (err) {
        console.error('Failed to load subscriptions', err);
        toast.error('Failed to load subscriptions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      void loadSubscriptions();
    }, 300); // Debounce

    return () => { 
      cancelled = true; 
      clearTimeout(timer);
    };
  }, [page, search, statusFilter, frequencyFilter]);

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleToggleStatusClick = (sub: Subscription, action: 'PAUSE' | 'RESUME' | 'CANCEL') => {
    setConfirmDialog({ sub, action });
  };

  const executeToggleStatus = async () => {
    if (!confirmDialog) return;
    const { sub, action } = confirmDialog;
    
    setConfirmDialog(null);
    setActionLoading(sub.id);
    let newStatus = 'ACTIVE';
    if (action === 'PAUSE') newStatus = 'PAUSED';
    if (action === 'CANCEL') newStatus = 'CANCELLED';
    
    try {
      await updateSubscriptionStatus(sub.id, newStatus);
      toast.success(`Subscription ${newStatus.toLowerCase()} successfully.`);
      
      // Update local state
      if (result) {
        setResult({
          ...result,
          data: result.data.map(s => s.id === sub.id ? { ...s, status: newStatus as any, next_billing_date: (newStatus === 'PAUSED' || newStatus === 'CANCELLED') ? null : s.next_billing_date } : s)
        });
      }
    } catch (err) {
      console.error('Failed to update subscription', err);
      toast.error('Failed to update subscription status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Recurring Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage recurring donor subscriptions and automatic payments.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#eef6f1] border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-500 mb-1.5">Total Subscriptions</div>
          <div className="text-2xl font-extrabold text-[#1b4332]">{loading ? '...' : result?.meta.total || 0}</div>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by ID, donor name, or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateURL('search', e.target.value);
            }}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              updateURL('status', e.target.value);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            value={frequencyFilter}
            onChange={(e) => {
              setFrequencyFilter(e.target.value);
              updateURL('frequency', e.target.value);
            }}
          >
            <option value="ALL">All Frequencies</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1b4332] hover:bg-[#1b4332]">
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Sub #</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Donor</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Amount</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Cause</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Frequency</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Next charge</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Status</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5 w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  No subscriptions found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((sub) => (
                <TableRow key={sub.id} className="hover:bg-[#eef6f1] transition-colors group">
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 font-mono text-xs text-gray-600 group-even:bg-[#eef6f1]">
                    {sub.subscription_number}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 font-medium text-gray-900 group-even:bg-[#eef6f1]">
                    <div className="flex flex-col">
                      <span>{donorFullName(sub.donor.first_name || '', sub.donor.last_name || '', false)}</span>
                      <span className="text-[11px] text-gray-500 font-normal">{sub.donor.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    {formatCurrency(Number(sub.amount))}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1] text-sm text-gray-600">
                    {sub.campaign?.title || 'General Fund'}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1] text-sm text-gray-600">
                    {sub.frequency}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1] text-sm text-gray-600">
                    {sub.next_billing_date ? formatDate(sub.next_billing_date) : '—'}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    {sub.status === 'ACTIVE' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#d4edda] text-[#1b5e20]">Active</span>}
                    {sub.status === 'PAUSED' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800">Paused</span>}
                    {sub.status === 'CANCELLED' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Cancelled</span>}
                    {sub.status === 'COMPLETED' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">Completed</span>}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    {sub.status === 'ACTIVE' || sub.status === 'PAUSED' ? (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatusClick(sub, sub.status === 'ACTIVE' ? 'PAUSE' : 'RESUME')}
                          disabled={actionLoading === sub.id}
                          className={`${sub.status === 'ACTIVE' ? 'text-amber-600 hover:text-amber-800' : 'text-[#1b4332] hover:text-[#133023]'} hover:underline font-medium text-sm disabled:opacity-50`}
                        >
                          {actionLoading === sub.id ? '...' : (sub.status === 'ACTIVE' ? 'Pause' : 'Resume')}
                        </button>
                        <button 
                          onClick={() => handleToggleStatusClick(sub, 'CANCEL')}
                          disabled={actionLoading === sub.id}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium text-sm disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
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

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setConfirmDialog(null)}
            aria-hidden="true"
          />
          
          {/* Modal Panel */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {confirmDialog.action === 'PAUSE' && (
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {confirmDialog.action === 'RESUME' && (
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {confirmDialog.action === 'CANCEL' && (
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {confirmDialog.action === 'PAUSE' ? 'Pause Subscription' : confirmDialog.action === 'RESUME' ? 'Resume Subscription' : 'Cancel Subscription'}
              </h3>
              <button 
                onClick={() => setConfirmDialog(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-1"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                You are about to <span className="font-semibold">{confirmDialog.action.toLowerCase()}</span> the recurring donation for <strong className="font-semibold text-gray-900">{donorFullName(confirmDialog.sub.donor.first_name || '', confirmDialog.sub.donor.last_name || '', false)}</strong>.
              </p>
              
              {confirmDialog.action === 'PAUSE' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Future automatic charges will be stopped until you manually resume this subscription.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {confirmDialog.action === 'CANCEL' && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        This action is irreversible. The donor will need to create a new subscription if they wish to donate again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-100">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Go Back
              </button>
              <button 
                onClick={executeToggleStatus}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center justify-center gap-2 min-w-[100px] ${
                  confirmDialog.action === 'PAUSE' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' 
                  : confirmDialog.action === 'CANCEL' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-[#1b4332] hover:bg-[#133023] focus:ring-[#1b4332]'
                }`}
              >
                {actionLoading === confirmDialog.sub.id ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  `Yes, ${confirmDialog.action === 'PAUSE' ? 'Pause' : confirmDialog.action === 'RESUME' ? 'Resume' : 'Cancel'} It`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
