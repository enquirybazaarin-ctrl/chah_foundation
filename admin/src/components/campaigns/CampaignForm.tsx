'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  Image as ImageIcon, 
  UploadCloud, 
  Code, 
  LayoutTemplate, 
  Plus, 
  Trash2, 
  X, 
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getCampaignCategories } from '@/lib/campaigns.api';
import { uploadMedia } from '@/lib/media.api';
import type { Campaign, CampaignCategory, CreateCampaignPayload, UpdateCampaignPayload } from '@/lib/types';

interface CampaignFormProps {
  /** If provided, the form is in Edit mode. */
  initialData?: Campaign;
  onSubmit: (payload: CreateCampaignPayload | UpdateCampaignPayload) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
}

const nativeSelectClass =
  'h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50';

const textareaClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[220px] resize-y font-mono';

const plainTextareaClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[200px] resize-y';

const labelClass = 'block text-sm font-semibold text-gray-800 mb-1';
const helpClass = 'mt-1 text-xs text-gray-500';
const errorClass = 'mt-1 text-xs text-red-600 font-medium';

export function CampaignForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
  submitError,
}: CampaignFormProps) {
  const router = useRouter();
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const supportingFileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description ?? '');

  // Content extraction & clean state
  const rawInitContent = initialData?.content ?? '';
  const cleanInitContent = rawInitContent.replace(/<div class="campaign-gallery-data"[^>]*>[\s\S]*?<\/div>/g, '').trim();

  const [contentMode, setContentMode] = useState<'BUILDER' | 'HTML'>(cleanInitContent ? 'HTML' : 'BUILDER');
  const [rawContent, setRawContent] = useState(cleanInitContent);
  const [builderHeading, setBuilderHeading] = useState('');
  const [builderDesc, setBuilderDesc] = useState(cleanInitContent);

  // Cover Image
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featured_image_url ?? '');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Supporting Images Gallery
  const getInitialSupportingImages = (): string[] => {
    if (initialData?.supporting_images && Array.isArray(initialData.supporting_images) && initialData.supporting_images.length > 0) {
      return initialData.supporting_images;
    }
    if (initialData?.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
      return initialData.images.filter(img => img !== initialData.featured_image_url);
    }
    if (initialData?.content) {
      const match = initialData.content.match(/data-gallery='(.*?)'/) || initialData.content.match(/data-gallery="([^\"]*)"/);
      if (match) {
        try {
          const raw = match[1].replace(/&quot;/g, '"');
          return JSON.parse(raw);
        } catch {}
      }
    }
    return [];
  };

  const [supportingImages, setSupportingImages] = useState<string[]>(getInitialSupportingImages());
  const [supportingUrlInput, setSupportingUrlInput] = useState('');
  const [isUploadingSupporting, setIsUploadingSupporting] = useState(false);

  // Target and Raised amounts (Simple and Clean)
  const [targetAmount, setTargetAmount] = useState(
    initialData?.target_amount ? String(parseFloat(initialData.target_amount)) : ''
  );
  const [raisedAmount, setRaisedAmount] = useState(
    initialData?.raised_amount ? String(parseFloat(initialData.raised_amount)) : ''
  );
  const [supportersCount, setSupportersCount] = useState(
    initialData?.supporters_count ? String(initialData.supporters_count) : '0'
  );

  // Beneficiary details
  const [beneficiaryName, setBeneficiaryName] = useState(initialData?.beneficiary_name ?? '');
  const [beneficiaryAge, setBeneficiaryAge] = useState(
    initialData?.beneficiary_age ? String(initialData.beneficiary_age) : ''
  );
  const [location, setLocation] = useState(initialData?.location ?? '');

  // Visibility and display settings
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [isUrgent, setIsUrgent] = useState(initialData?.is_urgent ?? false);
  const [urgencyLabel, setUrgencyLabel] = useState(initialData?.urgency_label ?? '');
  const [ctaButtonText, setCtaButtonText] = useState(initialData?.cta_button_text ?? 'Help Now');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ? String(initialData.sort_order) : '0');
  const [startDate, setStartDate] = useState(
    initialData?.start_date ? initialData.start_date.slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState(
    initialData?.end_date ? initialData.end_date.slice(0, 16) : ''
  );

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const data = await getCampaignCategories();
        if (!cancelled) {
          setCategories(data);
          // If in create mode and no category selected, pre-select first category
          if (!categoryId && data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      } catch {
        // Non-critical; form still usable
      } finally {
        if (!cancelled) setCatLoading(false);
      }
    }
    void loadCategories();
    return () => { cancelled = true; };
  }, [categoryId]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const media = await uploadMedia(file);
      setFeaturedImageUrl(media.url);
    } catch {
      alert('Cover photo upload failed. Please try again or provide an image URL.');
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const handleSupportingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingSupporting(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const media = await uploadMedia(files[i]);
        if (media?.url) uploadedUrls.push(media.url);
      }
      setSupportingImages((prev) => [...prev, ...uploadedUrls]);
    } catch {
      alert('One or more supporting image uploads failed. Please try again.');
    } finally {
      setIsUploadingSupporting(false);
      if (supportingFileInputRef.current) supportingFileInputRef.current.value = '';
    }
  };

  const handleAddSupportingUrl = () => {
    const url = supportingUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    setSupportingImages((prev) => [...prev, url]);
    setSupportingUrlInput('');
  };

  const handleRemoveSupportingImage = (indexToRemove: number) => {
    setSupportingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }
    if (!categoryId) {
      errors.categoryId = 'Please select a campaign category.';
    }
    if (!shortDescription.trim()) {
      errors.shortDescription = 'Please provide a short description for cards and previews.';
    }
    if (targetAmount && (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0)) {
      errors.targetAmount = 'Target amount must be a positive number.';
    }
    if (raisedAmount && (isNaN(Number(raisedAmount)) || Number(raisedAmount) < 0)) {
      errors.raisedAmount = 'Raised amount must be zero or a positive number.';
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      errors.endDate = 'End date must be after start date.';
    }
    
    if (contentMode === 'HTML') {
      if (!rawContent.trim()) {
        errors.content = 'Full campaign description/content is required.';
      }
    } else {
      if (!builderDesc.trim() && !shortDescription.trim()) {
        errors.content = 'Full campaign description is required.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateBuilderHtml = (descText?: string) => {
    const textToUse = descText || builderDesc.trim() || shortDescription.trim();
    let html = `<div class="campaign-story">`;
    if (builderHeading) {
      html += `\n  <h2>${builderHeading}</h2>`;
    }
    if (textToUse) {
      const paragraphs = textToUse.split('\n').filter(p => p.trim() !== '');
      paragraphs.forEach(p => {
        html += `\n  <p>${p}</p>`;
      });
    }
    html += `\n</div>`;
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalContent = contentMode === 'BUILDER' ? generateBuilderHtml() : rawContent.trim();

    const payload: CreateCampaignPayload = {
      title: title.trim(),
      category_id: categoryId,
      short_description: shortDescription.trim() || undefined,
      beneficiary_name: beneficiaryName.trim() || undefined,
      beneficiary_age: beneficiaryAge ? Number(beneficiaryAge) : undefined,
      location: location.trim() || undefined,
      target_amount: targetAmount ? Number(targetAmount) : undefined,
      raised_amount: raisedAmount ? Number(raisedAmount) : 0,
      featured_image_url: featuredImageUrl.trim() || undefined,
      supporting_images: supportingImages,
      is_featured: isFeatured,
      is_urgent: isUrgent,
      urgency_label: urgencyLabel.trim() || undefined,
      cta_button_text: ctaButtonText.trim() || 'Help Now',
      sort_order: sortOrder ? Number(sortOrder) : 0,
      supporters_count: supportersCount ? Number(supportersCount) : 0,
      content: finalContent,
    };
    if (startDate) payload.start_date = new Date(startDate).toISOString();
    if (endDate) payload.end_date = new Date(endDate).toISOString();

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 shadow-xs"
        >
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-semibold text-red-800">Unable to save campaign</p>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Basic Campaign Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Campaign Information
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Basic identity and category categorization</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="campaign-title" className={labelClass}>
            Campaign Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="campaign-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Help Amit continue his schooling & education"
            maxLength={255}
            disabled={isSubmitting}
            className="text-base"
            aria-describedby="campaign-title-error"
            aria-invalid={!!fieldErrors.title}
          />
          {fieldErrors.title ? (
            <p id="campaign-title-error" className={errorClass}>{fieldErrors.title}</p>
          ) : (
            <p className={helpClass}>Give a descriptive and empathetic campaign title.</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="campaign-category" className={labelClass}>
            Main Campaign Category <span className="text-red-500">*</span>
          </label>
          <select
            id="campaign-category"
            className={nativeSelectClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting || catLoading}
            aria-describedby="campaign-category-error"
            aria-invalid={!!fieldErrors.categoryId}
          >
            <option value="">{catLoading ? 'Loading main categories…' : 'Select a campaign category'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.slug ? `(${cat.slug})` : ''}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId ? (
            <p id="campaign-category-error" className={errorClass}>{fieldErrors.categoryId}</p>
          ) : (
            <p className={helpClass}>
              The selected category determines where this campaign appears on the website homepage and category hubs (Medical Emergency, Education, Elder Care, Food & Hunger).
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="campaign-short-desc" className={labelClass}>
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="campaign-short-desc"
            rows={3}
            className="w-full text-sm rounded-md border border-gray-300 bg-white p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Summarize the core emergency/need in 1–2 impactful sentences. This appears on campaign cards across the homepage."
            disabled={isSubmitting}
          />
          {fieldErrors.shortDescription && (
            <p className={errorClass}>{fieldErrors.shortDescription}</p>
          )}
        </div>
      </div>

      {/* STEP 2: Full Description / Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              Full Campaign Story & Description <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Detailed description shown on the campaign's dedicated page</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                if (contentMode === 'HTML' && rawContent) setBuilderDesc(rawContent);
                setContentMode('BUILDER');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                contentMode === 'BUILDER' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Plain Text
            </button>
            <button
              type="button"
              onClick={() => {
                if (contentMode === 'BUILDER' && builderDesc) setRawContent(generateBuilderHtml());
                setContentMode('HTML');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                contentMode === 'HTML' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> HTML Mode
            </button>
          </div>
        </div>

        {contentMode === 'BUILDER' ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Section Heading (Optional)</label>
              <Input
                value={builderHeading}
                onChange={(e) => setBuilderHeading(e.target.value)}
                placeholder="e.g. Why Amit's education requires immediate support"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className={labelClass}>Detailed Story (Write in plain paragraphs)</label>
              <textarea
                className={plainTextareaClass}
                value={builderDesc}
                onChange={(e) => setBuilderDesc(e.target.value)}
                placeholder="Write the full case background, hospital details, school needs, or family situation here. Separate each paragraph with an empty line."
                disabled={isSubmitting}
              />
            </div>
          </div>
        ) : (
          <div>
            <textarea
              className={textareaClass}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="<p>Full HTML content for the campaign story...</p>"
              disabled={isSubmitting}
            />
          </div>
        )}
        {fieldErrors.content && <p className={errorClass}>{fieldErrors.content}</p>}
      </div>

      {/* STEP 3: Thumbnail & Supporting Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
              Thumbnail & Supporting Images
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Primary cover image and additional gallery photographs</p>
          </div>
        </div>

        {/* Thumbnail / Cover Photo */}
        <div>
          <label className={labelClass}>Thumbnail / Cover Image</label>
          <p className={helpClass}>This image appears as the main thumbnail on homepage cards and at the top of the detail page.</p>
          
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="Image URL (e.g. https://...)"
              disabled={isSubmitting}
              className="flex-1"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverFileInputRef}
              disabled={isSubmitting || isUploadingCover}
              onChange={handleCoverUpload}
            />
            <button
              type="button"
              disabled={isSubmitting || isUploadingCover}
              onClick={() => coverFileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 shrink-0"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              {isUploadingCover ? 'Uploading Cover…' : 'Upload Thumbnail'}
            </button>
          </div>

          {featuredImageUrl && (
            <div className="mt-3 flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="relative w-28 h-20 rounded-md overflow-hidden border border-gray-300 bg-white shrink-0">
                <img src={featuredImageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">Primary Thumbnail Active</p>
                <p className="text-[11px] text-gray-500 truncate">{featuredImageUrl}</p>
                <button
                  type="button"
                  onClick={() => setFeaturedImageUrl('')}
                  className="mt-1 text-xs text-red-600 hover:underline"
                >
                  Remove Cover Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Supporting Images Gallery */}
        <div className="border-t border-gray-100 pt-5">
          <label className={labelClass}>Supporting Images (Gallery)</label>
          <p className={helpClass}>Upload multiple supporting photographs (e.g. medical bills, school kits, beneficiary photos, progress updates). These display in an interactive gallery slider on the campaign detail page.</p>

          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={supportingFileInputRef}
              disabled={isSubmitting || isUploadingSupporting}
              onChange={handleSupportingUpload}
            />
            <button
              type="button"
              disabled={isSubmitting || isUploadingSupporting}
              onClick={() => supportingFileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              {isUploadingSupporting ? 'Uploading Images…' : 'Upload Supporting Images (Multi-select)'}
            </button>

            <div className="flex items-center gap-2 flex-1">
              <Input
                value={supportingUrlInput}
                onChange={(e) => setSupportingUrlInput(e.target.value)}
                placeholder="Or paste an image URL..."
                className="text-xs"
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSupportingUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSupportingUrl}
                disabled={!supportingUrlInput.trim() || isSubmitting}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>
          </div>

          {/* Gallery Previews Grid */}
          {supportingImages.length > 0 ? (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  {supportingImages.length} Supporting Image{supportingImages.length > 1 ? 's' : ''} Added
                </span>
                <button
                  type="button"
                  onClick={() => setSupportingImages([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {supportingImages.map((url, idx) => (
                  <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs">
                    <img src={url} alt={`Supporting photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveSupportingImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-105 transition-all shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 p-4 rounded-lg border border-dashed border-gray-200 text-center text-xs text-gray-400">
              No supporting images added yet. Click &quot;Upload Supporting Images&quot; to add photos.
            </div>
          )}
        </div>
      </div>

      {/* STEP 4: Target & Raised Amounts (Simple and Clean) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              Funding Goal & Financials
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Simple and clean setup for campaign target and raised amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Target Amount */}
          <div>
            <label htmlFor="campaign-target" className={labelClass}>
              Target Goal Amount (INR ₹)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">₹</span>
              <Input
                id="campaign-target"
                type="number"
                min={0}
                step={1}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="pl-7 font-semibold text-base"
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.targetAmount ? (
              <p className={errorClass}>{fieldErrors.targetAmount}</p>
            ) : (
              <p className={helpClass}>Total fundraising goal needed for this cause.</p>
            )}
          </div>

          {/* Raised Amount */}
          <div>
            <label htmlFor="campaign-raised" className={labelClass}>
              Raised So Far (INR ₹)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">₹</span>
              <Input
                id="campaign-raised"
                type="number"
                min={0}
                step={1}
                value={raisedAmount}
                onChange={(e) => setRaisedAmount(e.target.value)}
                placeholder="0"
                className="pl-7 font-semibold text-base"
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.raisedAmount ? (
              <p className={errorClass}>{fieldErrors.raisedAmount}</p>
            ) : (
              <p className={helpClass}>Initial or current raised amount.</p>
            )}
          </div>

          {/* Supporters Count */}
          <div>
            <label htmlFor="campaign-supporters" className={labelClass}>
              Supporters / Donors Count
            </label>
            <Input
              id="campaign-supporters"
              type="number"
              min={0}
              step={1}
              value={supportersCount}
              onChange={(e) => setSupportersCount(e.target.value)}
              placeholder="0"
              className="mt-1"
              disabled={isSubmitting}
            />
            <p className={helpClass}>Number of donors displayed on campaign progress.</p>
          </div>
        </div>
      </div>

      {/* STEP 5: Beneficiary & Display Settings (Collapsible / Clean) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">5</span>
            Beneficiary Details & Homepage Display Options
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Optional context and featured visibility on homepage</p>
        </div>

        {/* Beneficiary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Beneficiary Name</label>
            <Input
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="e.g. Master Amit"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Beneficiary Age</label>
            <Input
              type="number"
              min={0}
              max={120}
              value={beneficiaryAge}
              onChange={(e) => setBeneficiaryAge(e.target.value)}
              placeholder="e.g. 10"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Beneficiary Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sitapur, Uttar Pradesh"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div>
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                🌟 Highlight as Main Featured Card
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Places this campaign in the primary large featured position for its category.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div>
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                🔥 Mark as Urgent Emergency
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Displays an urgent emergency badge on campaign cards.</p>
            </div>
          </label>
        </div>

        {/* Extra Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className={labelClass}>Urgency Badge Label</label>
            <Input
              value={urgencyLabel}
              onChange={(e) => setUrgencyLabel(e.target.value)}
              placeholder="e.g. 3 days left / Critical"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>CTA Button Text</label>
            <Input
              value={ctaButtonText}
              onChange={(e) => setCtaButtonText(e.target.value)}
              placeholder="e.g. Help Amit"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Display Sort Order</label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Campaign Start Date</label>
            <input
              type="datetime-local"
              className={nativeSelectClass}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Campaign End Date</label>
            <input
              type="datetime-local"
              className={nativeSelectClass}
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.endDate && <p className={errorClass}>{fieldErrors.endDate}</p>}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving Campaign…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
