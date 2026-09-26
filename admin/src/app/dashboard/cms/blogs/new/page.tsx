'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlogForm } from '@/components/cms/BlogForm';
import { createBlog } from '@/lib/cms.api';
import type { CreateBlogPayload, UpdateBlogPayload } from '@/lib/types';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateBlogPayload | UpdateBlogPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const blog = await createBlog(payload as CreateBlogPayload);
      router.push(`/dashboard/cms/blogs/${blog.id}?created=1`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        axiosErr?.response?.data?.message ?? 'Failed to create blog post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back Navigation */}
      <Link
        href="/dashboard/cms/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Back to blog posts list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog Posts
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">New Blog Post</h1>
          <p className="mt-1 text-sm text-gray-500">
            Save as Draft to review before publishing to the website.
          </p>
        </div>
        <div className="px-6 py-6">
          <BlogForm
            onSubmit={handleSubmit}
            submitLabel="Create Post"
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      </div>
    </div>
  );
}
