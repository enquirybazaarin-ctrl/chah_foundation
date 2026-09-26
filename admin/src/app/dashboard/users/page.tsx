'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getUsers, updateUserStatus, User } from '@/lib/users.api';
import { formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Users, Search, MoreVertical, ShieldAlert } from 'lucide-react';

const PAGE_LIMIT = 10;

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<{users: User[], meta: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      setLoading(true);
      try {
        const queryParams: any = { page, limit: PAGE_LIMIT };
        if (search) queryParams.search = search;
        
        const data = await getUsers(queryParams);
        if (!cancelled) setResult(data);
      } catch (err: any) {
        if (err?.response?.status === 403) {
          toast.error('You do not have permission to view users');
        } else {
          toast.error('Failed to load users');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      void loadUsers();
    }, 300);

    return () => { 
      cancelled = true; 
      clearTimeout(timer);
    };
  }, [page, search]);

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleUserStatus = async (user: User) => {
    if (user.role.name === 'SUPER_ADMIN') {
      toast.error('Cannot modify super admin status');
      return;
    }

    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change this user to ${newStatus}?`)) return;

    setActionLoading(user.id);
    try {
      await updateUserStatus(user.id, newStatus);
      toast.success(`User marked as ${newStatus}`);
      if (result) {
        setResult({
          ...result,
          users: result.users.map(u => u.id === user.id ? { ...u, status: newStatus } : u)
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#1b4332]" />
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admin users and their access to the system.
          </p>
        </div>
        <button 
          onClick={() => toast('User creation coming soon!')}
          className="bg-[#1b4332] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#133023] transition-colors"
        >
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#eef6f1] border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1.5">Total Users</div>
            <div className="text-2xl font-extrabold text-[#1b4332]">{loading ? '...' : result?.meta?.total || 0}</div>
          </div>
          <div className="h-10 w-10 bg-[#d4edda] text-[#1b4332] rounded-full flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateURL('search', e.target.value);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1b4332] hover:bg-[#1b4332]">
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Name</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Email</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Role</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Joined</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5">Status</TableHead>
              <TableHead className="text-white font-semibold uppercase text-xs tracking-wide py-3 px-3.5 w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              result?.users?.map((user) => (
                <TableRow key={user.id} className="hover:bg-[#eef6f1] transition-colors group">
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 font-medium text-gray-900 group-even:bg-[#eef6f1]">
                    {user.first_name} {user.last_name || ''}
                    {user.role.name === 'SUPER_ADMIN' && (
                       <span title="Super Admin">
                         <ShieldAlert className="inline h-3 w-3 text-red-500 ml-1 mb-1" />
                       </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 text-sm text-gray-600 group-even:bg-[#eef6f1]">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                      {user.role.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1] text-sm text-gray-600">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    {user.status === 'ACTIVE' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#d4edda] text-[#1b5e20]">Active</span>}
                    {user.status === 'INACTIVE' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-700">Inactive</span>}
                    {user.status === 'SUSPENDED' && <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Suspended</span>}
                  </TableCell>
                  <TableCell className="py-3 px-3.5 border-b border-gray-200 group-even:bg-[#eef6f1]">
                    {user.role.name !== 'SUPER_ADMIN' ? (
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        disabled={actionLoading === user.id}
                        className={`${user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-[#1b4332] hover:text-[#133023]'} hover:underline font-medium text-sm disabled:opacity-50`}
                      >
                        {actionLoading === user.id ? '...' : (user.status === 'ACTIVE' ? 'Suspend' : 'Activate')}
                      </button>
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
    </div>
  );
}
