"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "cn";

export interface WorkCategoryItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  impact_stat?: string;
  image_url: string;
  image_alt?: string;
  cta_text?: string;
  cta_link: string;
  tag?: string;
  highlights?: string[];
}

export interface OurWorkSectionProps {
  badge?: string;
  heading?: string;
  description?: string;
  categories?: WorkCategoryItem[];
  viewAllText?: string;
  viewAllLink?: string;
}

export const DEFAULT_WORK_CATEGORIES: WorkCategoryItem[] = [
  {
    id: "education",
    number: "01",
    category: "Education",
    title: "Empowering children with education & opportunities for a brighter future.",
    description:
      "Helping children access education, learning resources, and opportunities for a brighter future. We provide school kits, tutoring centers, and girl-child scholarships to break the cycle of generational poverty.",
    impact_stat: "2,500+ children supported",
    image_url:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    image_alt: "Children in classroom raising hands to learn",
    cta_text: "Explore Education",
    cta_link: "/campaigns?category=education",
    tag: "FLAGSHIP PROGRAM",
    highlights: ["School Kits & Tuition", "Girl-Child Scholarships", "Digital Classrooms"],
  },
  {
    id: "healthcare",
    number: "02",
    category: "Healthcare",
    title: "Essential medical assistance and preventive healthcare for vulnerable families.",
    description:
      "Supporting individuals and families through medical assistance, health camps, and essential healthcare services so poverty never delays emergency treatment.",
    impact_stat: "14,000+ patients treated",
    image_url:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop",
    image_alt: "Doctor providing medical checkup to a community patient",
    cta_text: "Explore Healthcare",
    cta_link: "/campaigns?category=healthcare",
    highlights: ["Free Health Camps", "Emergency Surgery Aid"],
  },
  {
    id: "women-empowerment",
    number: "03",
    category: "Women Empowerment",
    title: "Skills, vocational training, and livelihood support for lasting independence.",
    description:
      "Creating opportunities for women through skills, livelihood support, awareness, and community initiatives, turning vulnerability into self-reliance.",
    impact_stat: "1,800+ women empowered",
    image_url:
      "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1000&auto=format&fit=crop",
    image_alt: "Women participating together in vocational empowerment training",
    cta_text: "Explore Women Empowerment",
    cta_link: "/campaigns?category=women-empowerment",
    highlights: ["Vocational Sewing", "Financial Literacy"],
  },
  {
    id: "community-development",
    number: "04",
    category: "Community Development",
    title: "Strengthening communities through essential resources & sustainable support.",
    description:
      "Collaborating with local leaders to deliver clean drinking water systems, disaster relief, hygiene programs, and durable social safety nets directly to underserved neighborhoods.",
    impact_stat: "45+ communities uplifted",
    image_url:
      "https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=1400&auto=format&fit=crop",
    image_alt: "Community members working side by side in sustainable village development",
    cta_text: "Explore Community Development",
    cta_link: "/campaigns?category=community",
    tag: "SUSTAINABLE IMPACT",
    highlights: ["Clean Water Access", "Disaster Emergency Relief", "Sanitation Infrastructure"],
  },
];

