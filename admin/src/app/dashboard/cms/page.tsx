'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Tag, FolderOpen, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  getBlogCategories,
  getBlogTags,
  createBlogCategory,
  deleteBlogCategory,
  createBlogTag,
  deleteBlogTag,
} from '@/lib/cms.api';
import type { BlogCategory, BlogTag } from '@/lib/types';

export default function CmsIndexPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const [cats, tgs] = await Promise.all([getBlogCategories(), getBlogTags()]);
        if (!cancelled) { setCategories(cats); setTags(tgs); }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadMeta();
    return () => { cancelled = true; };
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    setAddingCategory(true);
    setCategoryError(null);
    try {
      const created = await createBlogCategory(name);
      setCategories((prev) => [...prev, created]);
      setNewCategory('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setCategoryError(axiosErr?.response?.data?.message ?? 'Failed to add category.');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteBlogCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setCategoryError(axiosErr?.response?.data?.message ?? 'Cannot delete this category.');
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (!name) return;
    setAddingTag(true);
    setTagError(null);
    try {
      const created = await createBlogTag(name);
      setTags((prev) => [...prev, created]);
      setNewTag('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setTagError(axiosErr?.response?.data?.message ?? 'Failed to add tag.');
    } finally {
      setAddingTag(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteBlogTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setTagError(axiosErr?.response?.data?.message ?? 'Cannot delete this tag.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage blog posts, categories, and tags for the CHAH Foundation website.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          title="Blog Posts"
          description="View, create, and publish articles"
          href="/dashboard/cms/blogs"
          ctaLabel="Manage Posts"
        />
        <QuickAction
          icon={<Plus className="h-6 w-6 text-green-600" />}
          title="New Post"
          description="Write a new blog article"
          href="/dashboard/cms/blogs/new"
          ctaLabel="Create Post"
        />
        <QuickAction
          icon={<FolderOpen className="h-6 w-6 text-purple-600" />}
          title="Taxonomy"
          description="Categories & Tags below"
          href="#categories"
          ctaLabel="Jump to Taxonomy"
          scroll
        />
        <QuickAction
          icon={<ImageIcon className="h-6 w-6 text-orange-600" />}
          title="Media Library"
          description="Manage site images and uploads"
          href="/dashboard/cms/media"
          ctaLabel="View Media"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Categories ─────────────────────────────────────────────────────── */}
        <div id="categories" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Categories</h2>
            <span className="ml-auto text-xs text-gray-400">{categories.length}</span>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <Input
              id="new-category-input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name…"
              disabled={addingCategory}
              className="flex-1 h-8 text-sm"
              maxLength={255}
              aria-label="New category name"
            />
            <button
              type="submit"
              disabled={addingCategory || !newCategory.trim()}
              id="add-category-btn"
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </form>
          {categoryError && (
            <p className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100" role="alert">
              {categoryError}
            </p>
          )}

          {/* Category List */}
          <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="px-4 py-3">
                  <Skeleton className="h-4 w-48" />
                </li>
              ))
            ) : categories.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                No categories yet. Add one above.
              </li>
            ) : (
              categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 group">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="ml-2 font-mono text-xs text-gray-400">/{cat.slug}</span>
                  </div>
                  <button
                    onClick={() => void handleDeleteCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all focus:opacity-100"
                    aria-label={`Delete category ${cat.name}`}
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* ── Tags ─────────────────────────────────────────────────────────── */}
        <div id="tags" className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Tags</h2>
            <span className="ml-auto text-xs text-gray-400">{tags.length}</span>
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <Input
              id="new-tag-input"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name…"
              disabled={addingTag}
              className="flex-1 h-8 text-sm"
              maxLength={255}
              aria-label="New tag name"
            />
            <button
              type="submit"
              disabled={addingTag || !newTag.trim()}
              id="add-tag-btn"
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </form>
          {tagError && (
            <p className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100" role="alert">
              {tagError}
            </p>
          )}

          {/* Tags Cloud + List */}
          <div className="px-4 py-4 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            ) : tags.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">
                No tags yet. Add one above.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <Tag className="h-3 w-3 text-gray-400" />
                    {tag.name}
                    <button
                      onClick={() => void handleDeleteTag(tag.id)}
                      className="ml-0.5 text-gray-300 group-hover:text-red-500 transition-colors"
                      aria-label={`Delete tag ${tag.name}`}
                      title="Delete tag"
                    >
                      <span aria-hidden>×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function QuickAction({
  icon,
  title,
  description,
  href,
  ctaLabel,
  scroll = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  scroll?: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (scroll && href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-left w-full bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      <span className="mt-3 inline-block text-sm font-medium text-blue-600 group-hover:underline">
        {ctaLabel} →
      </span>
    </button>
  );
}
