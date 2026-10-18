"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, Heart, QrCode, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CampaignDetailViewProps {
  campaign: any;
  initialSupporters?: any[];
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.chahfoundation.com').replace(/\/$/, '');

function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return `${API_URL}/${url}`;
}

export default function CampaignDetailView({ campaign, initialSupporters = [] }: CampaignDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'payouts' | 'updates'>('story');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const raised = parseFloat(campaign.raised_amount || '0');
  const target = parseFloat(campaign.target_amount || '1');
  const percent = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
  
  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extract images and resolve any backend relative media URLs
  const rawImages: string[] = Array.isArray(campaign.images) && campaign.images.length > 0
    ? campaign.images
    : (campaign.featured_image_url ? [campaign.featured_image_url] : []);

  const resolvedImages = rawImages.map(resolveMediaUrl).filter(Boolean);
  const images = resolvedImages.length > 0
    ? resolvedImages
    : ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"];

  // Auto-slide every 3 seconds if multiple images
  React.useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Clean campaign story content
  const rawContent = campaign.content || '';
  const cleanContent = rawContent
    .replace(/<div class="campaign-gallery-data"[^>]*>[\s\S]*?<\/div>/g, '')
    .trim();

  const hasHtml = /<[a-z][\s\S]*>/i.test(cleanContent);

  // Handle Share
  const handleShare = async () => {
    const shareData = {
      title: campaign.title,
      text: campaign.short_description || campaign.title,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(`Please support this noble cause: "${campaign.title}"\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const donateUrl = `/donate?campaign=${campaign.id || campaign.slug}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          {campaign.category?.name && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-800 mb-2">
              {campaign.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {campaign.title}
          </h1>
          {campaign.beneficiary_name && (
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
              Beneficiary: <strong className="text-gray-800">{campaign.beneficiary_name}</strong>
              {campaign.beneficiary_age ? ` (${campaign.beneficiary_age} years old)` : ''}
              {campaign.location ? ` • ${campaign.location}` : ''}
            </p>
          )}
        </div>

        {/* Image Slider */}
        <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200/80">
          <img 
            src={images[currentImageIndex]} 
            alt={campaign.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          {images.length > 1 && (
            <>
              {/* Slider Arrows */}
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all cursor-pointer",
                      idx === currentImageIndex ? "bg-white w-5" : "bg-white/60 hover:bg-white"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Post-Image Metrics & Share Strip */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#22c55e" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={`${2 * Math.PI * 40}`} 
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - percent / 100)}`} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-gray-800">{percent}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Raised So Far</div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xl font-black text-lime-700">{formatMoney(raised)}</span>
                  <span className="text-xs text-gray-500 font-medium">of {formatMoney(target)} goal</span>
                </div>
              </div>
            </div>

            <div className="bg-lime-50 border border-lime-200/80 px-4 py-2 rounded-full text-xs font-bold text-lime-800">
              {campaign.supporters_count || 0} Supporters
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <button 
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold h-11 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-sm"
            >
              <span>Share on WhatsApp</span>
            </button>
            <button 
              type="button"
              onClick={handleShare}
              className="w-full border border-gray-300 hover:border-lime-600 hover:bg-lime-50/50 text-gray-800 rounded-xl font-bold h-11 flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
            >
              {copiedLink ? <Check className="w-4 h-4 text-lime-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Campaign'}</span>
            </button>
          </div>
        </div>

        {/* Content Tabs (Story, Payouts, Updates) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={cn(
                "flex-1 py-3.5 text-sm font-bold transition-colors cursor-pointer",
                activeTab === 'story' 
                  ? "bg-[#003399] text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Campaign Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('payouts')}
              className={cn(
                "flex-1 py-3.5 text-sm font-bold transition-colors border-x border-gray-100 cursor-pointer",
                activeTab === 'payouts' 
                  ? "bg-[#003399] text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Payouts & Transparency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={cn(
                "flex-1 py-3.5 text-sm font-bold transition-colors cursor-pointer",
                activeTab === 'updates' 
                  ? "bg-[#003399] text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Updates
            </button>
          </div>

          <div className="p-6 md:p-8 text-gray-700 leading-relaxed">
            {activeTab === 'story' && (
              <div className="space-y-4">
                {cleanContent ? (
                  hasHtml ? (
                    <div 
                      className="space-y-4 text-base leading-relaxed text-gray-800"
                      dangerouslySetInnerHTML={{ __html: cleanContent }} 
                    />
                  ) : (
                    <div className="space-y-4 text-base leading-relaxed text-gray-800 whitespace-pre-line">
                      {cleanContent.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="text-base leading-relaxed text-gray-800">
                      {campaign.short_description || campaign.description || "Every contribution directly supports this urgent cause with verified on-ground assistance, nutritious meals, and medical relief."}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      CHAH Foundation validates all beneficiary documentation and transfers 100% of collected donor contributions directly for medical, educational, and welfare interventions.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'payouts' && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 font-medium">
                  Direct vendor and hospital disbursement records will be uploaded as bills are settled.
                </p>
                <p className="text-xs text-lime-700 font-bold mt-2">
                  100% Direct Verification Guarantee
                </p>
              </div>
            )}
            
            {activeTab === 'updates' && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 font-medium">
                  Beneficiary progress updates will be posted here as milestones are reached.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Donors receive email notifications for major updates.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supporters Section */}
        <div id="supporters-section" className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-sm scroll-mt-24">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
            <span>Supporters & Well-Wishers</span>
            <span className="text-xs font-semibold text-lime-700">80G Tax-Deductible</span>
          </h3>

          <div className="space-y-3">
            {initialSupporters.length > 0 ? (
              initialSupporters.map((supporter, i) => (
                <div key={i} className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-2xs">
                    {supporter.initial || supporter.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm font-semibold">{supporter.name || 'Kind Supporter'}</div>
                    <div className="text-lime-700 text-xs font-bold mt-0.5">₹{parseFloat(supporter.amount || '0').toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">
                Be the first generous supporter to contribute to this campaign!
              </p>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-sm">
          <h3 className="text-lg font-bold text-[#003399] mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {[
              {
                question: "Is my donation eligible for 80G Tax Exemption?",
                answer: "Yes! All donations made to CHAH Foundation are 50% tax-exempt under Section 80G of the Indian Income Tax Act. Your digital certificate is automatically emailed immediately after payment."
              },
              {
                question: "What platform fee does CHAH Foundation charge?",
                answer: "CHAH Foundation charges 0% platform fee. 100% of your contribution reaches verified beneficiaries and hospitals directly."
              },
              {
                question: "How are funds delivered to the beneficiary?",
                answer: "We verify every case with medical, school, and government documentation. Payouts are made directly to the hospital, institution, or verified bank account."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all duration-200",
                    isOpen 
                      ? "border-blue-200 bg-blue-50/20" 
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <button 
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex items-center justify-between w-full text-left font-semibold text-gray-800 p-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-bold text-gray-900">{faq.question}</span>
                    <span className="text-base font-bold text-gray-400 ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Sticky Donation Panel */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/90 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#003399]" />
              <span className="text-lg font-bold text-gray-900">Support This Cause</span>
            </div>
            <span className="text-xs font-semibold text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
              80G Tax Benefit
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-18 h-18 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - percent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">{percent}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-0.5">Raised of {formatMoney(target)}</div>
              <div className="text-xl font-black text-lime-700">{formatMoney(raised)}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{campaign.supporters_count || 0} donors contributed</div>
            </div>
          </div>

          <Link
            href={donateUrl}
            className="block w-full py-4 bg-[#003399] hover:bg-[#00246a] text-white text-center text-base font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Donate Now
          </Link>

          <p className="text-center text-xs text-gray-500 font-medium">
            UPI, Cards, NetBanking • Instant 80G Receipt
          </p>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>🔒 256-Bit SSL Secured Payment</span>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Quick Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Goal: {percent}% reached</span>
          <span className="text-sm font-bold text-[#003399]">{formatMoney(raised)}</span>
        </div>
        <Link
          href={donateUrl}
          className="px-6 py-2.5 rounded-full bg-[#003399] hover:bg-[#002878] text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Donate Now</span>
        </Link>
      </div>
    </div>
  );
}
