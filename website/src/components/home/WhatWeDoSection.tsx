"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  HeartHandshake, 
  HeartPulse, 
  GraduationCap, 
  PawPrint,
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

/**
 * Auto-sliding image carousel component for the top 60-70% part of each card
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

    // Slight interval stagger between cards so they don't flip simultaneously
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
      className="relative w-full h-40 sm:h-44 lg:h-44 xl:h-48 overflow-hidden bg-stone-100 group/slider select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out transform",
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          )}
        >
          <img
            src={img}
            alt={`${title} - image ${idx + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
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

/**
 * Returns cause-specific icon component
 */
function CauseIcon({ type, color }: { type?: string; color?: string }) {
  const iconProps = { className: "w-3.5 h-3.5 text-white" };
  
  const iconMap: Record<string, React.ReactNode> = {
    essentials: <HeartHandshake {...iconProps} />,
    health: <HeartPulse {...iconProps} />,
    kids: <GraduationCap {...iconProps} />,
    animals: <PawPrint {...iconProps} />,
  };

  const selected = type ? iconMap[type] : undefined;

  return (
    <div 
      className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      style={{ backgroundColor: color || "#53b34b" }}
    >
      {selected || <HeartHandshake {...iconProps} />}
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
    <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200/50 overflow-hidden relative">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Wider container for spacious, wider cards */}
      <div className="container relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Section Heading & Subheading (Center aligned, in one single line on desktop) */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
              {badge}
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight mb-6">
            {heading.includes("Citizens in Need") ? (
              (() => {
                const parts = heading.split("Citizens in Need");
                return (
                  <>
                    {parts[0]}
                    <span className="text-lime-500 relative inline-block whitespace-nowrap">
                      Citizens in Need
                      <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-lime-400/30 rounded-full" />
                    </span>{" "}
                    <span className="whitespace-nowrap">{parts[1]?.trim()}</span>
                  </>
                );
              })()
            ) : (
              heading
            )}
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* 4 Cards in 1 Row in Desktop View with wider cards and compact viewport fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 items-stretch">
          {activeItems.map((item, index) => {
            const icon = (item.iconType || item.icon_type || "essentials") as any;
            const accent = item.accentColor || item.accent_color;

            return (
              <div
                key={item.id || index}
                className="group bg-white rounded-2xl border border-gray-200/75 shadow-sm hover:shadow-md hover:border-lime-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* ── TOP PART: Auto-Sliding Images ── */}
                <div className="relative w-full">
                  <CardAutoSlider 
                    images={item.images} 
                    title={item.title} 
                    cardIndex={index}
                  />

                  {/* Badge Pill on Top Left */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── BOTTOM PART: Icon & Main Heading in ONE line, Description, CTA ── */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Icon and Main Heading together in ONE line */}
                    <div className="flex items-center gap-3 mb-3">
                      <CauseIcon type={icon} color={accent} />
                      <h3 className="font-heading text-base font-bold text-gray-900 leading-snug group-hover:text-lime-500 transition-colors flex-1 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* Description - full text without cut */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Know More CTA Link */}
                  <div className="pt-3 border-t border-gray-100">
                    <Link
                      href={item.cta_link || "/about"}
                      className="inline-flex items-center text-sm font-bold text-lime-500 hover:text-lime-600 group/link transition-colors"
                    >
                      <span>{item.cta_text || "Know More"}</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
