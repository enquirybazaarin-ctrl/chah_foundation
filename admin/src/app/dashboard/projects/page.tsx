'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectStatusBadge } from '@/components/ui/ProjectStatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { getProjectsAdmin } from '@/lib/projects.api';
import { formatDate } from '@/lib/utils';
import type { Project, PaginatedResponse, ProjectStatus } from '@/lib/types';

const PAGE_LIMIT = 20;

const STATUS_FILTER_OPTIONS: { label: string; value: ProjectStatus | 'ALL' }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Planned', value: 'PLANNED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On Hold', value: 'ON_HOLD' },
];

const nativeSelectClass =
  'h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';

export default function ProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const statusFilter = (searchParams.get('status') ?? 'ALL') as ProjectStatus | 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectsAdmin({ page, limit: PAGE_LIMIT });
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError('Failed to load projects. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProjects();
    return () => { cancelled = true; };
  }, [page]);

  // Filter client-side by status if admin list returns all, or can just rely on API if implemented
  const filteredData = statusFilter === 'ALL'
    ? result?.data
    : result?.data.filter((p) => p.status === statusFilter);

  const updateStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', value);
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
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage field projects and their activities.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          id="create-project-btn"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3">
        <label htmlFor="project-status-filter" className="text-sm text-gray-600">
          Filter:
        </label>
        <select
          id="project-status-filter"
          className={nativeSelectClass}
          value={statusFilter}
          onChange={(e) => updateStatusFilter(e.target.value)}
          aria-label="Filter by project status"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {result && (
          <span className="text-sm text-gray-400">
            {filteredData?.length ?? 0} of {result.meta.total} projects
          </span>
        )}
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
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  {statusFilter !== 'ALL'
                    ? `No ${statusFilter.toLowerCase()} projects.`
                    : 'No projects yet. Create your first one!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                >
                  <TableCell>
                    <div className="max-w-[320px]">
                      <p className="font-medium text-gray-900 truncate">{project.title}</p>
                      <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                        /{project.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {project.start_date ? formatDate(project.start_date) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {project.end_date ? formatDate(project.end_date) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(project.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                         href={`/dashboard/projects/${project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        aria-label={`Edit ${project.title}`}
                        title="Edit project"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500">
                {result.meta.total} project{result.meta.total !== 1 ? 's' : ''} total
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
