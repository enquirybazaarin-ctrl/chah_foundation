'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getBlogCategories, getBlogTags } from '@/lib/cms.api';
import type { Blog, BlogCategory, BlogTag, BlogStatus, CreateBlogPayload, UpdateBlogPayload } from '@/lib/types';

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (payload: CreateBlogPayload | UpdateBlogPayload) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
}

const STATUS_OPTIONS: { label: string; value: BlogStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

const nativeSelectClass =
  'h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const helpClass = 'mt-1 text-xs text-gray-400';
const errorClass = 'mt-1 text-xs text-red-600';

export function BlogForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
  submitError,
}: BlogFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [allTags, setAllTags] = useState<BlogTag[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category_id ? String(initialData.category_id) : ''
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [status, setStatus] = useState<BlogStatus>(initialData?.status ?? 'DRAFT');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialData?.tags?.map((t) => t.id) ?? []
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load categories and tags in parallel
  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const [cats, tags] = await Promise.all([getBlogCategories(), getBlogTags()]);
        if (!cancelled) {
          setCategories(cats);
          setAllTags(tags);
        }
      } catch {
        // Non-critical
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    }
    void loadMeta();
    return () => { cancelled = true; };
  }, []);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 1) {
      errors.title = 'Title is required.';
    }
    if (title.trim().length > 255) {
      errors.title = 'Title must be 255 characters or fewer.';
    }
    if (!categoryId) {
      errors.categoryId = 'Please select a category.';
    }
    if (excerpt && excerpt.length > 1000) {
      errors.excerpt = 'Excerpt must be 1000 characters or fewer.';
    }
    if (!content.trim()) {
      errors.content = 'Content is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateBlogPayload = {
      title: title.trim(),
      category_id: Number(categoryId),
      content: content.trim(),
      status,
      tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };
    if (excerpt.trim()) payload.excerpt = excerpt.trim();

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700"
        >
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Title + Status Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="blog-title" className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="blog-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clean Water Initiative: Year Two Report"
            maxLength={255}
            disabled={isSubmitting}
            aria-describedby="blog-title-error"
            aria-invalid={!!fieldErrors.title}
          />
          {fieldErrors.title && (
            <p id="blog-title-error" className={errorClass}>{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="blog-status" className={labelClass}>
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="blog-status"
            className={nativeSelectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogStatus)}
            disabled={isSubmitting}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className={helpClass}>
            {status === 'DRAFT' && 'Visible only to admins.'}
            {status === 'PUBLISHED' && 'Visible to the public.'}
            {status === 'ARCHIVED' && 'Hidden from public and admins.'}
          </p>
        </div>
      </div>

      {/* Category + Tags Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="blog-category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="blog-category"
            className={nativeSelectClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting || metaLoading}
            aria-describedby="blog-category-error"
            aria-invalid={!!fieldErrors.categoryId}
          >
            <option value="">
              {metaLoading ? 'Loading categories…' : 'Select a category'}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
          {fieldErrors.categoryId && (
            <p id="blog-category-error" className={errorClass}>{fieldErrors.categoryId}</p>
          )}
        </div>

        {/* Tags: toggle chip selection */}
        <div>
          <p className={labelClass}>Tags</p>
          {metaLoading ? (
            <p className="text-sm text-gray-400">Loading tags…</p>
          ) : allTags.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No tags available.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1" role="group" aria-label="Select tags">
              {allTags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    disabled={isSubmitting}
                    aria-pressed={selected}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {selected && <X className="h-3 w-3" />}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="blog-excerpt" className={labelClass}>Excerpt</label>
        <textarea
          id="blog-excerpt"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[80px] resize-y"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A short summary of the post (shown in listings)…"
          maxLength={1000}
          disabled={isSubmitting}
          aria-describedby="blog-excerpt-help blog-excerpt-error"
          aria-invalid={!!fieldErrors.excerpt}
        />
        <p id="blog-excerpt-help" className={helpClass}>
          {excerpt.length}/1000 characters. Optional — used in blog listing previews.
        </p>
        {fieldErrors.excerpt && (
          <p id="blog-excerpt-error" className={errorClass}>{fieldErrors.excerpt}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="blog-content" className={labelClass}>
          Content (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="blog-content"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[360px] resize-y font-mono text-xs leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<h2>Introduction</h2>&#10;<p>Your blog content here…</p>"
          disabled={isSubmitting}
          aria-describedby="blog-content-help blog-content-error"
          aria-invalid={!!fieldErrors.content}
        />
        <p id="blog-content-help" className={helpClass}>
          HTML is accepted. Content is sanitised server-side before storage.
        </p>
        {fieldErrors.content && (
          <p id="blog-content-error" className={errorClass}>{fieldErrors.content}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          id="blog-submit-btn"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
