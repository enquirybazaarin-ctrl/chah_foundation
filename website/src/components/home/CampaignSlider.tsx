"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedCampaignItem } from "@/lib/api";

export function CampaignSlider({ campaigns }: { campaigns: FeaturedCampaignItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto slide logic
  useEffect(() => {
    if (!scrollRef.current || campaigns.length <= 1) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current!;
      // If we've reached the end, loop back to the start
      if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
        scrollRef.current!.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // scroll to next item
        const scrollAmount = clientWidth >= 1024 ? clientWidth / 3 : clientWidth >= 640 ? clientWidth / 2 : clientWidth;
        scrollRef.current!.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000); // 3 seconds interval
    return () => clearInterval(interval);
  }, [campaigns.length]);

  const scrollPrev = () => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth >= 1024 ? clientWidth / 3 : clientWidth >= 640 ? clientWidth / 2 : clientWidth;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth >= 1024 ? clientWidth / 3 : clientWidth >= 640 ? clientWidth / 2 : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.chahfoundation.com').replace(/\/$/, '');
  const resolveMediaUrl = (url?: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div 
      className="relative group/slider w-full px-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll container */}
      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-6 pt-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {campaigns.map((campaign) => {
          const raised = parseFloat(campaign.raised_amount) || 0;
          const target = campaign.target_amount ? parseFloat(campaign.target_amount) : 0;
          const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
          const rawImg =
            campaign.featured_image?.url ||
            campaign.featured_image_url ||
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop";
          const cardImg = resolveMediaUrl(rawImg);

          return (
            <Link
              href={`/campaigns/${campaign.slug || campaign.id}`}
              key={campaign.id}
              className="snap-start snap-always shrink-0 w-[84vw] max-w-[320px] sm:w-[calc(50%-12px)] sm:max-w-none lg:w-[calc(33.333%-16px)] group flex flex-col rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image & Badge */}
              <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                <img
                  src={cardImg}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 text-lime-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm border border-lime-200/50">
                  {campaign.category?.name || "Fundraiser"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading text-[17px] font-bold text-[#003399] group-hover:text-[#95c718] transition-colors line-clamp-2 leading-tight mb-2">
                    {campaign.title}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-5">
                    {campaign.short_description || campaign.description || "Support this essential cause and make a difference."}
                  </p>
                </div>

                <div>
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-[15px] font-bold text-lime-700 tracking-tight">
                        Raised: ₹{raised.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Goal: ₹{target.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(progress, 3)}%` }}
                      />
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      <Users className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">
                      Created by: {campaign.beneficiary_name ? `${campaign.beneficiary_name}'s family` : "CHAH Foundation"}
                    </span>
                  </div>

                  {/* Footer: Supporters & Share */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="bg-lime-50 text-lime-800 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-lime-200/50">
                      {campaign.supporters_count || 5} supporters
                    </div>
                    <div 
                      className="bg-gray-100 group-hover:bg-lime-50 group-hover:text-lime-600 p-2 rounded-full transition-colors text-gray-600 relative z-10"
                      aria-label="Share campaign"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 sm:-left-3 xl:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md border border-gray-100 rounded-full p-1.5 sm:p-2 text-gray-700 hover:text-lime-600 hover:scale-110 transition-all opacity-90 md:opacity-0 group-hover/slider:opacity-100 flex items-center justify-center cursor-pointer"
        aria-label="Previous campaigns"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <button 
        onClick={scrollNext}
        className="absolute right-0 sm:-right-3 xl:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md border border-gray-100 rounded-full p-1.5 sm:p-2 text-gray-700 hover:text-lime-600 hover:scale-110 transition-all opacity-90 md:opacity-0 group-hover/slider:opacity-100 flex items-center justify-center cursor-pointer"
        aria-label="Next campaigns"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
