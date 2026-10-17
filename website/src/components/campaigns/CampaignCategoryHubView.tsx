"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Share2, 
  TrendingUp, 
  Award,
  CreditCard,
  Gift,
  Building2,
  Handshake,
  UserCheck
} from "lucide-react";
import type { SerializableCampaignCategoryConfig } from "@/lib/campaign-categories-data";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";

interface CampaignCategoryHubViewProps {
  config: SerializableCampaignCategoryConfig;
  sectionData: FeaturedCampaignSectionData;
}

export default function CampaignCategoryHubView({ config, sectionData }: CampaignCategoryHubViewProps) {
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");

  // Resolve section texts (Admin DB settings take precedence if customized)
  const badge = sectionData.section?.badge || config.defaultBadge;
  const heading = sectionData.section?.heading || config.defaultHeading;
  const subheading = sectionData.section?.subheading || config.defaultSubheading;

  // Resolve featured campaign
  const featured: FeaturedCampaignItem = sectionData.featured || config.fallbackFeatured;

  // Resolve supporting campaigns
  const supporting: FeaturedCampaignItem[] = 
    sectionData.supporting && sectionData.supporting.length > 0
      ? sectionData.supporting
      : config.fallbackSupporting;

  // Calculate featured progress
  const featRaised = parseFloat(featured.raised_amount || "0");
  const featTarget = parseFloat(featured.target_amount || "1");
  const featPercent = featTarget > 0 ? Math.min(Math.round((featRaised / featTarget) * 100), 100) : 0;

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEffectiveDonationAmount = () => {
    if (customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) {
      return Number(customAmount);
    }
    return selectedDonationAmount;
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER (DIRECTLY AFTER HEADER)                   */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full min-h-[340px] sm:min-h-0 sm:h-[380px] md:h-[440px] lg:h-[480px] flex flex-col justify-end">
          <img
            src={config.heroImage}
            alt={config.displayTitle}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/25 pointer-events-none" />

          {/* Breadcrumbs & Hero Content */}
          <div className="relative z-10 w-full pb-6 sm:pb-10 pt-16 sm:pt-20">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/campaigns" className="hover:text-lime-300 transition-colors">Campaigns</Link>
                <span>/</span>
                <span className="text-lime-400">{config.categoryTag}</span>
              </nav>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                    {badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/20 hidden sm:inline">
                    Verified NGO Drive
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                  {config.legacyTitle}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-3xl font-medium leading-relaxed">
                  {heading} — {subheading}
                </p>
              </div>

              {/* Trust & Tax Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2 text-[11px] sm:text-xs text-white/90">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#003399] font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#95c718]" />
                  <span>Section 80G 50% Tax Exemption</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 font-medium">
                  <Users className="w-3.5 h-3.5 text-lime-300" />
                  <span>100% Direct Ground Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 font-medium hidden sm:inline-flex">
                  <Award className="w-3.5 h-3.5 text-[#95c718]" />
                  <span>Instant Digital Receipt</span>
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STATS BAR                                             */}
      {/* ======================================================== */}
      <section className="bg-white border-b border-gray-100 py-6 sm:py-8 shadow-2xs">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {config.impactStats.map((stat, idx) => (
              <div key={idx} className="p-3">
                <p className={`text-2xl sm:text-4xl font-black ${idx % 2 === 0 ? "text-[#003399]" : "text-[#95c718]"}`}>
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED CASE SPOTLIGHT                               */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3.5 py-1 rounded-full">
              FEATURED BENEFICIARY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight mt-3">
              Urgent Support Spotlight
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Every single rupee directly saves a life or funds critical schooling. Follow live progress below.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200/90 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Media column */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm">
                  <img
                    src={featured.featured_image_url || config.heroImage}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                  {featured.is_urgent && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md animate-pulse">
                        {featured.urgency_label || "Urgent Need"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Information & Progress column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {featured.beneficiary_name && (
                    <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-900 font-bold">
                      Beneficiary: {featured.beneficiary_name} {featured.beneficiary_age ? `(${featured.beneficiary_age} yrs)` : ""}
                    </span>
                  )}
                  {featured.location && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#95c718]" />
                      <span>{featured.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#003399] tracking-tight leading-snug">
                  {featured.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  {featured.short_description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2 p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="flex justify-between items-baseline text-xs sm:text-sm font-bold">
                    <span className="text-[#003399]">
                      Raised: <strong className="text-base text-slate-900">{formatMoney(featRaised)}</strong>
                    </span>
                    <span className="text-gray-500">
                      Goal: {formatMoney(featTarget)}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#95c718] rounded-full transition-all duration-700"
                      style={{ width: `${featPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
                    <span className="font-semibold text-lime-700">{featPercent}% Completed</span>
                    <span className="font-semibold">{featured.supporters_count || 12} Generous Donors</span>
                  </div>
                </div>

                {/* Donate CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={`/donate?cause=${encodeURIComponent(featured.slug)}`}
                    className="px-7 py-3.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 hover:scale-102"
                  >
                    <Heart className="w-4 h-4 fill-slate-950" />
                    <span>{featured.cta_button_text || "Donate to this Case"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/campaigns/${featured.slug}`}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-[#003399] font-bold text-sm transition-all shadow-2xs"
                  >
                    <span>Read Full Story</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ACTIVE SUPPORTING CASES GRID                          */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime-700" />
              <span>ACTIVE COMMUNITY CASES</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399]">
              Support Children &amp; Elders in Need
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
              Browse all verified beneficiary appeals currently open for contribution. Every donation receives Section 80G tax benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {supporting.map((item) => {
              const r = parseFloat(item.raised_amount || "0");
              const t = parseFloat(item.target_amount || "1");
              const p = t > 0 ? Math.min(Math.round((r / t) * 100), 100) : 0;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs hover:shadow-lg hover:border-[#003399]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={item.featured_image_url || config.heroImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {item.is_urgent && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                            {item.urgency_label || "Urgent"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-bold text-[#003399]">{item.category?.name || config.categoryTag}</span>
                        {item.location && <span>{item.location}</span>}
                      </div>

                      <h3 className="text-lg font-black text-[#003399] tracking-tight group-hover:text-[#85b514] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {item.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    {/* Mini Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-200/80">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-900">{formatMoney(r)}</span>
                        <span className="text-gray-500">Goal: {formatMoney(t)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#95c718] rounded-full"
                          style={{ width: `${p}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500 pt-0.5">
                        <span className="font-semibold text-lime-700">{p}% Funded</span>
                        <span>{item.supporters_count || 10} Donors</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/donate?cause=${encodeURIComponent(item.slug)}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-xs text-center transition-all shadow-xs"
                      >
                        Donate Now
                      </Link>
                      <Link
                        href={`/campaigns/${item.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-white border border-gray-300 text-[#003399] font-bold text-xs text-center hover:bg-gray-50 transition-colors"
                      >
                        Story
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. WHY THIS CAMPAIGN MATTERS                             */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#003399] text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-4 h-4 text-[#003399]" />
              <span>THE ROOT CAUSE &amp; URGENCY</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399] leading-tight">
              Why <span className="text-[#95c718]">{config.displayTitle}</span> Matters
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              {config.whyDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.whyPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-black text-sm">
                  0{index + 1}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#003399] tracking-tight">
                  {point.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. INSTANT DONATION BOX WIDGET                           */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 text-center">
          
          <div className="p-8 sm:p-10 rounded-3xl bg-[#fafaf8] border-2 border-lime-200/80 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-lime-100 px-3.5 py-1 rounded-full">
                QUICK DONATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#003399] mt-3">
                Make an Instant Contribution
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                All donations are eligible for 50% tax exemption under Section 80G.
              </p>
            </div>

            {/* Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedDonationAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-2xl text-sm font-black border transition-all ${
                    selectedDonationAmount === amt && !customAmount
                      ? "bg-[#95c718] border-[#95c718] text-slate-950 shadow-sm"
                      : "bg-white border-gray-300 text-slate-800 hover:border-[#003399]"
                  }`}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₹</span>
              <input
                type="number"
                placeholder="Or enter custom amount (e.g. ₹10,000)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399] bg-white font-semibold"
              />
            </div>

            <Link
              href={`/donate?amount=${getEffectiveDonationAmount()}&cause=${encodeURIComponent(config.slug)}`}
              className="w-full py-4 rounded-2xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-102"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              <span>Donate ₹{getEffectiveDonationAmount().toLocaleString("en-IN")} Securely Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                Instant 80G Certificate
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                Razorpay Bank Security
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                UPI, Cards &amp; NetBanking
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FINAL TRIPLE ACTION CTA                               */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#003399] via-[#002673] to-[#001e5a] text-white text-center relative overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Stand With Us for <span className="text-[#95c718]">{config.displayTitle}</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Every contribution directly feeds, heals, and educates someone in deep need. Choose how you would like to be part of the change.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-left">
            
            {/* Card 1: Donate */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#95c718] text-slate-950 flex items-center justify-center font-bold mb-3">
                  <Heart className="w-5 h-5 fill-slate-950" />
                </div>
                <h4 className="text-base font-black text-[#003399]">Direct Donation</h4>
                <p className="text-xs text-gray-600 mt-1">
                  100% transparent. Receive automated 80G tax receipt immediately.
                </p>
              </div>
              <Link
                href={`/donate?cause=${encodeURIComponent(config.slug)}`}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Donate Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Volunteer */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold mb-3">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-[#003399]">Join as Volunteer</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Walk the ground with us. Distribute kits, tutor students, or help camps.
                </p>
              </div>
              <Link
                href="/volunteer"
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#003399] hover:bg-[#002673] text-white font-black text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Celebrate Giving */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold mb-3">
                  <Gift className="w-5 h-5 text-lime-700" />
                </div>
                <h4 className="text-base font-black text-[#003399]">Celebrate With Us</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Dedicate your birthday or anniversary to provide meals or school supplies.
                </p>
              </div>
              <Link
                href="/celebrate"
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#003399] font-black text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Occasion Drive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
