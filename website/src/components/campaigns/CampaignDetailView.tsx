"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Share2, Heart, CreditCard, Banknote, QrCode, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CampaignDetailViewProps {
  campaign: any;
  initialSupporters?: any[];
}

export default function CampaignDetailView({ campaign, initialSupporters = [] }: CampaignDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'payouts' | 'updates'>('story');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false);

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

  const images = campaign.images || (campaign.featured_image_url ? [campaign.featured_image_url] : []);

  // Auto-slide every 2 seconds
  React.useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {campaign.title}
        </h1>

        {/* Image Slider Mockup */}
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
          {images.length > 0 ? (
            <>
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
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
                          "w-2 h-2 rounded-full transition-all",
                          idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}
        </div>

        {/* Post-Image Mobile-Style Actions (Visible on left side) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - percent / 100)}`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{percent}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-0.5">Raised</div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-lg font-bold text-lime-700">{formatMoney(raised)}</span>
                  <span className="text-sm text-gray-500">of {formatMoney(target)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-lime-800">
              {campaign.supporters_count || 0} supporters
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-medium h-12 flex items-center justify-center gap-2 shadow-sm text-lg">
              <span className="text-2xl leading-none -mt-1">✆</span> Share
            </Button>
            <Button variant="outline" className="w-full border-lime-600 text-lime-700 hover:bg-lime-50 rounded-full font-medium h-12 flex items-center justify-center gap-2 text-lg">
              <Share2 className="w-5 h-5" /> Share
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('story')}
              className={cn(
                "flex-1 py-4 text-sm font-semibold transition-colors",
                activeTab === 'story' 
                  ? "bg-lime-600 text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Story
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={cn(
                "flex-1 py-4 text-sm font-semibold transition-colors border-x border-gray-100",
                activeTab === 'payouts' 
                  ? "bg-lime-600 text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Payouts (0)
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={cn(
                "flex-1 py-4 text-sm font-semibold transition-colors",
                activeTab === 'updates' 
                  ? "bg-lime-600 text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Updates (0)
            </button>
          </div>

          <div className="p-6 md:p-8 prose prose-gray max-w-none text-gray-700">
            {activeTab === 'story' && (
              <div>
                {campaign.content ? (
                  <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
                ) : (
                  <p>{campaign.short_description || "No story available for this campaign."}</p>
                )}
              </div>
            )}
            
            {activeTab === 'payouts' && (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No payouts have been recorded yet.</p>
              </div>
            )}
            
            {activeTab === 'updates' && (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No updates have been posted yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Supporters Section */}
        <div id="supporters-section" className="bg-[#faf9f7] rounded-xl p-6 md:p-8 mt-12 border border-lime-100/50 scroll-mt-24">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-lime-200"></span>
            Supporters
            <span className="w-12 h-px bg-lime-200"></span>
          </h3>
          <div className="bg-lime-50 rounded-lg p-4 mb-6 text-sm text-lime-800 border border-lime-100">
            <span className="font-semibold underline cursor-pointer hover:text-lime-700">Click here</span> if you are not able to find your donation listed below.
          </div>
          <div className="space-y-4">
            {initialSupporters.length > 0 ? (
              initialSupporters.map((supporter, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center font-bold text-lg shrink-0 uppercase">
                    {supporter.initial}
                  </div>
                  <div>
                    <div className="text-gray-800 text-sm font-medium">{supporter.name}</div>
                    <div className="font-bold text-gray-900 mt-0.5">₹{parseFloat(supporter.amount).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No supporters yet. Be the first to donate!</p>
            )}
          </div>
          <div className="text-center mt-6">
            <button 
              onClick={() => setIsSupportersModalOpen(true)}
              className="text-lime-600 font-semibold underline hover:text-lime-700 decoration-2 underline-offset-4"
            >
              View all supporters
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-6 md:p-8 mt-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-center text-lime-700 mb-8 border-b border-lime-200 pb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                question: "Is my donation tax-deductible?",
                answer: "Tax benefits under Section 80G are available only for eligible fundraisers. Where a fundraiser qualifies, the applicable tax benefit details are displayed clearly on the fundraiser page before you donate."
              },
              {
                question: "What fees does CHAH charge?",
                answer: "CHAH Foundation takes a 0% platform fee on all donations. A small payment gateway fee may apply."
              },
              {
                question: "How do I know my donation is reaching the right person?",
                answer: "We verify every campaign rigorously and transfer funds directly to the beneficiary's hospital or verified account."
              },
              {
                question: "Can I donate from outside India?",
                answer: "Yes! We accept international donations through most major credit cards and payment gateways."
              },
              {
                question: "Can I donate anonymously?",
                answer: "Yes, you can choose to make your donation anonymous during the checkout process."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-300",
                    isOpen 
                      ? "border-lime-200 bg-lime-50/30 shadow-sm" 
                      : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex items-center justify-between w-full text-left font-semibold text-gray-800 p-5 focus:outline-none"
                  >
                    <span className={cn("text-[15px]", isOpen && "text-lime-700")}>{faq.question}</span>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300",
                      isOpen ? "bg-lime-200 text-lime-700" : "bg-white border border-gray-200 text-gray-400"
                    )}>
                      {isOpen ? (
                        <span className="text-xl leading-none -mt-1">-</span>
                      ) : (
                        <span className="text-xl leading-none -mt-0.5">+</span>
                      )}
                    </div>
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 px-5",
                      isOpen ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed border-t border-lime-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>


      {/* Right Column - Sticky Donation Panel */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
        <div className="bg-[#faf9f7] rounded-xl shadow-lg border border-gray-200/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-gray-700" />
              <span className="text-xl font-medium text-gray-900">Donate</span>
            </div>
            <button 
              onClick={() => {
                document.getElementById('supporters-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-lime-700 underline decoration-lime-500/30 underline-offset-4 hover:text-lime-800 transition-colors cursor-pointer focus:outline-none"
            >
              {campaign.supporters_count || 0} supporters
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
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
              <div className="text-sm text-gray-600 mb-1">Raised</div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl font-bold text-lime-700">{formatMoney(raised)}</span>
                <span className="text-sm text-gray-500">of {formatMoney(target)}</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-14 bg-lime-600 hover:bg-lime-700 text-white text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
            onClick={() => window.location.href = `/donate?campaign=${campaign.id}`}
          >
            Donate now
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4 mb-6 font-medium">
            Card, Netbanking, Cheque pickups
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500 font-medium">Or <span className="text-lime-600">Donate using</span></span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* QR Box */}
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-white mb-6 shadow-sm">
            <QrCode className="w-24 h-24 text-gray-300 mb-4" />
            <Button variant="outline" className="w-full rounded-full border-lime-600 text-lime-700 hover:bg-lime-50 font-semibold">
              Generate QR
            </Button>
          </div>

          <p className="text-center text-sm text-gray-700 font-medium mb-4">
            Scan & donate with any app
          </p>

          {/* Payment App Icons Mock */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
               <span className="text-xs font-bold text-orange-500">PAY</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
               <span className="text-xs font-bold text-blue-500">GPay</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
               <span className="text-xs font-bold text-cyan-500">PTM</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
               <span className="text-xs font-bold text-purple-600">Pe</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
            <Button variant="outline" className="w-full bg-green-500 hover:bg-green-600 text-white border-transparent rounded-full font-medium h-12 flex items-center gap-2">
              <span className="text-lg">📱</span> Share
            </Button>
            <Button variant="outline" className="w-full border-lime-600 text-lime-700 hover:bg-lime-50 rounded-full font-medium h-12 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Supporters Modal */}
      {isSupportersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">All Supporters</h3>
              <button 
                onClick={() => setIsSupportersModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {initialSupporters.length > 0 ? (
                initialSupporters.map((supporter, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center font-bold text-xl shrink-0 uppercase shadow-sm">
                      {supporter.initial}
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{supporter.name}</div>
                      <div className="text-lime-700 font-bold mt-0.5">₹{parseFloat(supporter.amount).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No supporters yet.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button 
                onClick={() => setIsSupportersModalOpen(false)}
                className="w-full bg-lime-600 text-white font-bold py-3 rounded-xl hover:bg-lime-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Sticky Quick Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Goal: {percent}% reached</span>
          <span className="text-sm font-bold text-[#003399]">{formatMoney(raised)}</span>
        </div>
        <Link
          href={`/donate?campaign=${campaign.id}`}
          className="px-6 py-2.5 rounded-full bg-lime-600 hover:bg-lime-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Donate Now</span>
        </Link>
      </div>
    </div>
  );
}
