"use client";

import { ShieldCheck, HeartHandshake, CheckCircle2, Award } from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  logo: string;
  alt: string;
}

export const REAL_PARTNERS: PartnerItem[] = [
  {
    id: "ministry-youth-affairs",
    name: "Ministry of Youth Affairs & Sports",
    subtitle: "Government of India",
    badge: "Govt. Partner",
    logo: "/partnercompanies/goverment.webp",
    alt: "Ministry of Youth Affairs & Sports - Government of India",
  },
  {
    id: "nehru-yuva-kendra",
    name: "Nehru Yuva Kendra Sangathan",
    subtitle: "Autonomous Body Under MYAS",
    badge: "National Ally",
    logo: "/partnercompanies/nehru-yuva.webp",
    alt: "Nehru Yuva Kendra Sangathan (NYKS)",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    subtitle: "Secure Payment Gateway",
    badge: "Payments Partner",
    logo: "/partnercompanies/razorpay.webp",
    alt: "Razorpay Payment Gateway",
  },
  {
    id: "google-pay",
    name: "Google Pay",
    subtitle: "Digital UPI & Giving Partner",
    badge: "Giving Ally",
    logo: "/partnercompanies/google-pay.webp",
    alt: "Google Pay",
  },
  {
    id: "valson-industries",
    name: "Valson Industries Limited",
    subtitle: "Creation Never Ends Here",
    badge: "CSR Partner",
    logo: "/partnercompanies/valson.webp",
    alt: "Valson Industries Limited",
  },
  {
    id: "lodha-ithink",
    name: "Lodha iTHINK",
    subtitle: "The Ultimate Business Campus",
    badge: "Corporate Ally",
    logo: "/partnercompanies/lodha-ithink.webp",
    alt: "Lodha iTHINK Business Campus",
  },
  {
    id: "aromatics-india",
    name: "Aromatics (India) Pvt. Ltd.",
    subtitle: "Commitment Towards Quality",
    badge: "Industry Partner",
    logo: "/partnercompanies/aromatics-india.webp",
    alt: "Aromatics India Pvt. Ltd.",
  },
  {
    id: "digital-hub-plus",
    name: "Digital Hub Plus",
    subtitle: "Technology & Digital Enablement",
    badge: "Tech Ally",
    logo: "/partnercompanies/digital-hub-plus.webp",
    alt: "Digital Hub Plus",
  },
];

export function OurPartnersSection() {
  // Triple the list for an ultra-smooth, continuous infinite loop without gaps
  const marqueeList = [...REAL_PARTNERS, ...REAL_PARTNERS, ...REAL_PARTNERS];

  return (
    <section className="py-16 md:py-24 bg-[#faf9f7] border-t border-slate-200/70 overflow-hidden relative" id="partners">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-50 border border-lime-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.14em] text-lime-800 uppercase">
              OUR PARTNERS &amp; SUPPORTERS
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold text-[#003399] tracking-tight leading-tight max-w-3xl mx-auto">
          Collaborating with Trusted Leaders to <span className="text-[#95c718]">Transform Lives</span>
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We work alongside compassionate government ministries, national youth institutions, corporate CSR innovators, and payment leaders dedicated to transparent, verified grassroots impact.
        </p>
      </div>

      {/* Marquee Track Container with Gradient Edge Fades */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-gradient-to-r from-[#faf9f7] to-transparent z-10" />

        {/* Right Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-gradient-to-l from-[#faf9f7] to-transparent z-10" />

        {/* Continuous Animated Marquee Track */}
        <div className="flex items-center gap-5 sm:gap-6 partners-marquee-track w-max py-3">
          {marqueeList.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="shrink-0 flex items-center gap-4 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-lime-400 transition-all duration-300 hover:-translate-y-1 select-none min-w-[290px] sm:min-w-[340px] max-w-[360px] group/card"
            >
              {/* Real Partner Logo Frame */}
              <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-2.5 shrink-0 group-hover/card:bg-white group-hover/card:border-lime-200 transition-colors">
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="max-h-full max-w-full object-contain filter group-hover/card:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Partner Details */}
              <div className="flex flex-col text-left overflow-hidden">
                <h3 className="font-heading font-bold text-slate-900 group-hover/card:text-[#003399] transition-colors text-sm sm:text-[15px] leading-tight line-clamp-2">
                  {partner.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {partner.subtitle}
                </p>
                <div className="mt-1.5">
                  <span className="inline-block text-[10px] font-bold tracking-wider text-lime-800 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200/60 uppercase">
                    {partner.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Highlights Strip below the Marquee */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100/70 text-lime-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">80G Tax Exemption</p>
              <p className="text-[11px] text-slate-500">Official Income Tax deduction</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Govt. Registered NGO</p>
              <p className="text-[11px] text-slate-500">Regd No: E-36382 (India)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">100% Grassroots</p>
              <p className="text-[11px] text-slate-500">Verified ground implementation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">CSR Compliance</p>
              <p className="text-[11px] text-slate-500">Audited financial reporting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframe Animation for Ultra-Smooth Infinite Marquee */}
      <style jsx>{`
        @keyframes partnersMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }

        .partners-marquee-track {
          animation: partnersMarquee 34s linear infinite;
        }

        .partners-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

