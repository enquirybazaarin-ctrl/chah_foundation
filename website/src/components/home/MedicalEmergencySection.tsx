import Link from "next/link";
import { ArrowRight, Users, Clock, Heart, CheckCircle2 } from "lucide-react";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";

interface MedicalEmergencySectionProps {
  data?: FeaturedCampaignSectionData | null;
}

// Fallback dummy campaigns ensuring zero broken states if offline or DB empty
const FALLBACK_FEATURED: FeaturedCampaignItem = {
  id: "medical-child-surgery",
  title: "Urgent heart surgery needed for 5-year-old Rohan",
  slug: "urgent-heart-surgery-rohan",
  beneficiary_name: "Rohan",
  beneficiary_age: 5,
  location: "Delhi, NCR",
  short_description: "Rohan has been diagnosed with a congenital heart defect. He needs immediate surgery to survive, but his parents cannot afford the medical costs.",
  target_amount: "450000",
  raised_amount: "185000",
  supporters_count: 142,
  is_featured: true,
  is_urgent: true,
  urgency_label: "Surgery in 3 Days",
  cta_button_text: "Help Rohan",
  featured_image_url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop",
  category: {
    id: "med",
    name: "MEDICAL EMERGENCY",
    slug: "medical-emergency",
  },
};

const FALLBACK_SUPPORTING: FeaturedCampaignItem[] = [
  {
    id: "medical-cancer-treatment",
    title: "Support Priya's leukemia treatment",
    slug: "support-priyas-leukemia",
    beneficiary_name: "Priya",
    beneficiary_age: 12,
    location: "Mumbai",
    short_description: "Priya requires 6 months of chemotherapy. Her father, a daily wage worker, has exhausted all savings.",
    target_amount: "600000",
    raised_amount: "420000",
    supporters_count: 315,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Critical",
    cta_button_text: "Help Priya",
    featured_image_url: "https://images.unsplash.com/photo-1616422285623-aa301f409bdc?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "med",
      name: "MEDICAL EMERGENCY",
      slug: "medical-emergency",
    },
  },
  {
    id: "medical-accident-recovery",
    title: "Help Ankit recover from a tragic accident",
    slug: "ankit-accident-recovery",
    beneficiary_name: "Ankit",
    beneficiary_age: 28,
    location: "Pune",
    short_description: "Ankit suffered severe injuries in a road accident. Funds are needed for his ongoing ICU care and upcoming surgeries.",
    target_amount: "800000",
    raised_amount: "350000",
    supporters_count: 89,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Help Ankit",
    featured_image_url: "https://images.unsplash.com/photo-1504151932400-72d4384f0e13?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "med",
      name: "MEDICAL EMERGENCY",
      slug: "medical-emergency",
    },
  },
  {
    id: "medical-kidney-transplant",
    title: "Kidney transplant for 45-year-old father",
    slug: "kidney-transplant-ramesh",
    beneficiary_name: "Ramesh",
    beneficiary_age: 45,
    location: "Bangalore",
    short_description: "Ramesh is the sole breadwinner for his family of four. He urgently needs a kidney transplant to live.",
    target_amount: "700000",
    raised_amount: "150000",
    supporters_count: 45,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Donor Ready",
    cta_button_text: "Help Ramesh",
    featured_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "med",
      name: "MEDICAL EMERGENCY",
      slug: "medical-emergency",
    },
  },
];

