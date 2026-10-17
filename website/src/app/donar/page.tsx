"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Heart, 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Calendar,
  Gift,
  CheckCircle2,
  Users,
  Grid,
  SlidersHorizontal,
  HandHeart,
  TrendingUp
} from "lucide-react";

interface Donor {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  cause: string;
  causeColor: string;
  donationType: string;
  donationsCount: string;
  rating: number;
  highlight?: string;
}

const DONORS_LIST: Donor[] = [
  {
    id: "rahul-mehta",
    name: "Dr. Rahul Mehta",
    role: "Senior Physician & Medical Mentor",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote: "Transparent work and regular photo updates give me absolute confidence to support again and again. Seeing the Hospital on Wheels reach street children in real-time is deeply moving.",
    cause: "Free Medical Aid & Hospital on Wheels",
    causeColor: "bg-blue-50 text-[#003399] border-blue-200",
    donationType: "Monthly Supporter",
    donationsCount: "24+ Months",
    rating: 5,
    highlight: "Supported 450+ child medical checkups"
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Cloud Architect, Fintech",
    location: "Bengaluru, Karnataka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    quote: "A small regular donation truly creates lasting change when it reaches the right hands. Sponsoring annual school bags, books, and uniforms for Bhandup kids was the best gift I gave myself on my birthday.",
    cause: "Education Support Drive",
    causeColor: "bg-lime-50 text-lime-800 border-lime-200",
    donationType: "Birthday Giving",
    donationsCount: "Annual Patron",
    rating: 5,
    highlight: "Funded full-year schooling for 12 children"
  },
  {
    id: "amit-sneha-verma",
    name: "Amit & Sneha Verma",
    role: "Co-Founders, Tech Logistics",
    location: "Pune, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    quote: "Visiting their elderly day-care center gave us peace of mind knowing our contributions directly feed, comfort, and care for abandoned senior citizens who have nobody else to turn to.",
    cause: "Care & Dignity for Elders",
    causeColor: "bg-amber-50 text-amber-800 border-amber-200",
    donationType: "Quarterly Donor",
    donationsCount: "3+ Years",
    rating: 5,
    highlight: "Sponsors monthly rations for 25 elders"
  },
  {
    id: "ananya-deshmukh",
    name: "Ananya Deshmukh",
    role: "Child Development Researcher",
    location: "Nagpur, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    quote: "The holistic hands-on approach of CHAH Foundation is unmatched. They don't just distribute relief packets; they empower the whole community, enabling parents and mentoring children.",
    cause: "Holistic Child Welfare",
    causeColor: "bg-blue-50 text-[#003399] border-blue-200",
    donationType: "Monthly Donor",
    donationsCount: "18+ Months",
    rating: 5,
    highlight: "Supported early corrective health camps"
  },
  {
    id: "vikramaditya-singhania",
    name: "Vikramaditya Singhania",
    role: "Managing Director, Equity Capital",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    quote: "Every single rupee is accounted for with instant 80G tax exemption certificates. The level of governance, statutory compliance, and leadership ethics is why our family chose CHAH Foundation for our trust.",
    cause: "Hospital on Wheels & Healthcare",
    causeColor: "bg-lime-50 text-lime-800 border-lime-200",
    donationType: "Major Benefactor",
    donationsCount: "CSR Partner",
    rating: 5,
    highlight: "Equipped mobile healthcare unit"
  },
  {
    id: "kavita-sundaram",
    name: "Kavita Sundaram",
    role: "Professor of Literature",
    location: "Chennai, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    quote: "On my 50th birthday, I celebrated by donating educational kits. Receiving the personalized digital recognition card and seeing the genuine smiles of the kids was an unforgettable moment.",
    cause: "Celebrate With CHAH — Milestone Giving",
    causeColor: "bg-purple-50 text-purple-800 border-purple-200",
    donationType: "Occasion Donor",
    donationsCount: "Gold Supporter",
    rating: 5,
    highlight: "Provided 80 school kits"
  },
  {
    id: "rajesh-kothari",
    name: "Rajesh Kothari",
    role: "Industrialist",
    location: "Ahmedabad, Gujarat",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    quote: "With 138 million elderly in India, loneliness and lack of medical assistance is a silent epidemic. Children’s Help & Helpage Foundation bridges this gap with exceptional sensitivity.",
    cause: "Senior Shelter & Healthcare",
    causeColor: "bg-amber-50 text-amber-800 border-amber-200",
    donationType: "Monthly Patron",
    donationsCount: "5+ Years",
    rating: 5,
    highlight: "Supports geriatric health camps"
  },
  {
    id: "neha-kapoor",
    name: "Neha Kapoor",
    role: "Brand Strategist & Writer",
    location: "New Delhi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    quote: "I set up a recurring contribution of ₹1,000 every month. Knowing that underprivileged children get nutritious hot meals and milk before their morning classes brings deep joy to my heart.",
    cause: "Nutrition & Daily Meals Relief",
    causeColor: "bg-lime-50 text-lime-800 border-lime-200",
    donationType: "Monthly Hero",
    donationsCount: "14+ Months",
    rating: 5,
    highlight: "Sponsors 200 nutritious meals"
  },
  {
    id: "manish-chawla",
    name: "Manish Chawla",
    role: "Principal IT Consultant",
    location: "Hyderabad, Telangana",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop",
    quote: "The special attention given to physically challenged children for early detection and corrective care is rare. Mr. Patne and the team manage cases with true personal ownership.",
    cause: "Special Needs Child Corrective Care",
    causeColor: "bg-blue-50 text-[#003399] border-blue-200",
    donationType: "Quarterly Supporter",
    donationsCount: "2+ Years",
    rating: 5,
    highlight: "Sponsored 6 corrective surgeries"
  },
  {
    id: "pooja-nair",
    name: "Pooja Nair",
    role: "Head of People & Culture",
    location: "Kochi, Kerala",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop",
    quote: "Instead of return gifts on our 10th wedding anniversary, our guests contributed via a shared campaign link. CHAH made sharing so effortless and sent beautiful thank-you cards to all our friends.",
    cause: "Celebrate With CHAH — Anniversary",
    causeColor: "bg-purple-50 text-purple-800 border-purple-200",
    donationType: "Anniversary Campaign",
    donationsCount: "Community Champion",
    rating: 5,
    highlight: "Raised ₹65,000 for child nutrition"
  },
  {
    id: "harishankar-joshi",
    name: "Harishankar Joshi",
    role: "Retired Chief Manager, SBI",
    location: "Lucknow, Uttar Pradesh",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    quote: "As a senior citizen myself, I feel deep respect for their grass-roots elder initiatives across 15 states. They treat every older person not as a beneficiary, but as their own elder family member.",
    cause: "Universal Pension & Elder Rights",
    causeColor: "bg-amber-50 text-amber-800 border-amber-200",
    donationType: "Life Member",
    donationsCount: "30+ Contributions",
    rating: 5,
    highlight: "Advocate for rural elderly care"
  },
  {
    id: "divya-iyer",
    name: "Divya Iyer",
    role: "Biotechnology Researcher",
    location: "Kolkata, West Bengal",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop",
    quote: "During harsh winters, watching the CHAH field workers distribute heavy blankets and warm clothing on foot to street dwellers proves that this organization is pure action and real dedication.",
    cause: "Winter Blanket & Street Relief",
    causeColor: "bg-blue-50 text-[#003399] border-blue-200",
    donationType: "Seasonal Donor",
    donationsCount: "8+ Campaigns",
    rating: 5,
    highlight: "Provided 150 thermal blankets"
  }
];

