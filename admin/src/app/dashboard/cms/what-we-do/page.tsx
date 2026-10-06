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
  Loader2,
  HeartHandshake,
  HeartPulse,
  GraduationCap,
  PawPrint,
  Settings2,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  getWhatWeDoAdmin, 
  createWhatWeDoCard, 
  updateWhatWeDoCard, 
  toggleWhatWeDoCard, 
  deleteWhatWeDoCard,
  updateWhatWeDoSettings
} from '@/lib/what-we-do.api';
import { uploadMedia } from '@/lib/media.api';
import type { WhatWeDoCard, WhatWeDoSectionSettings } from '@/lib/types';

const ICON_OPTIONS = [
  { value: 'essentials', label: 'Essentials & Aid', icon: HeartHandshake, color: '#1e88e5' },
  { value: 'health', label: 'Health & Medical', icon: HeartPulse, color: '#e91e63' },
  { value: 'kids', label: 'Kids & Education', icon: GraduationCap, color: '#ff9800' },
  { value: 'animals', label: 'Animal Care', icon: PawPrint, color: '#4caf50' },
];

export default function WhatWeDoCMSPage() {
  const [cards, setCards] = useState<WhatWeDoCard[]>([]);
  const [sectionSettings, setSectionSettings] = useState<WhatWeDoSectionSettings>({
    badge: 'WHAT WE DO',
    heading: 'Supporting Citizens in Need Our National Commitment',
    subheading: 'We strive to do good for all, addressing the diverse needs of people, fostering positive change and lasting impact.',
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<WhatWeDoCard[] | null>(null);
  const [currentEditingCard, setCurrentEditingCard] = useState<WhatWeDoCard | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    badge: '',
    icon_type: 'essentials',
    accent_color: '#53b34b',
    description: '',
    images: [''] as string[],
    cta_text: 'Know More',
    cta_link: '/campaigns',
    sort_order: 1,
    is_active: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getWhatWeDoAdmin();
      setCards(data.cards);
      if (data.section) {
        setSectionSettings(data.section);
      }
    } catch {
      toast.error('Failed to load What We Do content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleSaveSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateWhatWeDoSettings(sectionSettings);
      setSectionSettings(updated);
      toast.success('Section heading & description saved successfully');
    } catch {
      toast.error('Failed to update section settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const openAddModal = () => {
    setCurrentEditingCard(null);
    setFormData({
      title: '',
      badge: 'ESSENTIAL AID',
      icon_type: 'essentials',
      accent_color: '#1e88e5',
      description: '',
      images: ['https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800&auto=format&fit=crop'],
      cta_text: 'Know More',
      cta_link: '/campaigns',
      sort_order: cards.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (card: WhatWeDoCard) => {
    setCurrentEditingCard(card);
    setFormData({
      title: card.title,
      badge: card.badge || '',
      icon_type: card.icon_type || 'essentials',
      accent_color: card.accent_color || '#53b34b',
      description: card.description,
      images: Array.isArray(card.images) && card.images.length > 0 ? [...card.images] : [''],
      cta_text: card.cta_text || 'Know More',
      cta_link: card.cta_link || '/about',
      sort_order: card.sort_order,
      is_active: card.is_active,
    });
    setIsModalOpen(true);
  };

  const handleAddImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const handleRemoveImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (index: number, val: string) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = val;
      return { ...prev, images: newImages };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const media = await uploadMedia(file);
      handleImageChange(targetIndex, media.url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = formData.images.filter((img) => img.trim().length > 0);
    if (validImages.length === 0) {
      toast.error('Please provide at least one valid image URL');
      return;
    }

    setActionLoading('save');
    try {
      if (currentEditingCard) {
        const updated = await updateWhatWeDoCard(currentEditingCard.id, {
          title: formData.title,
          badge: formData.badge || undefined,
          icon_type: formData.icon_type,
          accent_color: formData.accent_color,
          description: formData.description,
          images: validImages,
          cta_text: formData.cta_text,
          cta_link: formData.cta_link,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success('Cause card updated');
      } else {
        const created = await createWhatWeDoCard({
          title: formData.title,
          badge: formData.badge || undefined,
          icon_type: formData.icon_type,
          accent_color: formData.accent_color,
          description: formData.description,
          images: validImages,
          cta_text: formData.cta_text,
          cta_link: formData.cta_link,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        setCards((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
        toast.success('Cause card created');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save card');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (card: WhatWeDoCard) => {
    setActionLoading(`toggle-${card.id}`);
    try {
      const updated = await toggleWhatWeDoCard(card.id, !card.is_active);
      setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast.success(updated.is_active ? 'Card activated' : 'Card hidden');
    } catch {
      toast.error('Failed to toggle status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cause card?')) return;

    setActionLoading(`delete-${id}`);
    try {
      await deleteWhatWeDoCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cause card deleted');
    } catch {
      toast.error('Failed to delete card');
    } finally {
      setActionLoading(null);
    }
  };

  const renderIcon = (type: string, color?: string | null) => {
    const props = { className: 'w-4 h-4 text-white' };
    const bg = color || '#53b34b';

    let iconComp = <HeartHandshake {...props} />;
    if (type === 'health') iconComp = <HeartPulse {...props} />;
    if (type === 'kids') iconComp = <GraduationCap {...props} />;
    if (type === 'animals') iconComp = <PawPrint {...props} />;

    return (
      <div 
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ backgroundColor: bg }}
      >
        {iconComp}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Breadcrumb & Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard/cms" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> CMS Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">What We Do Section</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            What We Do (Our Work)
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Live CMS
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control the section headline, subtitle, and all 4 auto-sliding cause cards displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="http://localhost:3000"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-input rounded-lg px-3 py-2 bg-background hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View on Website
          </Link>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Cause Card
          </button>
        </div>
      </div>

      {/* ── SECTION SETTINGS FORM (Headline & Subtitle) ── */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Section Header Settings</h2>
          </div>
          <span className="text-xs text-muted-foreground">Changes reflect directly on the public homepage</span>
        </div>

        <form onSubmit={handleSaveSectionSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Badge Pill Text
              </label>
              <Input
                value={sectionSettings.badge}
                onChange={(e) => setSectionSettings({ ...sectionSettings, badge: e.target.value })}
                placeholder="e.g. WHAT WE DO"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Main Heading
              </label>
              <Input
                value={sectionSettings.heading}
                onChange={(e) => setSectionSettings({ ...sectionSettings, heading: e.target.value })}
                placeholder="e.g. Supporting Citizens in Need Our National Commitment"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Subheading / Description
            </label>
            <textarea
              value={sectionSettings.subheading}
              onChange={(e) => setSectionSettings({ ...sectionSettings, subheading: e.target.value })}
              rows={2}
              className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. We strive to do good for all, addressing the diverse needs of people..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 bg-[#005e2d] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#004722] transition disabled:opacity-50"
            >
              {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Header Changes
            </button>
          </div>
        </form>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Cause Cards ({cards.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Desktop layout displays 4 cards per row
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-2xl p-4 space-y-3 bg-card">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 border rounded-2xl bg-card border-dashed space-y-3">
            <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-lg font-medium text-foreground">No Cause Cards Added</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Add your first cause card to showcase your NGO's impact areas.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" /> Add Cause Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {cards.map((card) => {
              const imagesList = Array.isArray(card.images) ? card.images : [];
              const primaryImg = imagesList[0] || 'https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800';

              return (
                <div 
                  key={card.id}
                  className={`group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                    !card.is_active ? 'opacity-60 bg-muted/30 border-dashed' : ''
                  }`}
                >
                  {/* Top Image Preview */}
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    <img
                      src={primaryImg}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge Pill */}
                    {card.badge && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-white/20">
                          {card.badge}
                        </span>
                      </div>
                    )}

                    {/* Image Counter */}
                    {imagesList.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {imagesList.length} photos
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        card.is_active ? 'bg-emerald-500/80 text-white' : 'bg-stone-500/80 text-white'
                      }`}>
                        {card.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Icon & Title */}
                      <div className="flex items-center gap-2 mb-1.5">
                        {renderIcon(card.icon_type, card.accent_color)}
                        <h3 className="font-bold text-sm text-[#0033A0] leading-tight flex-1 line-clamp-1">
                          {card.title}
                        </h3>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {card.description}
                      </p>
                    </div>

                    <div>
                      <div className="pt-2 border-t flex items-center justify-between text-xs text-[#005e2d] font-semibold">
                        <span>{card.cta_text || 'Know More'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggle(card)}
                            disabled={actionLoading === `toggle-${card.id}`}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                            title={card.is_active ? 'Hide Card' : 'Show Card'}
                          >
                            {card.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                          </button>

                          <button
                            onClick={() => openEditModal(card)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                            title="Edit Card"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">#{card.sort_order}</span>
                          <button
                            onClick={() => handleDelete(card.id)}
                            disabled={actionLoading === `delete-${card.id}`}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                            title="Delete Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">
                {currentEditingCard ? 'Edit Cause Card' : 'Add New Cause Card'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="p-6 space-y-4">
              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Card Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Nourish, Warm, Provide Essentials"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Badge Pill Text
                  </label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. ESSENTIAL AID"
                  />
                </div>
              </div>

              {/* Icon Type & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Cause Category & Icon
                  </label>
                  <select
                    value={formData.icon_type}
                    onChange={(e) => {
                      const selected = ICON_OPTIONS.find((opt) => opt.value === e.target.value);
                      setFormData({ 
                        ...formData, 
                        icon_type: e.target.value,
                        accent_color: selected?.color || formData.accent_color
                      });
                    }}
                    className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Accent Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      placeholder="#1e88e5"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="We are dedicated to assisting those in need..."
                  required
                />
              </div>

              {/* Multi-Image Slider URLs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase">
                    Auto-Slider Images (1 to 5 Photos) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    disabled={formData.images.length >= 5}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Image
                  </button>
                </div>

                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder={`Image URL #${idx + 1}`}
                      required={idx === 0}
                    />

                    <label className="cursor-pointer p-2 border rounded-lg hover:bg-muted text-muted-foreground transition flex-shrink-0">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, idx)}
                        disabled={uploadingImage}
                      />
                    </label>

                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(idx)}
                        className="p-2 border rounded-lg hover:bg-destructive/10 text-destructive transition flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {uploadingImage && <p className="text-xs text-primary animate-pulse">Uploading image...</p>}
              </div>

              {/* CTA Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    CTA Button Text
                  </label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="Know More"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    CTA Button Link
                  </label>
                  <Input
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    placeholder="/campaigns?category=essentials"
                  />
                </div>
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    min={1}
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="is_active_cb"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active_cb" className="text-sm font-medium text-foreground cursor-pointer">
                    Active on Website
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save'}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {actionLoading === 'save' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {currentEditingCard ? 'Update Card' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
