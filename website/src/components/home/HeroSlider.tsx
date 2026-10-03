"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "cn";
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const slides = [
  {
    tag: "80G Tax Benefit · 100% Transparent · Reaches within 48 hours",
    title: "A child is waiting for your",
    highlight: "decision today.",
    desc: "Right now, a child may go to sleep hungry or a mother may choose between medicine and food. Your one decision can change that.",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop", 
  },
  {
    tag: "Education Support Drive",
    title: "Give them the gift of",
    highlight: "education.",
    desc: "Thousands of children are waiting for a chance to go to school. Your support can build their future and empower generations.",
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop",
  },
  {
    tag: "Health Support Drive",
    title: "Healthcare for those",
    highlight: "who need it most.",
    desc: "Medical emergencies shouldn't mean bankruptcy. Help us provide life-saving treatments to families in urgent need.",
    img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2069&auto=format&fit=crop",
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[600px] w-full flex items-center justify-center bg-black">
      {/* Backgrounds */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src={slide.img} 
            alt="Hero background" 
            className="object-cover w-full h-full"
          />
        </div>
      ))}

      <div className="container relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white h-full flex flex-col justify-center">
        {/* We use a relative wrapper for the content to absolutely position slides on top of each other */}
        <div className="relative h-64 sm:h-72 w-full max-w-4xl mx-auto flex items-center justify-center">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={cn(
                "transition-all duration-1000 ease-in-out transform absolute inset-0 flex flex-col items-center justify-center w-full",
                index === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              )}
            >
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#A3E635] mr-2 flex-shrink-0" />
                <span className="truncate">{slide.tag}</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-md">
                {slide.title} <br className="hidden md:block" />
                <span className="text-[#A3E635] drop-shadow-sm">{slide.highlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
                {slide.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/donate" className={cn(buttonVariants({ size: "lg" }), "bg-[#A3E635] hover:bg-[#86c822] text-[#1A1A1A] font-bold w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg hover:-translate-y-0.5 transition-all btn-wave border-none")}>
                  <Heart className="mr-2 h-5 w-5 fill-current" />
                  Donate Now
                </Link>
                <Link href="/campaigns" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all backdrop-blur-sm")}>
                  See Real Impact
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-all">
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>
      <button onClick={nextSlide} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-all">
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
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
    </section>
  );
}
