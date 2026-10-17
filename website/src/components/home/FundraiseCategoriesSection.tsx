"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Stethoscope, BookOpen, HeartHandshake, Utensils, MoreHorizontal, ArrowRight, PartyPopper, Shirt, Sparkles, Leaf, Glasses, Soup } from "lucide-react";
import { cn } from "cn";
import { MedicalEmergencySection } from "./MedicalEmergencySection";
import { FeaturedCampaignsSection } from "./FeaturedCampaignsSection";
import { ImpactProjectsSection } from "./ImpactProjectsSection";
import type { FeaturedCampaignSectionData, ImpactProjectsSectionData } from "@/lib/api";

interface Props {
  featuredData: FeaturedCampaignSectionData | null;
  medicalData: FeaturedCampaignSectionData | null;
  eldercareData?: FeaturedCampaignSectionData | null;
  foodData?: FeaturedCampaignSectionData | null;
  impactData: ImpactProjectsSectionData | null;
}

export function FundraiseCategoriesSection({ featuredData, medicalData, eldercareData, foodData, impactData }: Props) {
  const [activeTab, setActiveTab] = useState("medical");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: "medical", label: "Medical", icon: Stethoscope },
    { id: "education", label: "Education", icon: BookOpen }, 
    { id: "eldercare", label: "Elder Care", icon: HeartHandshake },
    { id: "food", label: "Food & Hunger", icon: Utensils },
    { id: "others", label: "Other Cause", icon: MoreHorizontal }
  ];

  const otherCausesLinks = [
    { label: "Celebrations", icon: PartyPopper, href: "/workdetail/eyJpdiI6IjNLQVdNSjBoZ3JWVTRjSkpDaC92S3c9PSIsInZhbHVlIjoieHI4V01ybE1XM0dRU2hhbk80c1ZNQT09IiwibWFjIjoiM2NkYzNmZDA2OGYzMzkzNWQ4ZTUwMWQ4NWNmNzljNWE5M2YzN2E1NmM1MjJhN2NjNWUzYWIwNDJiNjY5ZGNiYyIsInRhZyI6IiJ9" },
    { label: "Blanket Donation Drive", icon: Shirt, href: "/workdetail/eyJpdiI6ImxsM1VuTkF0MXh2c3JFcXhZbjk1ZFE9PSIsInZhbHVlIjoiK3Y2TGw0TlVScjAvMzAvMlFYbisyZz09IiwibWFjIjoiYTkyMzQ1ZDkzMjc2ZmE0MGM1OTA0ZmI4MzgyODNmOWU5M2UzN2EyMGU0ZTEyNDlkZDk1MTJmOGIxNzY0MTU3MSIsInRhZyI6IiJ9" },
    { label: "Women Empowerment Drive", icon: Sparkles, href: "/workdetail/eyJpdiI6IlptQzk1Y05KZURGODhDSGxjc2tCQlE9PSIsInZhbHVlIjoiNVFBQ0hGbTEyNGMyZmtMS0RxdU9FZz09IiwibWFjIjoiYzk5MzIwMDFiMmM1NGJjNjcwODAwNDgwYjAzZWI3NjdiMDYxYjgzYmU4MGZlNThhMzgyMTFiNjM2YjRkY2Q5NyIsInRhZyI6IiJ9" },
    { label: "Environment Drive", icon: Leaf, href: "/workdetail/eyJpdiI6InRvcGsrYnMrVkxvZXVta3k1eFJkY0E9PSIsInZhbHVlIjoiZHVLck1qWFZUdUEzeXk5ejBYMyszUT09IiwibWFjIjoiMWU0ZjVhM2RlMGFmYjA0ZjgwOTM3ZWQyNjdhZjU1NDZjNmU4NDY2NzI0N2NiODczMzE2OWM3MDc4YmYzN2Y0NiIsInRhZyI6IiJ9" },
    { label: "Help for the Blind Drive", icon: Glasses, href: "/workdetail/eyJpdiI6ImdxUG12R25BQ3BidG1DTlZoL2h6MEE9PSIsInZhbHVlIjoiNm8zZzRKcndJeE1HTnMyOXlwdC8zdz09IiwibWFjIjoiYTY5MDAwZGViZWI3YzcwN2NlMmI0YjJiYTAwYTkyNDY5YjQwZjkxMmNhZDJiYjg0NWMwZjAzYjQ4NWRlMzdiNCIsInRhZyI6IiJ9" },
    { label: "Old Age Support Drive", icon: HeartHandshake, href: "/workdetail/eyJpdiI6Imh5dUJ6ZGJQWFhLejQrMnNSbmNWN1E9PSIsInZhbHVlIjoiLzlOaTF1bjQ0NTZKWlQ5Qmt0dGxiQT09IiwibWFjIjoiYTE5NWUxZWQzZGU3ZTJmODI5ZTViOTUyMzE0ODc5MjA2ZDBhMGM5Y2ViYzFjMDUxOGVmNzkwMDk0NWUzMTQ1NSIsInRhZyI6IiJ9" },
    { label: "Food Distribution Outside the Hospital", icon: Soup, href: "/workdetail/eyJpdiI6ImJITjZiekp2SVA5WDcyYUhVZ2lZOFE9PSIsInZhbHVlIjoiU1ZRaWcvUW10NHJrQkQ3cTVNbjhyZz09IiwibWFjIjoiN2M0ZWMwMzBlMjFmYTEzNWJhYzg5NGYxODRhOGYyMmEwYTNmZjUwYmQ5NjM1ZThiNjM5NmZkMDYwNGIzYjA4YiIsInRhZyI6IiJ9" }
  ];

  return (
    <div className="w-full bg-[#faf9f7] pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Master Heading & Subtext */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
                FUNDRAISE FOR A CAUSE
              </span>
            </div>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-[#003399] tracking-tight leading-tight max-w-4xl">
            Spark Change, Share Hope, Your Donation Can <span className="text-[#95c718]">Transform a Life</span>
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            From urgent medical care and a child’s education to supporting the elderly and fighting hunger, every contribution can create a better tomorrow. Choose a cause, support a campaign, and turn your kindness into meaningful change.
          </p>
        </div>

        {/* Filter Tabs Container */}
        <div className="relative max-w-full" ref={dropdownRef}>
          <div className="grid grid-cols-5 gap-1 sm:gap-4 sm:flex sm:flex-wrap sm:justify-center w-full px-0 sm:px-1 py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <div key={tab.id} className="w-full sm:w-auto relative">
                  <button
                    onClick={() => {
                      if (tab.id === "others") {
                        setDropdownOpen(!dropdownOpen);
                        setActiveTab("others");
                      } else {
                        setActiveTab(tab.id);
                        setDropdownOpen(false);
                      }
                    }}
                    className={cn(
                      "w-full h-full min-h-[66px] sm:min-h-0 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 px-1 sm:px-5 py-2 sm:py-3 rounded-xl border bg-white transition-all duration-300 sm:min-w-[160px] cursor-pointer shadow-2xs hover:shadow-sm",
                      isActive || (tab.id === "others" && dropdownOpen)
                        ? "border-lime-500 bg-lime-50/30 sm:bg-white shadow-[0_3px_10px_rgba(132,204,22,0.2)]" 
                        : "border-gray-200/80 hover:border-gray-300"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full transition-colors shrink-0",
                      (isActive || (tab.id === "others" && dropdownOpen)) ? "bg-lime-500 text-white shadow-xs" : "bg-lime-100 text-lime-700" 
                    )}>
                      <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <span className={cn(
                        "font-bold text-[9.5px] xs:text-[10px] sm:text-[15px] leading-tight transition-colors break-words",
                        (isActive || (tab.id === "others" && dropdownOpen)) ? "text-lime-700 sm:text-lime-600" : "text-gray-700 hover:text-lime-600"
                      )}>
                        {tab.label}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dropdown Menu for Others - Viewport Safe and positioned cleanly */}
          {dropdownOpen && (
            <div className="absolute top-full mt-2.5 right-0 sm:right-auto sm:left-1/2 sm:translate-x-28 lg:translate-x-32 max-w-[calc(100vw-2rem)] w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-lime-100/80 z-50 p-2 sm:p-3 flex flex-col gap-1 animate-in slide-in-from-top-2 fade-in">
              {otherCausesLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link 
                    key={link.label} 
                    href={link.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-lime-50/70 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-lime-50 text-lime-700 border border-lime-200/60 group-hover:bg-lime-500 group-hover:text-white group-hover:border-lime-500 group-hover:scale-105 transition-all duration-200 shrink-0 shadow-xs">
                      <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-[14px] font-semibold text-gray-800 group-hover:text-lime-700 transition-colors line-clamp-1">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Render Active Section */}
      <div className="transition-all duration-500 w-full animate-in fade-in zoom-in-95">
         {activeTab === "medical" && <MedicalEmergencySection data={medicalData} hideHeader={true} />}
         {activeTab === "education" && <FeaturedCampaignsSection data={featuredData} hideHeader={true} />}
         {activeTab === "eldercare" && <FeaturedCampaignsSection data={eldercareData} hideHeader={true} />}
         {activeTab === "food" && <FeaturedCampaignsSection data={foodData} hideHeader={true} />}
         {activeTab === "others" && (
           <ImpactProjectsSection data={impactData} hideHeader={true} />
         )}
      </div>
    </div>
  );
}
