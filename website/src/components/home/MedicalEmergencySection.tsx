import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeaturedCampaignItem, FeaturedCampaignSectionData } from "@/lib/api";
import { CampaignSlider } from "./CampaignSlider";

interface MedicalEmergencySectionProps {
  data?: FeaturedCampaignSectionData | null;
  hideHeader?: boolean;
}

export function MedicalEmergencySection({ data, hideHeader }: MedicalEmergencySectionProps) {
  const badge = data?.section?.badge || "MEDICAL EMERGENCY CASES";
  const heading = data?.section?.heading || "Health cannot wait.";
  const subheading =
    data?.section?.subheading ||
    "When medical emergencies happen, timely support can make all the difference. Help provide essential treatment and care to people facing critical medical needs.";

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

        {/* Campaign Slider Layout or Clean Empty State */}
        {campaigns.length > 0 ? (
          <>
            <div className="w-full relative mt-8">
              <CampaignSlider campaigns={campaigns} />
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
          </>
        ) : (
          <div className="w-full text-center py-12 px-4 bg-white/70 rounded-2xl border border-gray-200/60 my-6 shadow-2xs">
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              No active medical emergency campaigns at the moment.
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
