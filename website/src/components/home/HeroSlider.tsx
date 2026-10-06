"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "cn";
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export interface HeroSlideItem {
  id?: string;
  tag?: string | null;
  title: string;
  highlight?: string | null;
  description?: string | null;
  desc?: string;
  image_url?: string;
  img?: string;
  primary_button_text?: string | null;
  primary_button_url?: string | null;
  secondary_button_text?: string | null;
  secondary_button_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    title: "",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop",
  },
  {
    title: "",
    image_url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2069&auto=format&fit=crop",
  }
];

interface HeroSliderProps {
  slides?: HeroSlideItem[];
}

export function HeroSlider({ slides: propSlides }: HeroSliderProps = {}) {
  const activeSlides = (propSlides && propSlides.length > 0 ? propSlides : DEFAULT_SLIDES).map(slide => {
    // Check if this is one of the dummy seed slides from the backend
    if (
      slide.title?.includes("A child is waiting") || 
      slide.title?.includes("Give them the gift") || 
      slide.title?.includes("Healthcare for those")
    ) {
      return { 
        ...slide, 
        tag: "", 
        title: "", 
        highlight: "", 
        description: "", 
        primary_button_text: "", 
        secondary_button_text: "" 
      };
    }
    return slide;
  });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Reset current slide if count changed
    if (current >= activeSlides.length) {
      setCurrent(0);
    }
  }, [activeSlides.length, current]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[600px] w-full flex items-center justify-center bg-black">
      {/* Backgrounds */}
      {activeSlides.map((slide, index) => {
        const bgImg = slide.image_url || slide.img || DEFAULT_SLIDES[0].image_url!;
        return (
          <div 
            key={slide.id || index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === current ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src={bgImg} 
              alt={slide.title} 
              className="object-cover w-full h-full"
            />
          </div>
        );
      })}

      <div className="container relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white h-full flex flex-col justify-center">
        {/* Relative wrapper for the content */}
        <div className="relative h-64 sm:h-72 w-full max-w-4xl mx-auto flex items-center justify-center">
          {activeSlides.map((slide, index) => {
            const desc = slide.description || slide.desc;
            const primaryBtnText = slide.primary_button_text || "Donate Now";
            const primaryBtnUrl = slide.primary_button_url || "/donate";
            const secondaryBtnText = slide.secondary_button_text || "See Real Impact";
            const secondaryBtnUrl = slide.secondary_button_url || "/campaigns";

            return (
              <div 
                key={slide.id || index}
                className={cn(
                  "transition-all duration-1000 ease-in-out transform absolute inset-0 flex flex-col items-center justify-center w-full",
                  index === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                )}
              >
                {slide.tag && (
                  <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-[#A3E635] mr-2 flex-shrink-0" />
                    <span className="truncate">{slide.tag}</span>
                  </div>
                )}
                
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-md">
                  {slide.title} {slide.highlight && <><br className="hidden md:block" /><span className="text-[#A3E635] drop-shadow-sm ml-2 md:ml-0">{slide.highlight}</span></>}
                </h1>
                
                {desc && (
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
                    {desc}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {primaryBtnText && (
                    <Link href={primaryBtnUrl} className={cn(buttonVariants({ size: "lg" }), "bg-[#A3E635] hover:bg-[#86c822] text-[#1A1A1A] font-bold w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg hover:-translate-y-0.5 transition-all btn-wave border-none")}>
                      <Heart className="mr-2 h-5 w-5 fill-current" />
                      {primaryBtnText}
                    </Link>
                  )}
                  {secondaryBtnText && (
                    <Link href={secondaryBtnUrl} className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all backdrop-blur-sm")}>
                      {secondaryBtnText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows (if multiple slides) */}
      {activeSlides.length > 1 && (
        <>
          <button 
            onClick={prevSlide} 
            aria-label="Previous slide"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-all"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <button 
            onClick={nextSlide} 
            aria-label="Next slide"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-all"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  current === index ? "w-8 bg-[#A3E635]" : "w-2 bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
