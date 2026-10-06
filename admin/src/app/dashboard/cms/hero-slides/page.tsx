'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  ExternalLink, 
  Sparkles, 
  Check, 
  X,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  getHeroSlidesAdmin, 
  createHeroSlide, 
  updateHeroSlide, 
  toggleHeroSlide, 
  deleteHeroSlide 
} from '@/lib/hero-slides.api';
import { uploadMedia } from '@/lib/media.api';
import type { HeroSlide, CreateHeroSlidePayload } from '@/lib/types';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    highlight: '',
    tag: '',
    description: '',
    image_url: '',
    media_id: undefined as string | undefined,
    primary_button_text: 'Donate Now',
    primary_button_url: '/donate',
    secondary_button_text: 'See Real Impact',
    secondary_button_url: '/campaigns',
    sort_order: 1,
    is_active: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await getHeroSlidesAdmin();
      setSlides(data);
    } catch {
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      highlight: '',
      tag: '',
      description: '',
      image_url: '',
      media_id: undefined,
      primary_button_text: 'Donate Now',
      primary_button_url: '/donate',
      secondary_button_text: 'See Real Impact',
      secondary_button_url: '/campaigns',
      sort_order: slides.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      highlight: slide.highlight || '',
      tag: slide.tag || '',
      description: slide.description || '',
      image_url: slide.image_url,
      media_id: slide.media_id || undefined,
      primary_button_text: slide.primary_button_text || 'Donate Now',
      primary_button_url: slide.primary_button_url || '/donate',
      secondary_button_text: slide.secondary_button_text || 'See Real Impact',
      secondary_button_url: slide.secondary_button_url || '/campaigns',
      sort_order: slide.sort_order,
      is_active: slide.is_active,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const media = await uploadMedia(file);
      setFormData((prev) => ({
        ...prev,
        image_url: media.url.startsWith('http') ? media.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${media.url}`,
        media_id: media.id,
      }));
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image. Make sure it is JPEG/PNG/WebP under 5MB.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.image_url.trim()) {
      toast.error('Image URL is required');
      return;
    }

    setActionLoading('saving');
    try {
      const payload: CreateHeroSlidePayload = {
        title: formData.title.trim(),
        highlight: formData.highlight.trim() || undefined,
        tag: formData.tag.trim() || undefined,
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim(),
        media_id: formData.media_id,
        primary_button_text: formData.primary_button_text.trim() || undefined,
        primary_button_url: formData.primary_button_url.trim() || undefined,
        secondary_button_text: formData.secondary_button_text.trim() || undefined,
        secondary_button_url: formData.secondary_button_url.trim() || undefined,
        sort_order: Number(formData.sort_order) || 0,
        is_active: formData.is_active,
      };

      if (editingSlide) {
        await updateHeroSlide(editingSlide.id, payload);
        toast.success('Slide updated successfully');
      } else {
        await createHeroSlide(payload);
        toast.success('Slide created successfully');
      }
      setIsModalOpen(false);
      await fetchSlides();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message || 'Failed to save slide');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (slide: HeroSlide) => {
    setActionLoading(`toggle-${slide.id}`);
    try {
      const updated = await toggleHeroSlide(slide.id, !slide.is_active);
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? updated : s)));
      toast.success(updated.is_active ? 'Slide activated' : 'Slide deactivated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm(`Are you sure you want to delete slide "${slide.title}"?`)) return;

    setActionLoading(`delete-${slide.id}`);
    try {
      await deleteHeroSlide(slide.id);
      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
      toast.success('Slide deleted successfully');
    } catch {
      toast.error('Failed to delete slide');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          href="/dashboard/cms"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to CMS
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-600" />
              Hero Slider Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the slideshow banners, headlines, and call-to-action buttons on the public home page.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Slide
          </button>
        </div>
      </div>

      {/* Slides List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden p-4 space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-xl mx-auto">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No slides configured yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            The website is currently using fallback slides. Create your first custom slide from here!
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" /> Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md ${
                slide.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50/50'
              }`}
            >
              {/* Image Preview & Badges */}
              <div className="relative h-48 w-full bg-gray-900 overflow-hidden group">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback image placeholder
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Sort Order Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-semibold border border-white/10">
                  Order: #{slide.sort_order}
                </div>

                {/* Active / Inactive Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      slide.is_active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-700/90 text-gray-200'
                    }`}
                  >
                    {slide.is_active ? <Check className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Tag Pill overlay */}
                {slide.tag && (
                  <div className="absolute bottom-3 left-3 right-3 truncate text-xs font-medium text-emerald-300">
                    ★ {slide.tag}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {slide.title}{' '}
                    {slide.highlight && (
                      <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-base font-bold">
                        {slide.highlight}
                      </span>
                    )}
                  </h3>
                  {slide.description && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {slide.description}
                    </p>
                  )}

                  {/* Buttons Info */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs text-gray-600">
                    {slide.primary_button_text && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-700">
                        Primary: <strong>{slide.primary_button_text}</strong> ({slide.primary_button_url})
                      </span>
                    )}
                    {slide.secondary_button_text && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-700">
                        Secondary: <strong>{slide.secondary_button_text}</strong> ({slide.secondary_button_url})
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggle(slide)}
                    disabled={actionLoading === `toggle-${slide.id}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                      slide.is_active
                        ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {slide.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {slide.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Slide"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide)}
                      disabled={actionLoading === `delete-${slide.id}`}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tag / Category Badge */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Tag Line / Badge (Optional)
                </label>
                <Input
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. 80G Tax Benefit · 100% Transparent · Reaches within 48 hours"
                  className="text-sm"
                />
              </div>

              {/* Title & Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Main Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. A child is waiting for your"
                    required
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Highlighted Text (Green Accent)
                  </label>
                  <Input
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    placeholder="e.g. decision today."
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Right now, a child may go to sleep hungry or a mother may choose between medicine and food."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Background Image <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Enter image URL or upload image below"
                    required
                    className="text-sm flex-1"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload
                  </button>
                </div>
                {formData.image_url && (
                  <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Primary Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Primary Button Text
                  </label>
                  <Input
                    value={formData.primary_button_text}
                    onChange={(e) => setFormData({ ...formData, primary_button_text: e.target.value })}
                    placeholder="Donate Now"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Primary Button URL
                  </label>
                  <Input
                    value={formData.primary_button_url}
                    onChange={(e) => setFormData({ ...formData, primary_button_url: e.target.value })}
                    placeholder="/donate"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Secondary Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Secondary Button Text
                  </label>
                  <Input
                    value={formData.secondary_button_text}
                    onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
                    placeholder="See Real Impact"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Secondary Button URL
                  </label>
                  <Input
                    value={formData.secondary_button_url}
                    onChange={(e) => setFormData({ ...formData, secondary_button_url: e.target.value })}
                    placeholder="/campaigns"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Sort Order & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Display Sort Order
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="is_active_checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="is_active_checkbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Visible on Website (Active)
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'saving'}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {actionLoading === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
