import Link from "next/link";
import { ArrowRight, Users, Clock, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";
import { CampaignSlider } from "./CampaignSlider";

interface FeaturedCampaignsSectionProps {
  data?: FeaturedCampaignSectionData | null;
  hideHeader?: boolean;
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

export function FeaturedCampaignsSection({ data, hideHeader }: FeaturedCampaignsSectionProps) {
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
        {!hideHeader && (
          <div className="mb-12 text-center flex flex-col items-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
                  {badge}
                </span>
              </div>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-[#003399] tracking-tight leading-tight max-w-4xl">
              {heading.includes("journey of learning") ? (
                (() => {
                  const parts = heading.split("journey of learning");
                  return (
                    <>
                      {parts[0]}
                      <span className="text-[#95c718] inline-block whitespace-nowrap">
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
        )}

        {/* Campaign Slider Layout */}
        <div className="w-full relative mt-8">
          <CampaignSlider campaigns={[featured, ...supporting]} />
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
