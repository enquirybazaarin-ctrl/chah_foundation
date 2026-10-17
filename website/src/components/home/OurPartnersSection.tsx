"use client";

import { Building2, HeartPulse, GraduationCap, Landmark, ShieldCheck, Sparkles, Award } from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  color: string;
  bgLight: string;
  icon: any;
}

const PARTNERS: PartnerItem[] = [
  {
    id: "tata-trusts",
    name: "Tata Trusts",
    category: "Community & Rural Health",
    badge: "CSR Partner",
    color: "#005a9c",
    bgLight: "bg-blue-50/70 border-blue-100",
    icon: Award,
  },
  {
    id: "sbi-foundation",
    name: "SBI Foundation",
    category: "Healthcare & Education",
    badge: "Banking Ally",
    color: "#280071",
    bgLight: "bg-purple-50/70 border-purple-100",
    icon: Landmark,
  },
  {
    id: "apollo-hospitals",
    name: "Apollo Hospitals",
    category: "Emergency & Cardiac Surgeries",
    badge: "Medical Partner",
    color: "#0f766e",
    bgLight: "bg-teal-50/70 border-teal-100",
    icon: HeartPulse,
  },
  {
    id: "infosys-foundation",
    name: "Infosys Foundation",
    category: "Digital Classrooms & Libraries",
    badge: "Education Ally",
    color: "#007cc3",
    bgLight: "bg-sky-50/70 border-sky-100",
    icon: GraduationCap,
  },
  {
    id: "reliance-foundation",
    name: "Reliance Foundation",
    category: "Food Nutrition & Relief",
    badge: "CSR Partner",
    color: "#b91c1c",
    bgLight: "bg-red-50/70 border-red-100",
    icon: Building2,
  },
  {
    id: "hdfc-parivartan",
    name: "HDFC Parivartan",
    category: "Holistic Rural Upliftment",
    badge: "Impact Partner",
    color: "#1e3a8a",
    bgLight: "bg-indigo-50/70 border-indigo-100",
    icon: ShieldCheck,
  },
  {
    id: "max-healthcare",
    name: "Max Healthcare",
    category: "Pediatric & Critical Care",
    badge: "Hospital Partner",
    color: "#047857",
    bgLight: "bg-emerald-50/70 border-emerald-100",
    icon: HeartPulse,
  },
  {
    id: "giveindia",
    name: "GiveIndia",
    category: "Verified Philanthropy",
    badge: "Giving Partner",
    color: "#ea580c",
    bgLight: "bg-orange-50/70 border-orange-100",
    icon: Sparkles,
  },
  {
    id: "teach-for-india",
    name: "Teach For India",
    category: "Primary Education Alliance",
    badge: "Learning Ally",
    color: "#b45309",
    bgLight: "bg-amber-50/70 border-amber-100",
    icon: GraduationCap,
  },
  {
    id: "fortis-healthcare",
    name: "Fortis Healthcare",
    category: "Life-Saving Surgeries",
    badge: "Hospital Partner",
    color: "#0284c7",
    bgLight: "bg-cyan-50/70 border-cyan-100",
    icon: HeartPulse,
  },
];

export function OurPartnersSection() {
  // Double the list for infinite continuous loop
  const marqueeList = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-16 md:py-20 bg-[#faf9f7] border-t border-gray-200/60 overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-[12px] font-bold tracking-[0.14em] text-lime-700 uppercase">
              OUR PARTNERS & SUPPORTERS
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#003399] tracking-tight leading-tight max-w-3xl mx-auto">
          Collaborating with Trusted Leaders to <span className="text-[#95c718]">Transform Lives</span>
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We work alongside compassionate healthcare networks, corporate CSR initiatives, and educational institutions dedicated to creating sustainable, long-term impact.
        </p>
      </div>

      {/* Marquee Track Container with Gradient Edge Fades */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-36 lg:w-48 bg-gradient-to-r from-[#faf9f7] to-transparent z-10" />

        {/* Right Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-36 lg:w-48 bg-gradient-to-l from-[#faf9f7] to-transparent z-10" />

        {/* Continuous Animated Marquee Track */}
        <div className="flex items-center gap-6 partners-marquee-track w-max py-2">
          {marqueeList.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={`${partner.id}-${index}`}
                className="shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-lime-400 transition-all duration-300 hover:-translate-y-1 select-none min-w-[260px] sm:min-w-[290px]"
              >
                {/* Icon Badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${partner.bgLight}`}
                  style={{ color: partner.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-heading font-bold text-[#003399] text-[16px] leading-tight">
                      {partner.name}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-gray-500 line-clamp-1">
                    {partner.category}
                  </span>
                  <div className="mt-1">
                    <span className="inline-block text-[10px] font-semibold tracking-wider text-lime-700 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200/60 uppercase">
                      {partner.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded CSS Keyframe Animation for 100% Smooth Infinite Marquee */}
      <style jsx>{`
        @keyframes partnersMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .partners-marquee-track {
          animation: partnersMarquee 32s linear infinite;
        }

        .partners-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
