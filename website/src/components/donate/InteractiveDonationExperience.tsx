"use client";

import React, { useState } from "react";
import { DonationForm } from "./DonationForm";
import { CelebrateWithChah } from "./CelebrateWithChah";
import type { DonationImpactCard } from "@/lib/api";
import { 
  Utensils, 
  Activity, 
  GraduationCap
} from "lucide-react";

interface InteractiveDonationExperienceProps {
  campaignParam?: string;
  initialCampaign?: any;
  campaignsList?: any[];
  impactCards?: DonationImpactCard[];
}

export function InteractiveDonationExperience({
  campaignParam,
  initialCampaign,
  campaignsList = [],
  impactCards = []
}: InteractiveDonationExperienceProps) {
  // Shared interactive selected amount (default ₹1000 matching mockup)
  const [selectedAmount, setSelectedAmount] = useState<number | "OTHERS">(1000);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  return (
    <>
      {/* ======================================================== */}
      {/* 1. HERO SECTION & SPLIT DONATION WIDGET                  */}
      {/* ======================================================== */}
      <section className="relative py-6 sm:py-12 md:py-16 lg:py-20 overflow-hidden bg-gray-50 border-b border-gray-200/60">
        {/* Background with kids overlay - subtly visible ("thoda thoda visible") */}
        <div 
          className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 25%',
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-50/90 via-gray-50/70 to-gray-50/50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#95c718]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Emotional Narrative & Impact */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">

              {/* H1 Heading: Bold & Balanced 2-Line Layout */}
              <h1 className="font-heading text-2xl sm:text-4xl lg:text-[46px] font-bold text-[#003399] tracking-tight leading-[1.15]">
                Your Donation <br />
                Can <span className="text-[#95c718]">Change Lives</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl font-normal leading-relaxed">
                Help us provide healthcare, nutrition, education and dignity to children, families and communities across India.
              </p>

              {/* Feature Tags / Action Pills */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <div className="flex items-center gap-2 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-800 text-xs sm:text-sm font-semibold shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <span>Feed A Child</span>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-800 text-xs sm:text-sm font-semibold shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span>Support Healthcare</span>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-800 text-xs sm:text-sm font-semibold shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span>Educate For Tomorrow</span>
                </div>
              </div>

              {/* Trust & Impact Stats Strip */}
              <div className="pt-6 border-t border-gray-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#003399] tracking-tight">50,000+</div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">Lives Impacted</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#003399] tracking-tight">25+</div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">Communities</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#95c718] tracking-tight">100%</div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">Transparent</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#003399] tracking-tight">80G</div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">Tax Exemption</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Donation Form with Connected Amount */}
            <div className="lg:col-span-6 max-w-xl mx-auto w-full">
              <DonationForm 
                initialCampaignId={campaignParam || (initialCampaign?.id ? String(initialCampaign.id) : undefined)}
                initialCampaign={initialCampaign}
                campaignsList={campaignsList}
                selectedAmount={selectedAmount}
                onAmountChange={setSelectedAmount}
                initialOccasion={selectedOccasion}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CELEBRATE WITH CHAH: MAKE YOUR SPECIAL DAY MATTER     */}
      {/* ======================================================== */}
      <CelebrateWithChah onSelectOccasion={(occ) => setSelectedOccasion(occ.type)} />
    </>
  );
}