export function MedicalEmergencySection({ data }: MedicalEmergencySectionProps) {
  const badge = data?.section?.badge || "MEDICAL EMERGENCY CASES";
  const heading = data?.section?.heading || "Health cannot wait.";
  const subheading =
    data?.section?.subheading ||
    "When medical emergencies happen, timely support can make all the difference. Help provide essential treatment and care to people facing critical medical needs.";

  const featured = data?.featured || FALLBACK_FEATURED;
  const supporting =
    data?.supporting && data.supporting.length > 0
      ? data.supporting.slice(0, 3)
      : FALLBACK_SUPPORTING;

  // Calculate numbers for featured card
  const featRaised = parseFloat(featured.raised_amount) || 0;
  const featTarget = featured.target_amount ? parseFloat(featured.target_amount) : 0;
  const featProgress = featTarget > 0 ? Math.min(Math.round((featRaised / featTarget) * 100), 100) : 0;
  const featImage =
    featured.featured_image?.url ||
    featured.featured_image_url ||
    "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="py-10 md:py-14 bg-[#faf9f7] border-y border-gray-200/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
                {badge}
              </span>
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight max-w-4xl">
            {heading.includes("cannot wait") ? (
              (() => {
                const parts = heading.split("cannot wait");
                return (
                  <>
                    {parts[0]}
                    <span className="text-lime-500 inline-block whitespace-nowrap">
                      cannot wait
                    </span>
                    {parts[1] && <span>{parts[1]}</span>}
                  </>
                );
              })()
            ) : (
              heading
            )}
          </h2>
          {subheading && (
            <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
              {subheading}
            </p>
          )}
        </div>

        {/* ─── 1. LARGE FEATURED CAMPAIGN CARD ────────────────────────────── */}
        <div className="mb-12 rounded-2xl border border-gray-200/75 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Natural Photograph (Clear Image) */}
            <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[320px] lg:min-h-full bg-gray-100 overflow-hidden">
              <Link href={`/donate?campaign=${featured.id}`} className="block w-full h-full">
                <img
                  src={featImage}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Campaign Story, Need & Conversion Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 xl:pr-12 flex flex-col justify-center">
              <div className="mb-6">
                {/* Campaign Title */}
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
                  <Link href={`/donate?campaign=${featured.id}`} className="hover:text-lime-500 transition-colors line-clamp-2">
                    {featured.title}
                  </Link>
                </h3>

                {/* Story / Need Narrative */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featured.short_description ||
                    featured.description ||
                    "A small contribution directly supports medical treatment and ensures this patient receives the necessary care."}
                </p>
              </div>

              {/* Minimal Funding Progress Block */}
              <div className="mb-8 border-t border-gray-100 pt-5">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                      ₹{featRaised.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-500 font-medium ml-1.5">
                      raised of ₹{featTarget.toLocaleString("en-IN")} goal
                    </span>
                  </div>
                  <span className="text-xs font-bold text-lime-600 bg-lime-50 px-2 py-1 rounded-md border border-lime-100">
                    {featProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-lime-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(featProgress, 4)}%` }}
                  />
                </div>

                {/* Social Proof */}
                <div className="flex items-center justify-between text-[13px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      <strong className="text-gray-900">{featured.supporters_count || 12}</strong> contributors
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Verified
                  </span>
                </div>
              </div>

              {/* CTA & Trust Strip */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Link
                  href={`/donate?campaign=${featured.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-8 py-3.5 text-sm font-bold text-gray-950 shadow-sm hover:bg-lime-500 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>{featured.cta_button_text || "Support Now"}</span>
                </Link>

                <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-1.5 text-[11px] text-gray-600 bg-gray-50 px-3 py-3 rounded-lg border border-gray-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold uppercase tracking-widest">80G Tax Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. SUPPORTING CAMPAIGN CARDS ROW ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {supporting.map((campaign) => {
            const raised = parseFloat(campaign.raised_amount) || 0;
            const target = campaign.target_amount ? parseFloat(campaign.target_amount) : 0;
            const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
            const cardImg =
              campaign.featured_image?.url ||
              campaign.featured_image_url ||
              "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop";

            return (
              <div
                key={campaign.id}
                className="group flex flex-col rounded-2xl border border-gray-200/75 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Clear Image (4:3 ratio) */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                  <img
                    src={cardImg}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content: Person → Story → Need → Progress → Action */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Beneficiary Line */}
                    {campaign.beneficiary_name && (
                      <p className="text-[11px] font-bold text-lime-500 uppercase tracking-wider mb-2">
                        {campaign.beneficiary_name}
                        {campaign.beneficiary_age ? `, ${campaign.beneficiary_age} years old` : ""}
                        {campaign.location ? ` • ${campaign.location}` : ""}
                      </p>
                    )}

                    {/* Campaign Title */}
                    <h4 className="font-heading text-lg font-bold text-gray-900 group-hover:text-lime-500 transition-colors line-clamp-2 leading-tight mb-2.5">
                      {campaign.title}
                    </h4>

                    {/* Short Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-5">
                      {campaign.short_description ||
                        campaign.description ||
                        "Support this essential medical treatment and care."}
                    </p>
                  </div>

                  <div>
                    {/* Progress */}
                    <div className="pt-4 mb-5 border-t border-gray-100">
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 tracking-tight">
                          ₹{raised.toLocaleString("en-IN")}{" "}
                          <span className="text-gray-400 font-medium text-xs">
                            / ₹{target.toLocaleString("en-IN")}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold text-lime-600 bg-lime-50 px-1.5 py-0.5 rounded border border-lime-100">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-lime-400 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(progress, 3)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <strong className="text-gray-900">{campaign.supporters_count || 5}</strong> supporters
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Need
                        </span>
                      </div>
                    </div>

                    {/* Action CTA & Category */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/donate?campaign=${campaign.id}`}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-lime-400 py-3 px-4 text-sm font-bold text-gray-950 shadow-sm hover:bg-lime-500 transition-colors group-hover:shadow-md"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white/20" />
                        <span>
                          {campaign.cta_button_text ||
                            (campaign.beneficiary_name ? `Help ${campaign.beneficiary_name}` : "Help Now")}
                        </span>
                      </Link>

                      <div className="text-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {campaign.category?.name || "MEDICAL EMERGENCY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 3. MOBILE & BOTTOM VIEW ALL BUTTON ─────────────────────────── */}
        <div className="mt-12 text-center">
          <Link
            href="/campaigns?category=medical"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 px-8 py-4 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-lime-500 hover:border-rose-300 transition-colors"
          >
            <span>View All Medical Cases</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
