'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ExternalLink, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BlogStatusBadge } from '@/components/ui/BlogStatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { getBlogs } from '@/lib/cms.api';
import { formatDate } from '@/lib/utils';
import type { Blog, BlogStatus } from '@/lib/types';

const PAGE_LIMIT = 20;

const STATUS_OPTIONS: { label: string; value: BlogStatus | 'ALL' }[] = [
  { label: 'All Posts', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
];

const nativeSelectClass =
  'h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';

export default function CmsBlogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState<{ total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const statusFilter = (searchParams.get('status') ?? 'ALL') as BlogStatus | 'ALL';

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: PAGE_LIMIT,
          ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        };
        const result = await getBlogs(params);
        if (!cancelled) {
          setBlogs(result.blogs);
          setMeta({ total: result.meta.total, totalPages: result.meta.totalPages });
        }
      } catch {
        if (!cancelled) setError('Failed to load blog posts. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadBlogs();
    return () => { cancelled = true; };
  }, [page, statusFilter]);

  const updateFilter = (value: string) => {
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
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage content for the CHAH Foundation website.
          </p>
        </div>
        <Link
          href="/dashboard/cms/blogs/new"
          id="create-blog-btn"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <label htmlFor="blog-status-filter" className="text-sm text-gray-600">Status:</label>
        <select
          id="blog-status-filter"
          className={nativeSelectClass}
          value={statusFilter}
          onChange={(e) => updateFilter(e.target.value)}
          aria-label="Filter by blog status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {meta && (
          <span className="text-sm text-gray-400">
            {meta.total} post{meta.total !== 1 ? 's' : ''}
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
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-8 w-8 text-gray-300" />
                    <span>
                      {statusFilter !== 'ALL'
                        ? `No ${statusFilter.toLowerCase()} posts.`
                        : 'No blog posts yet. Write your first one!'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow
                  key={blog.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/cms/blogs/${blog.id}`)}
                >
                  <TableCell>
                    <div className="max-w-[260px]">
                      <p className="font-medium text-gray-900 truncate">{blog.title}</p>
                      <p className="text-xs text-gray-400 font-mono truncate mt-0.5">/{blog.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {blog.category?.name ?? '—'}
                  </TableCell>
                  <TableCell>
                    <BlogStatusBadge status={blog.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {blog.author
                      ? `${blog.author.first_name} ${blog.author.last_name}`.trim()
                      : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {blog.tags && blog.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(blog.created_at)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/cms/blogs/${blog.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors inline-flex"
                      aria-label={`Edit ${blog.title}`}
                      title="Edit post"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500">{meta.total} posts total</span>
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
