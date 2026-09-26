'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination';
import { getAuditLogs } from '@/lib/operations.api';
import { formatDate } from '@/lib/utils';
import type { AuditLog, PaginatedResponse } from '@/lib/types';
import { Activity, User, ShieldAlert } from 'lucide-react';

const PAGE_LIMIT = 20;

export default function AuditLogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const entityTypeFilter = searchParams.get('entity_type') ?? 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setLoading(true);
      try {
        const data = await getAuditLogs({
          page,
          limit: PAGE_LIMIT,
          entity_type: entityTypeFilter !== 'ALL' ? entityTypeFilter : undefined,
        });
        if (!cancelled) setResult(data);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLogs();
    return () => { cancelled = true; };
  }, [page, entityTypeFilter]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') {
      params.delete('entity_type');
    } else {
      params.set('entity_type', value);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">System Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and review administrative actions across the platform for security and compliance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="entity-filter" className="text-sm text-gray-600">Entity Type:</label>
        <select
          id="entity-filter"
          className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          value={entityTypeFilter}
          onChange={(e) => updateFilter(e.target.value)}
        >
          <option value="ALL">All Entities</option>
          <option value="DONATION">Donation</option>
          <option value="CAMPAIGN">Campaign</option>
          <option value="DONOR">Donor</option>
          <option value="USER">User</option>
          <option value="SETTINGS">Settings</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>IP / Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 align-top">
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell>
                    {log.user ? (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.user.first_name} {log.user.last_name}</p>
                          <p className="text-xs text-gray-500">{log.user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">System</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      log.action.includes('CREATE') ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      log.action.includes('DELETE') ? 'bg-red-50 text-red-700 ring-red-600/20' :
                      'bg-blue-50 text-blue-700 ring-blue-600/20'
                    }`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-gray-900">{log.entity_type}</p>
                    <p className="text-xs font-mono text-gray-500">ID: {log.entity_id}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {log.new_values || log.old_values ? (
                      <div className="max-h-24 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono text-gray-600">
                        {log.new_values && <div><span className="font-semibold text-green-600">New:</span> {JSON.stringify(log.new_values)}</div>}
                        {log.old_values && <div><span className="font-semibold text-red-600">Old:</span> {JSON.stringify(log.old_values)}</div>}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-600">{log.ip_address || 'Unknown IP'}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[150px]" title={log.user_agent || ''}>
                      {log.user_agent || 'Unknown Client'}
                    </p>
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