export function OurWorkSection({
  badge = "OUR WORK",
  heading = "Creating change where it matters most.",
  description = "We work alongside communities to create meaningful and lasting change through education, healthcare, women empowerment, and community development.",
  categories = DEFAULT_WORK_CATEGORIES,
  viewAllText = "Explore All Our Work",
  viewAllLink = "/campaigns",
}: OurWorkSectionProps) {
  const activeItems = categories && categories.length > 0 ? categories : DEFAULT_WORK_CATEGORIES;

  const primaryCard = activeItems[0];
  const sideCards = activeItems.slice(1, 3);
  const wideCard = activeItems[3];
  const extraCards = activeItems.slice(4);

  return (
    <section className="py-24 md:py-32 bg-[#faf8f5] border-y border-stone-200/70 overflow-hidden relative">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#53b34b]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#005e2d]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005e2d]/8 border border-[#005e2d]/15 text-[#005e2d] text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#53b34b] animate-pulse" />
            {badge}
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.12] mb-5">
            Creating change{" "}
            <span className="text-[#005e2d] relative inline-block">
              where it matters most
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#53b34b]/40 rounded-full" />
            </span>
            .
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Editorial Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
          
          {/* ── CARD 1: Education (Large Flagship Feature Card) ── */}
          {primaryCard && (
            <div className="lg:col-span-7 group bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:border-[#53b34b]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              {/* Photo Frame */}
              <div className="relative h-[320px] sm:h-[390px] w-full overflow-hidden bg-stone-100">
                <img
                  src={primaryCard.image_url}
                  alt={primaryCard.image_alt || primaryCard.category}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top Number & Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 shadow-sm">
                    <span>{primaryCard.number || "01"}</span>
                    <span className="text-white/40">/</span>
                    <span className="tracking-wider uppercase">{primaryCard.category}</span>
                  </span>

                  {primaryCard.tag && (
                    <span className="bg-[#A3E635] text-[#1A1A1A] text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                      {primaryCard.tag}
                    </span>
                  )}
                </div>

                {/* Impact Stat Badge on Image */}
                {primaryCard.impact_stat && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-stone-900 border border-stone-100 text-xs sm:text-sm font-extrabold px-4 py-2 rounded-2xl shadow-md flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#53b34b]" />
                    <span>{primaryCard.impact_stat}</span>
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#005e2d] mb-2">
                    {primaryCard.category}
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug group-hover:text-[#005e2d] transition-colors mb-3">
                    {primaryCard.title}
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                    {primaryCard.description}
                  </p>

                  {/* Highlights list */}
                  {primaryCard.highlights && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {primaryCard.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#53b34b]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={primaryCard.cta_link}
                    className="inline-flex items-center text-sm sm:text-base font-bold text-[#005e2d] hover:text-[#004722] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{primaryCard.cta_text || `Explore ${primaryCard.category}`}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <span className="text-xs font-semibold text-stone-400 font-mono">
                    CHAH Foundation
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── CARDS 2 & 3: Healthcare & Women Empowerment (Stacked Cards) ── */}
          <div className="lg:col-span-5 flex flex-col gap-7 lg:gap-8 justify-between">
            {sideCards.map((card) => (
              <div
                key={card.id}
                className="group flex-1 bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.08)] hover:border-[#53b34b]/50 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row p-3.5 gap-5"
              >
                {/* Photo Frame */}
                <div className="relative w-full sm:w-[195px] h-48 sm:h-auto min-h-[180px] rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={card.image_url}
                    alt={card.image_alt || card.category}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 sm:hidden" />
                  
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                    {card.number}
                  </span>
                </div>

                {/* Content */}
                <div className="p-2 sm:py-2.5 sm:pr-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#005e2d]">
                        {card.category}
                      </span>
                      {card.impact_stat && (
                        <span className="text-[11px] font-bold text-[#005e2d] bg-[#53b34b]/12 px-2.5 py-0.5 rounded-full">
                          {card.impact_stat}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-900 leading-snug group-hover:text-[#005e2d] transition-colors mb-2">
                      {card.category}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={card.cta_link}
                      className="inline-flex items-center text-xs sm:text-sm font-bold text-[#005e2d] hover:text-[#004722]"
                    >
                      <span>{card.cta_text || `Explore ${card.category}`}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── CARD 4: Community Development (Panoramic Feature Card) ── */}
          {wideCard && (
            <div className="lg:col-span-12 group bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:border-[#53b34b]/50 transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-12 p-3.5 sm:p-4 gap-6 md:gap-8 items-stretch">
              
              {/* Landscape Photo Frame */}
              <div className="relative min-h-[260px] md:min-h-[340px] md:col-span-5 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={wideCard.image_url}
                  alt={wideCard.image_alt || wideCard.category}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-white/15">
                    <span>{wideCard.number || "04"}</span>
                    <span className="text-white/40">/</span>
                    <span className="tracking-wider uppercase">{wideCard.category}</span>
                  </span>

                  {wideCard.tag && (
                    <span className="bg-[#A3E635] text-[#1A1A1A] text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                      {wideCard.tag}
                    </span>
                  )}
                </div>

                {wideCard.impact_stat && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-stone-900 border border-stone-100 text-xs sm:text-sm font-extrabold px-4 py-2 rounded-2xl shadow-md flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#53b34b]" />
                    <span>{wideCard.impact_stat}</span>
                  </div>
                )}
              </div>

              {/* Text Narrative */}
              <div className="p-4 sm:p-6 md:py-8 md:pr-8 md:col-span-7 flex flex-col justify-between space-y-5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#005e2d] mb-2">
                    {wideCard.category}
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug group-hover:text-[#005e2d] transition-colors mb-3">
                    {wideCard.title}
                  </h3>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-5">
                    {wideCard.description}
                  </p>

                  {/* Highlights list */}
                  {wideCard.highlights && (
                    <div className="flex flex-wrap gap-2">
                      {wideCard.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-3.5 py-1.5 rounded-full"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#53b34b]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Link
                    href={wideCard.cta_link}
                    className="inline-flex items-center text-sm sm:text-base font-bold text-[#005e2d] hover:text-[#004722] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{wideCard.cta_text || `Explore ${wideCard.category}`}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  {wideCard.impact_stat && (
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200/50 self-start sm:self-auto">
                      ★ {wideCard.impact_stat}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── DYNAMIC 5+ CARDS (If Admin Adds 5th or 6th Category) ── */}
          {extraCards.length > 0 && (
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
              {extraCards.map((extra, idx) => (
                <div
                  key={extra.id}
                  className="group bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.08)] hover:border-[#53b34b]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5"
                >
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={extra.image_url}
                      alt={extra.image_alt || extra.category}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {extra.number || `0${idx + 5}`}
                    </span>
                    {extra.impact_stat && (
                      <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-sm">
                        {extra.impact_stat}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#005e2d] mb-1">
                        {extra.category}
                      </div>
                      <h3 className="font-heading text-xl font-bold text-stone-900 leading-snug group-hover:text-[#005e2d] transition-colors mb-2">
                        {extra.title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {extra.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100">
                      <Link
                        href={extra.cta_link}
                        className="inline-flex items-center text-xs sm:text-sm font-bold text-[#005e2d] hover:text-[#004722]"
                      >
                        <span>{extra.cta_text || `Explore ${extra.category}`}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Section Bottom CTA */}
        <div className="mt-16 md:mt-20 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-3 bg-[#005e2d] hover:bg-[#004722] text-white font-extrabold text-base px-9 py-4 rounded-full shadow-[0_10px_25px_-5px_rgba(0,94,45,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,94,45,0.4)] hover:-translate-y-0.5 transition-all group"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
