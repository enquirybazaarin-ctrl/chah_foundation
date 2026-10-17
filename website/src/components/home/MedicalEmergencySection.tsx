import Link from "next/link";
import { ArrowRight, Users, Clock, Heart, CheckCircle2 } from "lucide-react";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";
import { CampaignSlider } from "./CampaignSlider";

interface MedicalEmergencySectionProps {
  data?: FeaturedCampaignSectionData | null;
  hideHeader?: boolean;
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

export function MedicalEmergencySection({ data, hideHeader }: MedicalEmergencySectionProps) {
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
            <h2 className="font-heading text-3xl md:text-5xl lg:text-[42px] font-bold text-[#003399] tracking-tight leading-tight max-w-4xl">
              {heading.includes("cannot wait") ? (
                (() => {
                  const parts = heading.split("cannot wait");
                  return (
                    <>
                      {parts[0]}
                      <span className="text-[#95c718] inline-block whitespace-nowrap">
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
        )}

        {/* Campaign Slider Layout */}
        <div className="w-full relative mt-8">
          <CampaignSlider campaigns={[featured, ...supporting]} />
        </div>

        {/* ─── 3. MOBILE & BOTTOM VIEW ALL BUTTON ─────────────────────────── */}
        <div className="mt-12 text-center">
          <Link
            href="/campaigns?category=medical"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 px-8 py-4 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-lime-600 hover:border-lime-400 transition-colors"
          >
            <span>View All Medical Cases</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
