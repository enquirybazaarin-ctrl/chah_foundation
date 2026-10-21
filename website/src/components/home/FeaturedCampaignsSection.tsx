import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";
import { CampaignSlider } from "./CampaignSlider";

interface FeaturedCampaignsSectionProps {
  data?: FeaturedCampaignSectionData | null;
  hideHeader?: boolean;
}

export function FeaturedCampaignsSection({ data, hideHeader }: FeaturedCampaignsSectionProps) {
  const badge = data?.section?.badge || "FUNDRAISING FOR EXTREME NEEDS";
  const heading = data?.section?.heading || "Help a child continue their journey of learning.";
  const subheading =
    data?.section?.subheading ||
    "Help children access education, school essentials and the opportunities they deserve.";

  const campaigns: FeaturedCampaignItem[] = [];
  if (data?.featured) {
    campaigns.push(data.featured);
  }
  if (data?.supporting && data.supporting.length > 0) {
    data.supporting.forEach((c) => {
      if (!campaigns.some((existing) => existing.id === c.id)) {
        campaigns.push(c);
      }
    });
  }

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

        {/* Campaign Slider Layout or Clean Empty State */}
        {campaigns.length > 0 ? (
          <>
            <div className="w-full relative mt-8">
              <CampaignSlider campaigns={campaigns} />
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
          </>
        ) : (
          <div className="w-full text-center py-12 px-4 bg-white/70 rounded-2xl border border-gray-200/60 my-6 shadow-2xs">
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              No active campaigns in this category at the moment.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              New verified campaigns will appear here once published from the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
