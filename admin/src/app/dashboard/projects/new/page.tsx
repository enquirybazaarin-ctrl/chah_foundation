'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, ImageIcon, Loader2, Trash2, Info } from 'lucide-react';
import { createProject } from '@/lib/projects.api';
import { uploadMedia } from '@/lib/media.api';
import type { CreateProjectPayload } from '@/lib/types';
import { PROGRAM_CATEGORIES } from '../[id]/page';

interface GalleryItem {
  id: string;
  media_id?: string | null;
  url: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProjectPayload>({
    title: '',
    slug: '',
    category: '',
    impact_summary: '',
    short_description: '',
    description: '',
    location: '',
    beneficiary_info: '',
    status: 'ACTIVE',
    start_date: '',
    end_date: '',
  });

  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      // Auto-populate Why heading
      impact_summary: selectedCategory ? `Why ${selectedCategory}?` : prev.impact_summary,
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingBanner(true);
    setError(null);

    try {
      const media = await uploadMedia(file);
      setBannerId(media.id);
      setBannerUrl(media.url);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload banner image.');
    } finally {
      setIsUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleRemoveBanner = () => {
    setBannerId(null);
    setBannerUrl(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingImages(true);
    setError(null);

    try {
      const uploadedResults = await Promise.all(
        files.map((file) => uploadMedia(file))
      );
      const newItems: GalleryItem[] = uploadedResults.map((media) => ({
        id: media.id,
        media_id: media.id,
        url: media.url,
      }));
      setGalleryImages((prev) => [...prev, ...newItems]);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image(s). Please try again.');
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const mediaIds = galleryImages
        .map((img) => Number(img.media_id || img.id))
        .filter((id) => !isNaN(id) && id > 0);

      const payload: CreateProjectPayload = {
        ...formData,
        slug: formData.slug || undefined,
        category: formData.category || undefined,
        featured_image_id: bannerId ? Number(bannerId) : undefined,
        impact_summary: formData.impact_summary || undefined,
        short_description: formData.short_description || undefined,
        description: formData.description || undefined,
        location: formData.location || undefined,
        beneficiary_info: formData.beneficiary_info || undefined,
        gallery_media_ids: mediaIds,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      };

      const newProject = await createProject(payload);
      router.push(`/dashboard/projects/${newProject.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/projects"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Back to projects"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new initiative or field project to the foundation.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8 space-y-8">

          {/* 1. TITLE & CATEGORY */}
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Project Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="e.g. Education Support Drive"
                  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category Dropdown - Directly below Project Title */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  required
                  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3 bg-white"
                  value={formData.category || ''}
                  onChange={handleCategoryChange}
                >
                  <option value="">-- Select Category / Program --</option>
                  {PROGRAM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Selecting a category automatically updates the &quot;Why&quot; heading below.
              </p>
            </div>
          </div>

          {/* 2. HERO BANNER IMAGE */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Hero Banner & Project Card Cover Image
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Used as the main banner on the program page and the cover photo for Our Impact cards on the homepage.
                </p>

                {/* Recommended Image Size Specs */}
                <div className="bg-lime-50/80 border border-lime-200/90 rounded-xl p-2.5 flex items-start gap-2 text-xs text-lime-950 mt-2">
                  <Info className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-lime-950">Recommended Image Specs: </span>
                    <span className="font-mono font-bold text-lime-900 bg-white/90 px-1.5 py-0.5 rounded border border-lime-200">800 × 600 px</span>
                    <span className="text-lime-800 font-medium"> (4:3 ratio) </span>
                    <span className="text-lime-750">for homepage Our Impact cards (zero cropping on mobile and desktop), or </span>
                    <span className="font-mono font-bold text-lime-900 bg-white/90 px-1.5 py-0.5 rounded border border-lime-200">1920 × 820 px</span>
                    <span className="text-lime-750"> for wide public header banners.</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-banner-image-input"
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer transition-colors ${
                    isUploadingBanner ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingBanner ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading Banner...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {bannerUrl ? 'Change Banner' : 'Upload Banner'}
                    </>
                  )}
                </label>
                <input
                  id="new-banner-image-input"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingBanner}
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
            </div>

            {bannerUrl ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-gray-200 shadow-xs group aspect-21/9 max-h-64 sm:max-h-72">
                <img
                  src={bannerUrl}
                  alt="Program Banner"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label
                    htmlFor="new-banner-image-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-gray-900 text-xs font-semibold hover:bg-white cursor-pointer shadow-md"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Replace Banner
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer shadow-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Banner
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">No custom hero banner uploaded</p>
                <p className="text-xs text-gray-500 mt-1">Upload a high-resolution landscape photo to display as the program header banner.</p>
              </div>
            )}
          </div>

          {/* 3. WHY SECTION: HEADING EDIT OPTION + DESCRIPTION */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Why Section</h2>
              <p className="text-xs text-gray-500">Auto-filled based on selected category, and fully customizable.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="impact_summary" className="block text-sm font-medium leading-6 text-gray-900">
                  Why Heading (Edit Option)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="impact_summary"
                    id="impact_summary"
                    placeholder="e.g. Why Education Support Drive?"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3 font-medium text-blue-900 bg-blue-50/30"
                    value={formData.impact_summary || ''}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This heading appears on the public program page above the Why description.
                </p>
              </div>

              <div>
                <label htmlFor="short_description" className="block text-sm font-medium leading-6 text-gray-900">
                  Why Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="short_description"
                    name="short_description"
                    rows={3}
                    placeholder="Describe the urgency and why this initiative is necessary for the community..."
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3"
                    value={formData.short_description || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. WHAT WE DO SECTION */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h2 className="text-base font-semibold text-gray-900">What We Do</h2>
              <p className="text-xs text-gray-500">Detail your organization&apos;s on-ground activities and execution plan.</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                What We Do Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Detail what activities and interventions our volunteers carry out on the ground..."
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 4. SUPPORTING IMAGES (GALLERY) */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Supporting Images
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Attach on-ground photos. Only clean images are displayed without any extra caption clutter.
                </p>
              </div>

              <div>
                <label
                  htmlFor="new-supporting-images-input"
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer transition-colors ${
                    isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Images
                    </>
                  )}
                </label>
                <input
                  id="new-supporting-images-input"
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploadingImages}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Supporting Images Grid - ONLY IMAGES DISPLAYED */}
            {galleryImages.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">No supporting images added yet</p>
                <p className="text-xs text-gray-500 mt-1">Upload photos to showcase this program drive on the website.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                {galleryImages.map((img, idx) => (
                  <div
                    key={`${img.id}-${idx}`}
                    className="group relative rounded-xl overflow-hidden aspect-4/3 bg-gray-100 border border-gray-200 shadow-xs"
                  >
                    <img
                      src={img.url}
                      alt={`Supporting image ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Delete button only */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 hover:bg-red-700 shadow-md transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. LOCATION, BENEFICIARY & STATUS */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-base font-semibold text-gray-900">Program Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    name="status"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3 bg-white"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PLANNED">Planned</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                  Location / Area
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="e.g. Pan-India across 15 States"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3"
                    value={formData.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="beneficiary_info" className="block text-sm font-medium leading-6 text-gray-900">
                  Beneficiary Group
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="beneficiary_info"
                    id="beneficiary_info"
                    placeholder="e.g. Underprivileged children & families"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm px-3"
                    value={formData.beneficiary_info || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50 rounded-b-xl">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImages}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
