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
  const effectiveSlides = (propSlides && propSlides.length > 0) ? propSlides : DEFAULT_SLIDES;
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://api.chahfoundation.com").replace(/\/$/, "");

  const activeSlides = effectiveSlides.map(slide => {
    let img = (slide.image_url || slide.img || "").trim();

    // 1. Resolve relative /media paths
    if (img.startsWith("/media/")) {
      img = `${apiBase}${img}`;
    }

    // 2. Replace localhost / dev origins
    if (img.includes("localhost:5000")) {
      img = img.replace("http://localhost:5000", apiBase);
    }
    if (img.includes("127.0.0.1:5000")) {
      img = img.replace("http://127.0.0.1:5000", apiBase);
    }

    // 3. Upgrade insecure http to https for production API
    if (img.startsWith("http://api.chahfoundation.com")) {
      img = img.replace("http://api.chahfoundation.com", "https://api.chahfoundation.com");
    }

    // Check if this is one of the dummy seed slides from the backend
    if (
      slide.title?.includes("A child is waiting") || 
      slide.title?.includes("Give them the gift") || 
      slide.title?.includes("Healthcare for those")
    ) {
      return { 
        ...slide,
        image_url: img,
        img: img,
        tag: "", 
        title: "", 
        highlight: "", 
        description: "", 
        primary_button_text: "", 
        secondary_button_text: "" 
      };
    }
    return {
      ...slide,
      image_url: img || slide.image_url,
      img: img || slide.img
    };
  });

  const [current, setCurrent] = useState(0);

  // Touch gesture support for mobile swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

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
    <section 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative overflow-hidden w-full aspect-[1920/800] sm:aspect-auto sm:h-[70vh] sm:min-h-[500px] lg:h-[85vh] lg:min-h-[600px] flex items-center justify-center bg-black select-none"
    >
      {/* Backgrounds */}
      {activeSlides.map((slide, index) => {
        const bgImg = slide.image_url || slide.img || DEFAULT_SLIDES[0].image_url!;
        const desc = slide.description || slide.desc;
        const hasText = Boolean(slide.tag || slide.title || desc);

        return (
          <div 
            key={slide.id || index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === current ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <img 
              src={bgImg} 
              alt={slide.title || "Hero banner"} 
              className="object-contain sm:object-cover object-center w-full h-full"
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].image_url!;
                if (target.src !== fallback) {
                  console.warn(`[HeroSlider] Banner image not reachable: ${bgImg}. Falling back to default.`);
                  target.src = fallback;
                }
              }}
            />
            {/* Subtle contrast gradient only when text is rendered */}
            {hasText && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />
            )}
          </div>
        );
      })}

      <div className="container relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white h-full flex flex-col justify-end pb-3 sm:pb-24 md:pb-36 pointer-events-none">
        {/* Relative wrapper for the content */}
        <div className="relative h-full sm:h-64 md:h-72 w-full max-w-4xl mx-auto flex items-center justify-center pointer-events-auto">
          {activeSlides.map((slide, index) => {
            const desc = slide.description || slide.desc;
            const hasText = Boolean(slide.tag || slide.title || desc);
            if (!hasText) return null;

            return (
              <div 
                key={slide.id || index}
                className={cn(
                  "transition-all duration-1000 ease-in-out transform absolute inset-0 flex flex-col items-center justify-center w-full",
                  index === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                )}
              >
                {slide.tag && (
                  <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 sm:px-4 sm:py-1.5 text-[10px] sm:text-sm font-medium text-white mb-1.5 sm:mb-4 backdrop-blur-md">
                    <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#A3E635] mr-1.5 sm:mr-2 shrink-0" />
                    <span className="truncate">{slide.tag}</span>
                  </div>
                )}
                
                {slide.title && (
                  <h1 className="font-heading text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-1 sm:mb-4 drop-shadow-md">
                    {slide.title} {slide.highlight && <><br className="hidden md:block" /><span className="text-[#A3E635] drop-shadow-sm ml-1.5 md:ml-0">{slide.highlight}</span></>}
                  </h1>
                )}
                
                {desc && (
                  <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/90 mb-2 sm:mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow line-clamp-2 sm:line-clamp-none">
                    {desc}
                  </p>
                )}

                {(slide.primary_button_text || slide.secondary_button_text) && (
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                    {slide.primary_button_text && (
                      <Link 
                        href={slide.primary_button_url || "/donate"} 
                        className={cn(buttonVariants({ size: "sm" }), "sm:h-12 sm:px-8 sm:text-base bg-[#A3E635] hover:bg-[#86c822] text-[#1A1A1A] font-bold text-xs h-8 px-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-all border-none")}
                      >
                        <Heart className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-5 sm:w-5 fill-current" />
                        {slide.primary_button_text}
                      </Link>
                    )}
                    {slide.secondary_button_text && (
                      <Link 
                        href={slide.secondary_button_url || "/campaigns"} 
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "sm:h-12 sm:px-8 sm:text-base text-xs h-8 px-4 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all backdrop-blur-sm")}
                      >
                        {slide.secondary_button_text}
                        <ArrowRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      </Link>
                    )}
                  </div>
                )}
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
            className="absolute left-1.5 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/15 transition-all"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
          <button 
            onClick={nextSlide} 
            aria-label="Next slide"
            className="absolute right-1.5 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/15 transition-all"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-1.5 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-1.5 sm:space-x-3">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-1 sm:h-2 rounded-full transition-all duration-300",
                  current === index ? "w-4 sm:w-8 bg-[#A3E635]" : "w-1 sm:w-2 bg-white/50 hover:bg-white/80"
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
