'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Image as ImageIcon, UploadCloud, Code, LayoutTemplate } from 'lucide-react';
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
  'h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50';

const textareaClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[260px] resize-y font-mono';

const plainTextareaClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 min-h-[200px] resize-y';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const helpClass = 'mt-1 text-xs text-gray-400';
const errorClass = 'mt-1 text-xs text-red-600';

export function CampaignForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
  submitError,
}: CampaignFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description ?? '');
  const [beneficiaryName, setBeneficiaryName] = useState(initialData?.beneficiary_name ?? '');
  const [beneficiaryAge, setBeneficiaryAge] = useState(
    initialData?.beneficiary_age ? String(initialData.beneficiary_age) : ''
  );
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [targetAmount, setTargetAmount] = useState(
    initialData?.target_amount ? String(parseFloat(initialData.target_amount)) : ''
  );
  const [raisedAmount, setRaisedAmount] = useState(
    initialData?.raised_amount ? String(parseFloat(initialData.raised_amount)) : ''
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featured_image_url ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [isUrgent, setIsUrgent] = useState(initialData?.is_urgent ?? false);
  const [urgencyLabel, setUrgencyLabel] = useState(initialData?.urgency_label ?? '');
  const [ctaButtonText, setCtaButtonText] = useState(initialData?.cta_button_text ?? 'Help Now');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ? String(initialData.sort_order) : '0');
  const [supportersCount, setSupportersCount] = useState(
    initialData?.supporters_count ? String(initialData.supporters_count) : '0'
  );
  const [startDate, setStartDate] = useState(
    initialData?.start_date ? initialData.start_date.slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState(
    initialData?.end_date ? initialData.end_date.slice(0, 16) : ''
  );

  // Content State
  const [contentMode, setContentMode] = useState<'BUILDER' | 'HTML'>(initialData?.content ? 'HTML' : 'BUILDER');
  const [rawContent, setRawContent] = useState(initialData?.content ?? '');
  
  // Builder State
  const [builderHeading, setBuilderHeading] = useState('');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderImageUrl, setBuilderImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const data = await getCampaignCategories();
        if (!cancelled) setCategories(data);
      } catch {
        // Non-critical; form still usable without category list
      } finally {
        if (!cancelled) setCatLoading(false);
      }
    }
    void loadCategories();
    return () => { cancelled = true; };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const media = await uploadMedia(file);
      setBuilderImageUrl(media.url);
    } catch (err) {
      alert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }
    if (!categoryId) {
      errors.categoryId = 'Please select a category.';
    }
    if (targetAmount && (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0)) {
      errors.targetAmount = 'Target amount must be a positive number.';
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      errors.endDate = 'End date must be after start date.';
    }
    
    if (contentMode === 'HTML') {
      if (!rawContent.trim()) {
        errors.content = 'Content is required.';
      }
    } else {
      if (!builderDesc.trim()) {
        errors.content = 'Campaign detailed description is required.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateBuilderHtml = () => {
    let html = `<div class="campaign-story">`;
    if (builderImageUrl) {
      html += `\n  <img src="${builderImageUrl}" alt="Campaign Cover" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />`;
    }
    if (builderHeading) {
      html += `\n  <h2>${builderHeading}</h2>`;
    }
    if (builderDesc) {
      const paragraphs = builderDesc.split('\n').filter(p => p.trim() !== '');
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

      {/* Title */}
      <div>
        <label htmlFor="campaign-title" className={labelClass}>
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="campaign-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Help Amit continue his education"
          maxLength={255}
          disabled={isSubmitting}
          aria-describedby="campaign-title-error"
          aria-invalid={!!fieldErrors.title}
        />
        {fieldErrors.title && (
          <p id="campaign-title-error" className={errorClass}>{fieldErrors.title}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="campaign-category" className={labelClass}>
          Category <span className="text-red-500">*</span>
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
          <option value="">{catLoading ? 'Loading categories…' : 'Select a category'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {fieldErrors.categoryId && (
          <p id="campaign-category-error" className={errorClass}>{fieldErrors.categoryId}</p>
        )}
      </div>

      {/* Beneficiary Details & Short Need Story */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-blue-950">Beneficiary & Need Story (Homepage Conversion)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Child / Beneficiary Name</label>
            <Input
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="e.g. Amit"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Age</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={beneficiaryAge}
              onChange={(e) => setBeneficiaryAge(e.target.value)}
              placeholder="e.g. 10"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sitapur, Uttar Pradesh"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Need Summary (1–2 lines)</label>
          <textarea
            rows={2}
            className="w-full text-sm rounded-md border border-gray-300 bg-white p-2.5 focus:border-blue-500 focus:outline-none"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="e.g. Amit needs support for his school fees and essential learning materials to stay in school."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Cover Image & Media */}
      <div>
        <label className={labelClass}>Cover Photo (Natural Real Photo 4:3 ratio)</label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="Image URL (e.g. https://images.unsplash.com/...)"
              disabled={isSubmitting}
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-shrink-0">
              <UploadCloud className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isSubmitting || isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const media = await uploadMedia(file);
                    setFeaturedImageUrl(media.url);
                  } catch {
                    alert('Upload failed');
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />
            </label>
          </div>
          {featuredImageUrl && (
            <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-200">
              <img src={featuredImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Target Amount, Raised Amount & Supporters Count */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="campaign-target" className={labelClass}>
            Target Amount (INR)
          </label>
          <Input
            id="campaign-target"
            type="number"
            min={1}
            step={1}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="e.g. 8000"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className={labelClass}>Raised Amount (INR)</label>
          <Input
            type="number"
            min={0}
            step={1}
            value={raisedAmount}
            onChange={(e) => setRaisedAmount(e.target.value)}
            placeholder="e.g. 3200"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className={labelClass}>Supporters Count</label>
          <Input
            type="number"
            min={0}
            step={1}
            value={supportersCount}
            onChange={(e) => setSupportersCount(e.target.value)}
            placeholder="e.g. 12"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Homepage Feature & Urgency Controls */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-emerald-950">Homepage Visibility & Urgency Controls</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_featured_cb"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_featured_cb" className="text-sm font-medium text-gray-900 cursor-pointer">
              🌟 Highlight as Large Featured Card
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_urgent_cb"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <label htmlFor="is_urgent_cb" className="text-sm font-medium text-gray-900 cursor-pointer">
              🔥 Urgent Campaign
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Urgency Label (Optional)</label>
            <Input
              value={urgencyLabel}
              onChange={(e) => setUrgencyLabel(e.target.value)}
              placeholder="e.g. 5 days left"
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
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="1"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="campaign-start" className={labelClass}>
            Start Date
          </label>
          <input
            id="campaign-start"
            type="datetime-local"
            className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="campaign-end" className={labelClass}>
            End Date
          </label>
          <input
            id="campaign-end"
            type="datetime-local"
            className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isSubmitting}
          />
          {fieldErrors.endDate && <p className={errorClass}>{fieldErrors.endDate}</p>}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-900">
            Campaign Content <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setContentMode('BUILDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded ${contentMode === 'BUILDER' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Plain Text Builder
            </button>
            <button
              type="button"
              onClick={() => setContentMode('HTML')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded ${contentMode === 'HTML' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Code className="w-3.5 h-3.5" /> Advanced Mode
            </button>
          </div>
        </div>

        {contentMode === 'BUILDER' ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Content Heading</label>
              <Input
                value={builderHeading}
                onChange={e => setBuilderHeading(e.target.value)}
                placeholder="e.g. Why this matters..."
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className={labelClass}>Image Upload</label>
              <div className="mt-1 flex items-center gap-4">
                {builderImageUrl && (
                  <img src={builderImageUrl} alt="Preview" className="h-16 w-16 object-cover rounded border border-gray-300" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isUploading ? <span className="animate-pulse">Uploading...</span> : <><UploadCloud className="w-4 h-4" /> Upload Image</>}
                </button>
                {builderImageUrl && (
                  <button type="button" onClick={() => setBuilderImageUrl('')} className="text-xs text-red-600 hover:underline">Remove</button>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Detailed Description</label>
              <textarea
                className={plainTextareaClass}
                value={builderDesc}
                onChange={e => setBuilderDesc(e.target.value)}
                placeholder="Write your campaign story here in plain text. Paragraphs will be automatically formatted."
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
              placeholder="Describe the campaign goals, impact, and details here…"
              disabled={isSubmitting}
            />
            <p className={helpClass}>
              Write or paste your content here. Advanced formatting like tables and iframe embeds are supported.
            </p>
          </div>
        )}
        {fieldErrors.content && <p className={errorClass}>{fieldErrors.content}</p>}
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
