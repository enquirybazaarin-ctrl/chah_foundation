import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PartnerWithUsSection() {
  return (
    <section id="partner" className="py-20 md:py-28 bg-slate-50/60 border-t border-slate-200/80 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HOMEPAGE VIEW: Clean Two-Column Hero linking to Complete Page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-50 border border-lime-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.14em] text-lime-800 uppercase">
                PARTNER WITH CHAH FOUNDATION
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003399] tracking-tight leading-[1.15]">
              Together, We Can Create <span className="text-[#95c718]">Lasting Change.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Your expertise, resources and commitment can help us build a healthier, better-educated and more hopeful future for communities in need.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Primary CTA: Navigates to Complete Partner Page Enquiry Form */}
              <Link
                href="/partner-with-us#enquiry"
                className="px-7 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA: Navigates to Complete Partner Page Opportunities */}
              <Link
                href="/partner-with-us#opportunities"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-300 text-slate-800 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>

          {/* Right Column: Authentic Editorial Photograph */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 bg-white">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
                alt="CHAH Foundation community volunteers and partners working together"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-white/60 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Direct Grassroots Collaboration</p>
                  <p className="text-[11px] text-slate-500">Impacting communities across 6 Indian states</p>
                </div>
                <span className="text-[11px] font-bold text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
                  Verified NGO
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
