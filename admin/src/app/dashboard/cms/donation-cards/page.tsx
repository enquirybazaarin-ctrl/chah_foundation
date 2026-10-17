'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Check, 
  RefreshCw, 
  Image as ImageIcon, 
  Loader2,
  HeartHandshake,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import api from '@/lib/api';
import { uploadMedia } from '@/lib/media.api';

export interface DonationCardItem {
  id: string;
  amount: number;
  title: string;
  short_description: string;
  impact_note: string;
  image_url: string;
  badge: string;
}

const DEFAULT_CARDS: DonationCardItem[] = [
  {
    id: 'card_500',
    amount: 500,
    title: 'Feed a Child',
    short_description: 'Help provide nutritious meals to children.',
    impact_note: 'Contributes towards wholesome, balanced daily meals for children attending community welfare centres.',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    badge: 'Nutrition Support'
  },
  {
    id: 'card_1000',
    amount: 1000,
    title: 'Support Healthcare',
    short_description: 'Help families access essential medical support.',
    impact_note: 'Supports essential clinical checkups, basic diagnostic tests, and urgent medical relief for families.',
    image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
    badge: 'Medical Aid'
  },
  {
    id: 'card_2000',
    amount: 2000,
    title: 'Educate a Child',
    short_description: 'Help children access learning materials and school supplies.',
    impact_note: 'Provides books, school kits, and remedial tutoring support to keep vulnerable children in formal education.',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    badge: 'Education First'
  },
  {
    id: 'card_5000',
    amount: 5000,
    title: 'Empower a Community',
    short_description: 'Support community health and sanitation initiatives.',
    impact_note: 'Assists community sanitation, clean drinking water access, and hygiene awareness for underprivileged settlements.',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop',
    badge: 'Community Impact'
  }
];

export default function DonationCardsCMSPage() {
  const [cards, setCards] = useState<DonationCardItem[]>(DEFAULT_CARDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Fetch current setting from backend
  useEffect(() => {
    let cancelled = false;

    async function loadCards() {
      try {
        const res = await api.get('/api/v1/operations/settings/public');
        const settings = res.data?.data?.settings || [];
        const match = settings.find((s: any) => s.setting_key === 'DONATION_IMPACT_CARDS');
        if (match?.setting_value && !cancelled) {
          const parsed = JSON.parse(match.setting_value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCards(parsed);
          }
        }
      } catch (err) {
        console.warn('Could not fetch donation cards setting, using defaults', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCards();
    return () => { cancelled = true; };
  }, []);

  // Update card field
  const handleFieldChange = (index: number, field: keyof DonationCardItem, value: any) => {
    setCards(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Upload image handler
  const handleFileUpload = async (index: number, cardId: string, file: File) => {
    if (!file) return;
    setUploadingCardId(cardId);
    try {
      const media = await uploadMedia(file);
      if (media?.url) {
        handleFieldChange(index, 'image_url', media.url);
        toast.success(`Image uploaded successfully for Card #${index + 1}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingCardId(null);
    }
  };

  // Save all cards to settings
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await api.post('/api/v1/operations/settings', {
        setting_key: 'DONATION_IMPACT_CARDS',
        setting_value: JSON.stringify(cards)
      });
      toast.success('Donation Impact Cards saved successfully! Live website updated.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save settings. Please verify permissions.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default cards
  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all cards to original defaults?')) {
      setCards(DEFAULT_CARDS);
      toast.info('Cards reset to defaults. Click "Save Changes" to apply.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <Link
            href="/dashboard/cms"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to CMS
          </Link>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-[#003399]" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Donation Impact Cards
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Configure the 4 interactive cards on the donation page. When donors click a card, the amount is automatically selected in the donation form without reloading.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#003399] hover:bg-[#002878] disabled:bg-blue-300 rounded-lg shadow-sm transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cards List / Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => {
          const isUploading = uploadingCardId === card.id;

          return (
            <div
              key={card.id || index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header Tag */}
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-black text-[#003399] uppercase tracking-wider">
                  Card #{index + 1} — ₹{card.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-semibold text-gray-500 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                  {card.badge || 'Active Programme'}
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                
                {/* Image Preview & Upload Row */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Card Image (Appears on Donation Page)
                  </label>
                  
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span>No image provided</span>
                      </div>
                    )}

                    {/* Image overlay upload button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[card.id]?.click()}
                        disabled={isUploading}
                        className="px-3 py-1.5 bg-white text-gray-900 rounded-md text-xs font-bold hover:bg-gray-100 shadow flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {isUploading ? 'Uploading...' : 'Replace Image'}
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[card.id] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, card.id, file);
                    }}
                  />

                  {/* Direct Image URL input */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="Or enter direct image URL"
                      value={card.image_url || ''}
                      onChange={(e) => handleFieldChange(index, 'image_url', e.target.value)}
                      className="text-xs h-8"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[card.id]?.click()}
                      disabled={isUploading}
                      className="shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Amount & Title Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Donation Amount (₹)
                    </label>
                    <Input
                      type="number"
                      value={card.amount || 0}
                      onChange={(e) => handleFieldChange(index, 'amount', Number(e.target.value))}
                      className="text-sm font-bold text-gray-900 h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Programme Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Feed a Child"
                      value={card.title || ''}
                      onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                      className="text-sm h-9"
                    />
                  </div>
                </div>

                {/* Badge Tag */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge Tag (Image Overlay Tag)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Nutrition Support"
                    value={card.badge || ''}
                    onChange={(e) => handleFieldChange(index, 'badge', e.target.value)}
                    className="text-xs h-8"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Short Description (Primary Line)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Help provide nutritious meals to children."
                    value={card.short_description || ''}
                    onChange={(e) => handleFieldChange(index, 'short_description', e.target.value)}
                    className="text-xs sm:text-sm h-9"
                  />
                </div>

                {/* Ethical Programme Context Note */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Programme Context (Non-contractual ethical impact note)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Details about where the funds are applied without overpromising rigid outcomes..."
                    value={card.impact_note || ''}
                    onChange={(e) => handleFieldChange(index, 'impact_note', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-[#003399]"
                  />
                </div>

              </div>

              {/* Card Footer Live Preview Button */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Selectable on donate page
                </span>
                <span className="font-bold text-[#003399]">
                  CTA: Donate ₹{card.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Bottom Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Cards are immediately synchronized with the public donation flow without page reloads.</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#003399] hover:bg-[#002878] disabled:bg-blue-300 text-white font-bold rounded-lg text-sm shadow transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All 4 Cards</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
