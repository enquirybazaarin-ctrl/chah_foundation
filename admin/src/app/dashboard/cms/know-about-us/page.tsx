'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Loader2, 
  Save, 
  Info, 
  Check, 
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  getKnowAboutUsAdmin, 
  updateKnowAboutUs, 
  addKnowAboutUsImage, 
  deleteKnowAboutUsImage 
} from '@/lib/know-about-us.api';
import { uploadMedia } from '@/lib/media.api';
import type { KnowAboutUsData } from '@/lib/types';

export default function KnowAboutUsCMSPage() {
  const [data, setData] = useState<KnowAboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    badge: 'Know About Us',
    heading: 'About Us',
    heading_highlight: 'Us',
    subheading: 'We are a registered non-profit dedicated to educating, feeding, and empowering underprivileged children in Varanasi and rural Uttar-pradesh.',
    body: "Since 2015, we've transformed over 50,000 lives through free education, daily meals, healthcare, and skill training. Discover the profound impact of our initiatives spanning education, healthcare, and empowerment, as we tirelessly work towards creating a brighter future for those in need.",
    quote: 'Every child deserves hope. Every smile matters.',
    primary_button_text: 'Support Our Mission',
    primary_button_url: '/campaigns',
    secondary_button_text: 'Learn More',
    secondary_button_url: '/about',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getKnowAboutUsAdmin();
      setData(res);
      setFormData({
        badge: res.badge || 'Know About Us',
        heading: res.heading || 'About Us',
        heading_highlight: res.heading_highlight || 'Us',
        subheading: res.subheading || '',
        body: res.body || '',
        quote: res.quote || '',
        primary_button_text: res.primary_button_text || 'Support Our Mission',
        primary_button_url: res.primary_button_url || '/campaigns',
        secondary_button_text: res.secondary_button_text || 'Learn More',
        secondary_button_url: res.secondary_button_url || '/about',
      });
    } catch {
      toast.error('Failed to load Know About Us settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateKnowAboutUs({
        ...formData,
      });
      setData(updated);
      toast.success('Know About Us content updated successfully');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const media = await uploadMedia(file);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const fullUrl = media.url.startsWith('http') ? media.url : `${API_URL}${media.url}`;
      
      const updated = await addKnowAboutUsImage(fullUrl);
      setData(updated);
      toast.success('Image uploaded and added to slider');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = async () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setUploading(true);
    try {
      const updated = await addKnowAboutUsImage(url);
      setData(updated);
      setNewImageUrl('');
      setIsAddingUrl(false);
      toast.success('Image URL added to slider');
    } catch {
      toast.error('Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!confirm('Are you sure you want to remove this image from the slider?')) return;
    setDeletingIndex(index);
    try {
      const updated = await deleteKnowAboutUsImage(index);
      setData(updated);
      toast.success('Image removed from slider');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeletingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const images = data?.images || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <Link
            href="/dashboard/cms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to CMS Hub
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Know About Us Section
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Homepage
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Redesign layout: Left text content & right auto-sliding image carousel (Desktop) | Heading → Image Slider → Text & Buttons (Mobile)
          </p>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
        >
          <span>View on Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      {/* Recommended Size Guidance Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-blue-950">
            Recommended Image Dimensions: 800 × 600 px (4:3 aspect ratio)
          </p>
          <p className="text-blue-800 text-xs mt-0.5 leading-relaxed">
            Images in this section are presented in an auto-sliding showcase next to the mission statement. Uploading photos with a <strong>4:3 landscape ratio</strong> (e.g. 800×600 or 1200×900 px) ensures high resolution and prevents unwanted edge-cropping on mobile or desktop screens.
          </p>
        </div>
      </div>

      {/* ── 1. Image Slider Management ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#003399]" />
              Auto-Sliding Images ({images.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              These images automatically slide on the right side (desktop) and between heading & text (mobile).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#003399] rounded-lg hover:bg-[#002266] shadow-sm transition-all disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload New Image</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddingUrl(!isAddingUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>

        {/* Add URL Row */}
        {isAddingUrl && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center gap-3">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste direct image URL (https://...)"
              className="text-xs h-9 bg-white flex-1"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={uploading || !newImageUrl.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                Add Image
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingUrl(false); setNewImageUrl(''); }}
                className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No images in slider yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Click &quot;Upload New Image&quot; above to add photos from your local computer or paste an image URL.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm aspect-[4/3] flex items-center justify-center transition-all hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Know About Us Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Index badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-bold text-white shadow-sm">
                  Slide {idx + 1}
                </div>

                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white shadow transition-transform hover:scale-105"
                    title="Open full image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx)}
                    disabled={deletingIndex === idx}
                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow transition-transform hover:scale-105 disabled:opacity-50"
                    title="Delete image"
                  >
                    {deletingIndex === idx ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. Content & Text Management Form ── */}
      <form onSubmit={handleSaveText} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-500" />
              Section Content & Typography
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize headings, highlight accents, mission paragraphs, quote lines, and buttons.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Badge */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Top Badge
            </label>
            <Input
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Know About Us"
              className="text-sm h-10"
            />
            <p className="text-[11px] text-gray-400 mt-1">Small pill label shown above the main title.</p>
          </div>

          {/* Heading */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Main Heading
            </label>
            <Input
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="e.g. About Us or We provide a place for..."
              className="text-sm h-10"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">Primary title of this section.</p>
          </div>

          {/* Heading Highlight Word */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Heading Highlight Word(s)
            </label>
            <Input
              value={formData.heading_highlight}
              onChange={(e) => setFormData({ ...formData, heading_highlight: e.target.value })}
              placeholder="e.g. Us or children"
              className="text-sm h-10"
            />
            <p className="text-[11px] text-gray-400 mt-1">Text inside heading rendered with vibrant brand color.</p>
          </div>
        </div>

        {/* Subheading / Lead bold paragraph */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Introductory Lead Text (Bold Paragraph)
          </label>
          <Textarea
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            placeholder="e.g. We are a registered non-profit dedicated to educating, feeding, and empowering underprivileged children in Varanasi..."
            rows={3}
            className="text-sm"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Featured at the top of the text block in semi-bold weight.
          </p>
        </div>

        {/* Detailed Body Paragraph */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Detailed Body Description
          </label>
          <Textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Enter detailed narrative or impact summary..."
            rows={4}
            className="text-sm"
          />
        </div>

        {/* Highlight Quote */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Highlighted Quote / Tagline (Accent Color)
          </label>
          <Input
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            placeholder="e.g. Every child deserves hope. Every smile matters."
            className="text-sm h-10 font-medium"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Styled with distinct emphasis below the narrative paragraphs.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Primary CTA */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-900 block">Primary Action Button</span>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">Button Text</label>
              <Input
                value={formData.primary_button_text}
                onChange={(e) => setFormData({ ...formData, primary_button_text: e.target.value })}
                placeholder="e.g. Support Our Mission"
                className="text-xs h-9 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">Button Link URL</label>
              <Input
                value={formData.primary_button_url}
                onChange={(e) => setFormData({ ...formData, primary_button_url: e.target.value })}
                placeholder="e.g. /campaigns"
                className="text-xs h-9 bg-white"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-900 block">Secondary Action Button</span>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">Button Text</label>
              <Input
                value={formData.secondary_button_text}
                onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
                placeholder="e.g. Learn More"
                className="text-xs h-9 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">Button Link URL</label>
              <Input
                value={formData.secondary_button_url}
                onChange={(e) => setFormData({ ...formData, secondary_button_url: e.target.value })}
                placeholder="e.g. /about"
                className="text-xs h-9 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#003399] hover:bg-[#002266] rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save All Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
