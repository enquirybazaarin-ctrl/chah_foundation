'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { KnowAboutUsData } from '@/lib/api';

const DEFAULT_DATA: KnowAboutUsData = {
  badge: 'Know About Us',
  heading: 'About Us',
  heading_highlight: 'Us',
  subheading:
    'We are a registered non-profit dedicated to educating, feeding, and empowering underprivileged children in Varanasi and rural Uttar-pradesh.',
  body: "Since 2015, we've transformed over 50,000 lives through free education, daily meals, healthcare, and skill training. Discover the profound impact of our initiatives spanning education, healthcare, and empowerment, as we tirelessly work towards creating a brighter future for those in need.",
  quote: 'Every child deserves hope. Every smile matters.',
  primary_button_text: 'Support Our Mission',
  primary_button_url: '/campaigns',
  secondary_button_text: 'Learn More',
  secondary_button_url: '/about',
  images: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
  ],
};

interface KnowAboutUsProps {
  data?: KnowAboutUsData | null;
}

export function KnowAboutUs({ data }: KnowAboutUsProps) {
  const content = {
    badge: data?.badge || DEFAULT_DATA.badge,
    heading: data?.heading || DEFAULT_DATA.heading,
    heading_highlight: data?.heading_highlight || DEFAULT_DATA.heading_highlight,
    subheading: data?.subheading || DEFAULT_DATA.subheading,
    body: data?.body || DEFAULT_DATA.body,
    quote: data?.quote || DEFAULT_DATA.quote,
    primary_button_text: data?.primary_button_text || DEFAULT_DATA.primary_button_text,
    primary_button_url: data?.primary_button_url || DEFAULT_DATA.primary_button_url,
    secondary_button_text: data?.secondary_button_text || DEFAULT_DATA.secondary_button_text,
    secondary_button_url: data?.secondary_button_url || DEFAULT_DATA.secondary_button_url,
    images: data?.images && data.images.length > 0 ? data.images : DEFAULT_DATA.images,
  };

  const images = content.images;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-slide effect (4.5s per slide)
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, images.length]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const renderHeading = (headingText: string, highlightWord: string) => {
    if (!highlightWord || !headingText.toLowerCase().includes(highlightWord.toLowerCase())) {
      return <span>{headingText}</span>;
    }
    const parts = headingText.split(new RegExp(`(${highlightWord})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightWord.toLowerCase() ? (
            <span key={i} className="text-[#95c718] relative inline-block whitespace-nowrap">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Layout Container:
            - Desktop (>= lg): 2-Column Grid:
                Left: Image Slider (lg:order-1)
                Right: Heading + Text + CTA Buttons (lg:order-2)
            - Mobile (< lg): Flex column with vertical sequence:
                1. Heading (order-1)
                2. Image Slider (order-2)
                3. Text Content & CTA Buttons (order-3)
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          
          {/* ── MOBILE HEADING ONLY (Order 1 on mobile, hidden on desktop) ── */}
          <div className="w-full lg:hidden order-1">
            {content.badge && (
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.14em] text-lime-800 uppercase">
                    {content.badge}
                  </span>
                </span>
              </div>
            )}
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#003399] tracking-tight leading-tight">
              {renderHeading(content.heading, content.heading_highlight)}
            </h2>
          </div>

          {/* ── PHOTO SLIDER (Left side on desktop, order-2 on mobile) ── */}
          <div className="w-full order-2 lg:order-1">
            <div
              className="relative w-full aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 bg-gray-100 select-none group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides */}
              {images.map((imgUrl, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
                    } transition-transform duration-1000`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`About CHAH Foundation slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    {/* Subtle gradient vignette for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                  </div>
                );
              })}

              {/* Slider Controls (Arrow Buttons) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 focus:outline-none"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 focus:outline-none"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                    {images.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        type="button"
                        onClick={() => setCurrentIndex(dotIndex)}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                          dotIndex === currentIndex
                            ? 'w-6 bg-[#95c718]'
                            : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${dotIndex + 1}`}
                      />
                    ))}
                  </div>

                  {/* Slide Counter Pill */}
                  <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[11px] font-bold text-white shadow-sm">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── TEXT CONTENT & CTAS (Right side on desktop, order-3 on mobile) ── */}
          <div className="w-full order-3 lg:order-2 max-w-xl z-10">
            
            {/* Desktop Heading (Hidden on mobile, shown on lg+) */}
            <div className="hidden lg:block mb-5">
              {content.badge && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                    <span className="text-[12px] font-bold tracking-[0.14em] text-lime-800 uppercase">
                      {content.badge}
                    </span>
                  </span>
                </div>
              )}
              <h2 className="font-heading text-4xl lg:text-[44px] font-extrabold text-[#003399] tracking-tight leading-[1.15]">
                {renderHeading(content.heading, content.heading_highlight)}
              </h2>
            </div>

            {/* Subheading (Semi-bold lead text) */}
            {content.subheading && (
              <p className="text-gray-800 text-base md:text-[17px] font-semibold leading-relaxed mb-4">
                {content.subheading}
              </p>
            )}

            {/* Body Description */}
            {content.body && (
              <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-5">
                {content.body}
              </p>
            )}

            {/* Highlight Tagline / Quote */}
            {content.quote && (
              <p className="text-[#881337] font-bold text-base md:text-lg mb-8 tracking-tight">
                {content.quote}
              </p>
            )}

            {/* CTA Buttons (Pill styling matching reference image with brand colors) */}
            <div className="flex flex-wrap items-center gap-4">
              {content.primary_button_text && (
                <Link
                  href={content.primary_button_url}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 px-7 py-3 text-sm font-bold shadow-md shadow-lime-500/20 hover:shadow-lg transition-all"
                >
                  <span>{content.primary_button_text}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>
              )}

              {content.secondary_button_text && (
                <Link
                  href={content.secondary_button_url}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003399] px-7 py-2.5 text-sm font-bold text-[#003399] hover:bg-blue-50/70 transition-colors"
                >
                  <span>{content.secondary_button_text}</span>
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
