'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Archive, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BlogStatusBadge } from '@/components/ui/BlogStatusBadge';
import { BlogForm } from '@/components/cms/BlogForm';
import { getBlogById, updateBlog, archiveBlog } from '@/lib/cms.api';
import { formatDate } from '@/lib/utils';
import type { Blog, CreateBlogPayload, UpdateBlogPayload } from '@/lib/types';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get('created') === '1' ? 'Blog post created successfully!' : null
  );

  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadBlog() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getBlogById(id);
        if (!cancelled) setBlog(data);
      } catch {
        if (!cancelled) setLoadError('Blog post not found or failed to load.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadBlog();
    return () => { cancelled = true; };
  }, [id]);

  // Auto-dismiss success message after 5s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleUpdate = async (payload: CreateBlogPayload | UpdateBlogPayload) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateBlog(id, payload as UpdateBlogPayload);
      setBlog(updated);
      setSuccessMessage('Blog post updated successfully!');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        axiosErr?.response?.data?.message ?? 'Failed to update blog post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    setIsArchiving(true);
    try {
      const updated = await archiveBlog(id);
      setBlog(updated);
      setArchiveConfirm(false);
      setSuccessMessage('Blog post has been archived.');
    } catch {
      setSubmitError('Failed to archive blog post.');
    } finally {
      setIsArchiving(false);
    }
  };

  if (loadError) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-6 text-red-700 max-w-4xl">
        <p className="font-semibold">Error</p>
        <p className="mt-1 text-sm">{loadError}</p>
        <button className="mt-4 text-sm text-red-600 underline" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back Navigation */}
      <Link
        href="/dashboard/cms/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Back to blog posts"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog Posts
      </Link>

      {/* Success Banner */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-700"
        >
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {/* ── Blog Meta Card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-gray-800 to-gray-900">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-64 bg-gray-700" />
              <Skeleton className="h-4 w-32 bg-gray-700" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{blog?.title}</h1>
                <p className="mt-1 font-mono text-gray-400 text-sm truncate">/{blog?.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {blog && <BlogStatusBadge status={blog.status} />}
                {blog && blog.status === 'PUBLISHED' && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_WEBSITE_URL ?? ''}/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    aria-label="View live post"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View live
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meta Row */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 sm:grid-cols-4">
          <MetaCell label="Category" value={loading ? null : (blog?.category?.name ?? '—')} loading={loading} />
          <MetaCell
            label="Author"
            value={loading ? null : (blog?.author ? `${blog.author.first_name} ${blog.author.last_name}`.trim() : '—')}
            loading={loading}
          />
          <MetaCell
            label="Tags"
            value={loading ? null : (blog?.tags && blog.tags.length > 0 ? blog.tags.map(t => t.name).join(', ') : 'None')}
            loading={loading}
          />
          <MetaCell
            label="Created"
            value={loading ? null : (blog ? formatDate(blog.created_at) : '—')}
            loading={loading}
          />
        </div>
      </div>

      {/* ── Edit Form ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Post</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update the post details. Change status to <strong>Published</strong> to make it live.
          </p>
        </div>
        <div className="px-6 py-6">
          {loading ? (
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
              <Skeleton className="h-48 w-full" />
            </div>
          ) : blog ? (
            <BlogForm
              initialData={blog}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          ) : null}
        </div>
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────────────── */}
      {blog && blog.status !== 'ARCHIVED' && (
        <>
          <Separator />
          <div className="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-orange-50">
              <h2 className="text-base font-semibold text-orange-700">Archive Post</h2>
              <p className="mt-1 text-sm text-orange-600">
                Archiving hides this post from the public website. You can un-archive it later by changing the status to Draft or Published.
              </p>
            </div>
            <div className="px-6 py-5">
              {!archiveConfirm ? (
                <button
                  id="archive-blog-btn"
                  onClick={() => setArchiveConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  <Archive className="h-4 w-4" />
                  Archive Post
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-orange-700">
                    Are you sure you want to archive this post?
                  </span>
                  <button
                    id="confirm-archive-btn"
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
                  >
                    {isArchiving ? 'Archiving…' : 'Yes, Archive'}
                  </button>
                  <button
                    onClick={() => setArchiveConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Keep as is
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function MetaCell({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | null;
  loading: boolean;
}) {
  return (
    <div className="px-6 py-4">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1">
        {loading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <span className="text-sm font-medium text-gray-900">{value}</span>
        )}
      </dd>
    </div>
  );
}
