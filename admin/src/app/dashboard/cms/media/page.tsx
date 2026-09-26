'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getMediaList, uploadMedia, deleteMedia } from '@/lib/media.api';
import type { Media, PaginatedResponse } from '@/lib/types';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // wait, for file size, I should write a simple formatter
import Image from 'next/image';

const PAGE_LIMIT = 24;

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function MediaLibraryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedResponse<Media> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    let cancelled = false;

    async function loadMedia() {
      setLoading(true);
      try {
        const data = await getMediaList({ page, limit: PAGE_LIMIT });
        if (!cancelled) setResult(data);
      } catch (err) {
        console.error('Failed to load media', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMedia();
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newMedia = await uploadMedia(file);
      // Optimistic or real reload: let's just reload the first page
      if (page === 1) {
        setResult(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            data: [newMedia, ...prev.data].slice(0, PAGE_LIMIT),
            meta: { ...prev.meta, total: prev.meta.total + 1 }
          };
        });
      } else {
        router.push(`${pathname}?page=1`);
      }
    } catch (err) {
      alert('Upload failed. Note: Only images up to 5MB are allowed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this file? This might break links on the frontend.')) return;
    try {
      await deleteMedia(id);
      setResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.filter(m => m.id !== id),
          meta: { ...prev.meta, total: prev.meta.total - 1 }
        };
      });
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  const getMediaUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${url}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage images used in blogs, campaigns, and projects.
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          ) : result?.data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3 text-gray-300" />
              <p>No media found.</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Upload your first image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {result?.data.map((media) => (
                <div key={media.id} className="group relative aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMediaUrl(media.url)}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end gap-2">
                      <a
                        href={getMediaUrl(media.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/20 text-white rounded hover:bg-white/40 transition-colors backdrop-blur-sm"
                        title="Open original"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(media.id, media.url)}
                        className="p-1.5 bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors backdrop-blur-sm"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium truncate" title={media.filename}>
                        {media.filename}
                      </p>
                      <p className="text-gray-300 text-[10px] mt-0.5">
                        {formatFileSize(media.file_size)} • {media.width}x{media.height}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {result && result.meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 mt-auto">
            <Pagination currentPage={page} totalPages={result.meta.totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
