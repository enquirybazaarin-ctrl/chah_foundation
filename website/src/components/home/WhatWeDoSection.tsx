"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "cn";

export interface WhatWeDoItem {
  id: string;
  iconType?: "essentials" | "health" | "kids" | "animals" | string;
  icon_type?: "essentials" | "health" | "kids" | "animals" | string;
  title: string;
  description: string;
  images: string[];
  cta_text?: string;
  cta_link?: string;
  badge?: string;
  accentColor?: string;
  accent_color?: string;
}

export interface WhatWeDoSectionProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  items?: WhatWeDoItem[];
}

export const DEFAULT_WHAT_WE_DO_ITEMS: WhatWeDoItem[] = [
  {
    id: "essentials",
    iconType: "essentials",
    title: "Nourish, Warm, Provide Essentials",
    description:
      "We are dedicated to assisting those in need. Our mission involves providing essential food, blankets, and groceries to vulnerable communities.",
    images: [
      "https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    ],
    cta_text: "Know More",
    cta_link: "/campaigns?category=essentials",
    badge: "ESSENTIAL AID",
    accentColor: "#1e88e5",
  },
  {
    id: "health",
    iconType: "health",
    title: "Health Oasis for All",
    description:
      "At ChahFoundation we initiate positive change by providing crucial medical support, conducting health camps, and promoting blood donation",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop",
    ],
    cta_text: "Know More",
    cta_link: "/campaigns?category=health",
    badge: "MEDICAL RELIEF",
    accentColor: "#e91e63",
  },
  {
    id: "kids",
    iconType: "kids",
    title: "Kids First: Education, Sanitation, Water",
    description:
      "At ChahFoundation, we provide essential support for child education, clean water access, sanitation, and hygiene improvement initiatives",
    images: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    ],
    cta_text: "Know More",
    cta_link: "/campaigns?category=education",
    badge: "CHILD WELFARE",
    accentColor: "#ff9800",
  },
  {
    id: "animals",
    iconType: "animals",
    title: "Heartfelt Rescue: Lifeline",
    description:
      "We provide compassionate care, essential support, and medical treatment for animals in need, ensuring their well-being",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
    ],
    cta_text: "Know More",
    cta_link: "/campaigns?category=animal-welfare",
    badge: "ANIMAL CARE",
    accentColor: "#4caf50",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return `${API_URL}/${url}`;
}

/**
 * Auto-sliding image carousel component for the card cover
 */
function CardAutoSlider({ 
  images, 
  title, 
  cardIndex 
}: { 
  images: string[]; 
  title: string; 
  cardIndex: number; 
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const intervalTime = 3800 + (cardIndex * 400);

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [images.length, isPaused, cardIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-slate-100 select-none group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out transform",
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          )}
        >
          <img
            src={resolveImageUrl(img)}
            alt={`${title} - image ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}

      {/* Slide Navigation Arrows on hover */}
      {images.length > 1 && (
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="p-1 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition pointer-events-auto shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="p-1 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition pointer-events-auto shadow-sm"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Slide Progress Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx === current 
                  ? "w-3.5 bg-white shadow-sm" 
                  : "w-1 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WhatWeDoSection({
  badge = "WHAT WE DO",
  heading = "Supporting Citizens in Need Our National Commitment",
  subheading = "We strive to do good for all, addressing the diverse needs of people, fostering positive change and lasting impact.",
  items = DEFAULT_WHAT_WE_DO_ITEMS,
}: WhatWeDoSectionProps) {
  const activeItems = items && items.length > 0 ? items : DEFAULT_WHAT_WE_DO_ITEMS;

  return (
    <section className="py-14 md:py-20 bg-gray-50 border-y border-gray-200/50 overflow-hidden relative">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subheading */}
        <div className="mb-10 sm:mb-14 text-center flex flex-col items-center">
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.14em] text-gray-800 uppercase">
                {badge}
              </span>
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#003399] tracking-tight leading-tight max-w-4xl">
            {heading.includes("Citizens in Need") ? (
              (() => {
                const parts = heading.split("Citizens in Need");
                return (
                  <>
                    {parts[0]}
                    <span className="text-[#95c718] relative inline-block whitespace-nowrap">
                      Citizens in Need
                    </span>{" "}
                    <span className="whitespace-nowrap">{parts[1]?.trim()}</span>
                  </>
                );
              })()
            ) : (
              heading
            )}
          </h2>

          {subheading && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
              {subheading}
            </p>
          )}
        </div>

        {/* 4 Cards matching Our Impact (Completed Projects) card design: Cover photo, Category badge, Title, Description, Highlight pill, Action link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {activeItems.map((item, index) => {
            const badgeText = item.badge || "INITIATIVE";
            const itemImages = item.images && item.images.length > 0 
              ? item.images 
              : ["https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800&auto=format&fit=crop"];

            return (
              <article
                key={item.id || index}
                className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-lime-400 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 1. Project / Cause Cover Photograph (4:3 ratio) with auto slider */}
                <Link
                  href={item.cta_link || "/about"}
                  className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden block"
                  aria-label={`View details for ${item.title}`}
                >
                  <CardAutoSlider 
                    images={itemImages} 
                    title={item.title} 
                    cardIndex={index}
                  />

                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* 2. Category Label over the image */}
                  {badgeText && (
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-lime-800 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-slate-100 z-20">
                      {badgeText}
                    </div>
                  )}
                </Link>

                {/* Card Editorial Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* 3. Title with consistent typography */}
                    <h3 className="font-heading text-lg sm:text-[19px] font-bold text-[#003399] group-hover:text-[#95c718] transition-colors line-clamp-2 leading-snug mb-2.5">
                      <Link href={item.cta_link || "/about"} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>

                    {/* 4. Short, meaningful description */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* 5. Highlight / Impact pill (matching 'Why Education Support Drive?') */}
                    <div className="mb-4 bg-lime-50/80 border border-lime-200/70 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-lime-900 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                      <span className="line-clamp-1">Why {item.title}?</span>
                    </div>

                    {/* 6. Subtle "Know More" link with arrow & active status */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={item.cta_link || "/about"}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#003399] group-hover:text-[#95c718] transition-colors"
                      >
                        <span>{item.cta_text || "Know More"}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <Check className="w-3 h-3 text-lime-600 stroke-[3]" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