export default function DonorsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");

  const filterCategories = [
    "All",
    "Medical Aid",
    "Education",
    "Elder Care",
    "Celebrate Giving",
    "Nutrition"
  ];

  const filteredDonors = DONORS_LIST.filter((donor) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Medical Aid") return donor.cause.includes("Medical") || donor.cause.includes("Healthcare");
    if (selectedFilter === "Education") return donor.cause.includes("Education");
    if (selectedFilter === "Elder Care") return donor.cause.includes("Elder") || donor.cause.includes("Senior");
    if (selectedFilter === "Celebrate Giving") return donor.cause.includes("Celebrate");
    if (selectedFilter === "Nutrition") return donor.cause.includes("Nutrition") || donor.cause.includes("Relief");
    return true;
  });

  const checkScrollBounds = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">

      {/* ======================================================== */}
      {/* 1. HERO BANNER (DIRECTLY AFTER HEADER)                   */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="Smiling children and community supported by generous donors of CHAH Foundation"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25 pointer-events-none" />

          {/* Breadcrumbs & Hero Caption */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/about" className="hover:text-lime-300 transition-colors">About Us</Link>
                <span>/</span>
                <span className="text-lime-400">Our Supporting Donors</span>
              </nav>

              <div className="space-y-1.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  COMMUNITY VOICES &amp; PATRONS
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  Our Supporting Donors
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium">
                  Hear directly from the wonderful hearts whose generosity fuels healthcare, nourishment, and dignity for children and elders across India.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#003399] text-xs font-bold shadow-xs">
                  10,000+ Donors &amp; Growing
                </span>
                <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-xs font-black shadow-xs">
                  100% Tax Exempt (80G)
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 hidden sm:inline">
                  Verified Real Impact Testimonials
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STATS BAR                                             */}
      {/* ======================================================== */}
      <section className="bg-white border-b border-gray-100 py-6 sm:py-8 shadow-2xs">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#003399]">10,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Generous Contributors</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#95c718]">15 States</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Ground Footprint</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#003399]">1,00,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Meals &amp; Medical Aids</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#95c718]">100%</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">Transparency &amp; 80G Receipts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MAIN SECTION: DONOR VOICES (SIDE-SCROLLABLE)          */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 fill-lime-700 text-lime-700" />
                <span>WORDS OF LOVE FROM OUR DONORS</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399]">
                Our Supporting <span className="text-[#95c718]">Donors</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mt-2 font-normal">
                Swipe and scroll horizontally through the inspiring stories, thoughts, and kind words of individuals and families who make our work possible every single day.
              </p>
            </div>

            {/* Scroll Navigation Controls & View Mode Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Filter / View Switch */}
              <button
                onClick={() => setViewMode(viewMode === "scroll" ? "grid" : "scroll")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#003399] hover:bg-gray-50 transition-colors"
                title={viewMode === "scroll" ? "Switch to Grid View" : "Switch to Carousel View"}
              >
                {viewMode === "scroll" ? (
                  <>
                    <Grid className="w-4 h-4 text-[#003399]" />
                    <span>View All Grid</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-4 h-4 text-[#003399]" />
                    <span>Side Scroll View</span>
                  </>
                )}
              </button>

              {/* Arrow Buttons (for side scroll) */}
              {viewMode === "scroll" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous Donors"
                    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                      canScrollLeft 
                        ? "bg-white hover:bg-blue-50 border-gray-300 text-[#003399] shadow-sm hover:scale-105 active:scale-95" 
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleScroll("right")}
                    disabled={!canScrollRight}
                    aria-label="Next Donors"
                    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                      canScrollRight 
                        ? "bg-[#95c718] hover:bg-[#85b514] border-[#95c718] text-slate-950 shadow-md hover:scale-105 active:scale-95" 
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cause Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilter === cat
                    ? "bg-[#003399] text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="text-xs text-gray-400 font-semibold pl-2">
              Showing {filteredDonors.length} donors
            </span>
          </div>

          {/* ======================================================== */}
          {/* A. SIDE-SCROLLABLE SHELF VIEW (DEFAULT)                  */}
          {/* ======================================================== */}
          {viewMode === "scroll" ? (
            <div className="relative">
              {/* Fade masks for visual hint of side-scroll on desktop */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden sm:block" />
              )}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden sm:block" />
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScrollBounds}
                className="flex gap-5 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"
                style={{ scrollbarColor: "#95c718 #f1f5f9" }}
              >
                {filteredDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="w-[300px] sm:w-[360px] md:w-[390px] shrink-0 snap-start flex flex-col justify-between rounded-3xl bg-[#fafaf8] border border-gray-200/90 hover:border-[#003399]/40 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Top: Rating & Cause Tag */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${donor.causeColor}`}>
                          {donor.donationType}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(donor.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-5">
                        <Quote className="w-8 h-8 text-lime-400/40 absolute -top-3 -left-2 -z-0" />
                        <p className="text-gray-700 text-sm leading-relaxed relative z-10 font-normal italic">
                          &ldquo;{donor.quote}&rdquo;
                        </p>
                      </div>

                      {/* Highlight chip */}
                      {donor.highlight && (
                        <div className="mb-5 p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 flex items-center gap-2 text-xs font-semibold text-lime-900">
                          <Sparkles className="w-3.5 h-3.5 text-lime-700 shrink-0" />
                          <span>{donor.highlight}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Donor Details & Avatar */}
                    <div className="pt-4 border-t border-gray-200/80">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={donor.avatar}
                          alt={donor.name}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-[#003399] truncate tracking-tight">
                            {donor.name}
                          </h3>
                          <p className="text-xs text-gray-600 truncate font-medium">
                            {donor.role}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#95c718] shrink-0" />
                            <span className="truncate">{donor.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cause Supported Pill */}
                      <div className="mt-3 text-[11px] font-semibold text-[#003399] bg-white px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-lime-600 shrink-0" />
                        <span className="truncate">{donor.cause}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Swipe Guide Hint on Mobile */}
              <div className="flex sm:hidden items-center justify-center gap-2 text-xs text-gray-500 font-semibold pt-2">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Swipe left &amp; right to see all 12+ donors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* B. FULL GRID VIEW                                        */
            /* ======================================================== */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-3xl bg-[#fafaf8] border border-gray-200/90 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${donor.causeColor}`}>
                        {donor.donationType}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(donor.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="relative mb-5">
                      <Quote className="w-8 h-8 text-lime-400/40 absolute -top-3 -left-2 -z-0" />
                      <p className="text-gray-700 text-sm leading-relaxed relative z-10 font-normal italic">
                        &ldquo;{donor.quote}&rdquo;
                      </p>
                    </div>

                    {donor.highlight && (
                      <div className="mb-5 p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 flex items-center gap-2 text-xs font-semibold text-lime-900">
                        <Sparkles className="w-3.5 h-3.5 text-lime-700 shrink-0" />
                        <span>{donor.highlight}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200/80">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={donor.avatar}
                        alt={donor.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#003399] truncate tracking-tight">
                          {donor.name}
                        </h3>
                        <p className="text-xs text-gray-600 truncate font-medium">
                          {donor.role}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#95c718] shrink-0" />
                          <span className="truncate">{donor.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] font-semibold text-[#003399] bg-white px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3 h-3 text-lime-600 shrink-0" />
                      <span className="truncate">{donor.cause}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY OUR SUPPORTERS CHOOSE CHAH FOUNDATION              */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3.5 py-1 rounded-full">
              DONOR CONFIDENCE &amp; TRUST
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight mt-3">
              Why Donors Stand With Us
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              When you give to Children&apos;s Help &amp; Helpage Foundation, you receive complete peace of mind, transparent reporting, and prompt tax exemption certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Instant 80G Tax Exemption
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Eligible donations receive an authentic Section 80G tax receipt immediately upon completion, saving up to 50% on income tax.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-[#003399]" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Photo &amp; Progress Updates
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We believe in complete visibility. Donors receive ground photos, verification reports, and updates on how meals and kits were delivered.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
                <HandHeart className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Grassroots Ground Presence
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Direct engagement across 15 states in India ensures funds go straight to needy children and neglected older persons without leakages.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FINAL CALL TO ACTION (AGAR KOI DONATE KRNA CHHAHTA HAI)*/}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#003399] via-[#002673] to-[#001e5a] text-white text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-lime-400/10 pointer-events-none blur-2xl" />

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-300 text-xs font-bold uppercase tracking-wider mb-5">
            <Heart className="w-3.5 h-3.5 fill-lime-300" />
            <span>JOIN OUR FAMILY OF SUPPORTERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Ready to Become a <span className="text-[#95c718]">Supporting Donor?</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Every contribution feeds a hungry child, provides urgent medical aid, and restores dignity to an elderly person. Your compassion creates real smiles on the ground today.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="px-8 py-4 rounded-2xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-base transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 hover:scale-103 active:scale-98"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              <span>Make a Donation Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/celebrate"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/25 text-white font-bold text-base transition-all flex items-center gap-2"
            >
              <Gift className="w-5 h-5 text-lime-300" />
              <span>Celebrate With CHAH</span>
            </Link>
          </div>

          {/* Quick Assurance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Instant Section 80G Tax Exemption
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              100% Secure via Razorpay
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Digital Impact Certificate
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
