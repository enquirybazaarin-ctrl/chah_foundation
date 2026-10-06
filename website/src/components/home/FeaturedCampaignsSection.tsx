import Link from "next/link";
import { ArrowRight, Users, Clock, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";

interface FeaturedCampaignsSectionProps {
  data?: FeaturedCampaignSectionData | null;
}

// Fallback dummy campaigns ensuring zero broken states if offline or DB empty
const FALLBACK_FEATURED: FeaturedCampaignItem = {
  id: "amit-education",
  title: "Help Amit continue his education",
  slug: "help-amit-continue-school",
  beneficiary_name: "Amit",
  beneficiary_age: 10,
  location: "Sitapur, UP",
  short_description: "Amit needs urgent support for his school fees and essential learning materials so he doesn't drop out of 5th grade.",
  target_amount: "8000",
  raised_amount: "3200",
  supporters_count: 12,
  is_featured: true,
  is_urgent: true,
  urgency_label: "5 days left",
  cta_button_text: "Help Amit",
  featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
  category: {
    id: "edu",
    name: "EDUCATION",
    slug: "education",
  },
};

const FALLBACK_SUPPORTING: FeaturedCampaignItem[] = [
  {
    id: "veena-kit",
    title: "Help Veena get a complete school kit",
    slug: "help-veena-school-kit",
    beneficiary_name: "Veena",
    beneficiary_age: 8,
    location: "Lucknow, UP",
    short_description: "Veena wants to attend school with proper notebooks, uniform, and bag.",
    target_amount: "5000",
    raised_amount: "1500",
    supporters_count: 7,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Help Veena",
    featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "school-support",
      name: "SCHOOL SUPPORT",
      slug: "school-support",
    },
  },
  {
    id: "bharti-fees",
    title: "Support Bharti's high school tuition fees",
    slug: "support-bharti-school-fees",
    beneficiary_name: "Bharti",
    beneficiary_age: 12,
    location: "Barabanki, UP",
    short_description: "A bright 7th grade student facing fee arrears after her father lost work.",
    target_amount: "10000",
    raised_amount: "4200",
    supporters_count: 19,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Fee Deadline Near",
    cta_button_text: "Help Bharti",
    featured_image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "edu",
      name: "EDUCATION",
      slug: "education",
    },
  },
  {
    id: "aarav-books",
    title: "Provide Aarav with books & winter uniform",
    slug: "aarav-learning-books",
    beneficiary_name: "Aarav",
    beneficiary_age: 9,
    location: "Rae Bareli, UP",
    short_description: "Needs textbooks, study stationery, and warm uniform for the school term.",
    target_amount: "12000",
    raised_amount: "6800",
    supporters_count: 24,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Help Aarav",
    featured_image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
    category: {
      id: "edu",
      name: "EDUCATION",
      slug: "education",
    },
  },
];

export function FeaturedCampaignsSection({ data }: FeaturedCampaignsSectionProps) {
  const badge = data?.section?.badge || "FUNDRAISING FOR EXTREME NEEDS";
  const heading = data?.section?.heading || "Help a child continue their journey of learning.";
  const subheading =
    data?.section?.subheading ||
    "Help children access education, school essentials and the opportunities they deserve.";

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
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-[#f8faf9] to-[#ffffff] border-y border-emerald-950/5">
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

          <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight max-w-4xl">
            {heading.includes("journey of learning") ? (
              (() => {
                const parts = heading.split("journey of learning");
                return (
                  <>
                    {parts[0]}
                    <span className="text-lime-500 inline-block whitespace-nowrap">
                      journey of learning
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
                    "A small contribution directly supports school fees, learning materials, and ensures this student continues their education without interruption."}
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
                  <span className="flex items-center gap-1 text-lime-500">
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
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
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
                        "Support essential school kit and learning essentials for this child."}
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
                        <span className="flex items-center gap-1 text-lime-500">
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
                          {campaign.category?.name || "EDUCATION"}
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
            href="/campaigns"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-lime-500 hover:border-lime-300 transition-colors"
          >
            <span>See all campaigns</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
