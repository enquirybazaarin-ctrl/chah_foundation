"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "cn";
import { Menu, X, ChevronDown, ChevronRight, Heart } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) setExpandedSection(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Close mobile menu on Escape key or window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setExpandedSection(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 shadow-xs bg-white">
      {/* Top Trust Bar - Compact & Single-Line on Mobile, Spacious on Desktop */}
      <div className="w-full bg-[#A3E635] text-[#1A1A1A] font-bold text-[10px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-12 flex items-center justify-between z-50 border-b border-[#92ce2d]/30">
        {/* Mobile View: Clean horizontal scrolling / flex single line */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto hide-scrollbar whitespace-nowrap text-[10px] sm:text-xs font-semibold py-0.5">
          <span className="inline-flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
            Regd: E-36382
          </span>
          <span className="text-slate-900/40">|</span>
          <span>80G No: AACTC9927GF2022801</span>
          <span className="text-slate-900/40">|</span>
          <span className="hidden sm:inline">PAN: AACTC9927G</span>
          <span className="hidden md:inline text-slate-900/40">|</span>
          <span className="hidden md:inline">Trust: AAXCA6387N</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 ml-2">
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 sm:h-3.5 sm:w-3.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-3.5 sm:w-3.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 sm:h-3.5 sm:w-3.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-3.5 sm:w-3.5"><path d="M2.5 7.1C2 8.7 2 12 2 12s0 3.3.5 4.9a3 3 0 0 0 2 2.1C6.1 19.5 12 19.5 12 19.5s5.9 0 7.5-.5a3 3 0 0 0 2-2.1c.5-1.6.5-4.9.5-4.9s0-3.3-.5-4.9a3 3 0 0 0-2-2.1C17.9 2.5 12 2.5 12 2.5s-5.9 0-7.5.5a3 3 0 0 0-2 2.1z"/><path d="m10 15 5-3-5-3v6z"/></svg>
          </Link>
        </div>
      </div>

      {/* Main Header - Brand Bright Modern */}
      <div className="h-16 sm:h-20 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 lg:px-12 relative">
        
        {/* Logo with responsive height and zero clipping */}
        <Link href="/" className="flex items-center space-x-2 h-full z-50 shrink-0">
          <img 
            src="/mainlogo.webp" 
            alt="CHAH Foundation" 
            className="h-11 sm:h-14 lg:h-16 w-auto object-contain transition-transform" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-medium text-[#1A1A1A] text-sm xl:text-base">
          <Link href="/" className="hover:text-[#95c718] transition-colors relative group py-2">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#95c718] transition-all group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <button className="hover:text-[#95c718] transition-colors flex items-center gap-1 py-4 font-medium cursor-pointer">
              About Us <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-white shadow-xl rounded-b-xl border-t-2 border-[#95c718] overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link href="/about" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Who we are</Link>
                <Link href="/overteam" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Our Trustees and Teams</Link>
                <Link href="/donar" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Our Supporting (Donors)</Link>
                <Link href="/volunteer" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Volunteer</Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="hover:text-[#95c718] transition-colors flex items-center gap-1 py-4 font-medium cursor-pointer">
              Programs <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-white shadow-xl rounded-b-xl border-t-2 border-[#95c718] overflow-hidden z-50">
              <div className="flex flex-col py-2 max-h-[70vh] overflow-y-auto">
                <Link href="/programs" className="px-4 py-2 font-bold text-[#003399] hover:bg-lime-50 transition-colors text-sm border-b border-gray-100">All Programs &amp; Drives</Link>
                <Link href="/programs/education-support-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Education Support Drive</Link>
                <Link href="/programs/health-support-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Health Support Drive</Link>
                <Link href="/programs/dog-food-donation-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Dog Food Donation Drive</Link>
                <Link href="/programs/celebrations" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Celebrations</Link>
                <Link href="/programs/blanket-donation-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Blanket Donation Drive</Link>
                <Link href="/programs/women-empowerment-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Women Empowerment Drive</Link>
                <Link href="/programs/environment-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Environment Drive</Link>
                <Link href="/programs/help-for-the-blind-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Help for the Blind Drive</Link>
                <Link href="/programs/old-age-support-drive" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Old Age Support Drive</Link>
                <Link href="/programs/food-distribution-outside-the-hospital" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">Food Distribution Outside the Hospital</Link>
              </div>
            </div>
          </div>
          <Link href="/impact" className="hover:text-[#95c718] transition-colors relative group py-2">
            Impact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#95c718] transition-all group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <button className="hover:text-[#95c718] transition-colors flex items-center gap-1 py-4 font-medium cursor-pointer">
              Campaigns <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-white shadow-xl rounded-b-xl border-t-2 border-[#95c718] overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link href="/campaigns" className="px-4 py-2 font-bold text-[#003399] hover:bg-lime-50 transition-colors text-sm border-b border-gray-100">All Campaigns</Link>
                <Link href="/campaigns/child-education" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">C.H.A.H.F @ Child Education</Link>
                <Link href="/campaigns/health-is-wealth" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">C.H.A.H.F @ Health is Wealth</Link>
                <Link href="/campaigns/changes-elder-life" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">C.H.A.H.F @ Changes Elder Life</Link>
                <Link href="/campaigns/hungry-mitao" className="px-4 py-2 hover:bg-lime-50 hover:text-[#003399] transition-colors text-sm">C.H.A.H.F @ Hungry Mitao</Link>
              </div>
            </div>
          </div>
          <Link href="/contact" className="hover:text-[#95c718] transition-colors relative group py-2">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#95c718] transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Action & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 z-50 shrink-0">
          <Link href="/donate" className="relative shrink-0 block" aria-label="Donate Now">
            <img 
              src="/DonateButton.png" 
              alt="Donate Now" 
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain drop-shadow-xs hover:scale-102 transition-transform" 
            />
          </Link>
          
          <button 
            className="lg:hidden p-2 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" 
            onClick={toggleMenu}
            aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer with Accordions */}
        {isMobileMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-md shadow-2xl border-t border-gray-200 lg:hidden flex flex-col py-4 px-4 sm:px-6 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
          >
            <nav className="flex flex-col space-y-1 font-medium text-[#1A1A1A] text-base pb-6">
              <Link 
                href="/" 
                onClick={toggleMenu} 
                className="px-3 py-3 rounded-lg hover:bg-lime-50 hover:text-[#003399] transition-colors border-b border-gray-100 font-semibold flex items-center justify-between"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              
              {/* About Us Accordion */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => toggleSection("about")}
                  className="w-full px-3 py-3 rounded-lg text-left font-semibold flex items-center justify-between hover:bg-lime-50 transition-colors"
                >
                  <span>About Us</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", expandedSection === "about" && "rotate-180")} />
                </button>
                {expandedSection === "about" && (
                  <div className="flex flex-col pl-4 pr-2 pb-2 space-y-1 text-sm bg-slate-50/70 rounded-lg mb-2">
                    <Link href="/about" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399] transition-colors">Who We Are</Link>
                    <Link href="/overteam" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399] transition-colors">Our Trustees and Teams</Link>
                    <Link href="/donar" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399] transition-colors">Our Supporting (Donors)</Link>
                    <Link href="/volunteer" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399] transition-colors">Volunteer</Link>
                  </div>
                )}
              </div>

              {/* Programs Accordion */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => toggleSection("programs")}
                  className="w-full px-3 py-3 rounded-lg text-left font-semibold flex items-center justify-between hover:bg-lime-50 transition-colors"
                >
                  <span>Programs &amp; Drives</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", expandedSection === "programs" && "rotate-180")} />
                </button>
                {expandedSection === "programs" && (
                  <div className="flex flex-col pl-4 pr-2 pb-2 space-y-1 text-sm bg-slate-50/70 rounded-lg mb-2 max-h-60 overflow-y-auto">
                    <Link href="/programs" onClick={toggleMenu} className="px-3 py-2 font-bold text-[#003399]">View All Programs</Link>
                    <Link href="/programs/education-support-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Education Support Drive</Link>
                    <Link href="/programs/health-support-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Health Support Drive</Link>
                    <Link href="/programs/dog-food-donation-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Dog Food Donation Drive</Link>
                    <Link href="/programs/celebrations" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Celebrations</Link>
                    <Link href="/programs/blanket-donation-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Blanket Donation Drive</Link>
                    <Link href="/programs/women-empowerment-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Women Empowerment Drive</Link>
                    <Link href="/programs/environment-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Environment Drive</Link>
                    <Link href="/programs/help-for-the-blind-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Help for the Blind Drive</Link>
                    <Link href="/programs/old-age-support-drive" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Old Age Support Drive</Link>
                    <Link href="/programs/food-distribution-outside-the-hospital" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">Food Distribution</Link>
                  </div>
                )}
              </div>

              <Link 
                href="/impact" 
                onClick={toggleMenu} 
                className="px-3 py-3 rounded-lg hover:bg-lime-50 hover:text-[#003399] transition-colors border-b border-gray-100 font-semibold flex items-center justify-between"
              >
                <span>Impact</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              {/* Campaigns Accordion */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => toggleSection("campaigns")}
                  className="w-full px-3 py-3 rounded-lg text-left font-semibold flex items-center justify-between hover:bg-lime-50 transition-colors"
                >
                  <span>Campaigns</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", expandedSection === "campaigns" && "rotate-180")} />
                </button>
                {expandedSection === "campaigns" && (
                  <div className="flex flex-col pl-4 pr-2 pb-2 space-y-1 text-sm bg-slate-50/70 rounded-lg mb-2">
                    <Link href="/campaigns" onClick={toggleMenu} className="px-3 py-2 font-bold text-[#003399]">All Campaigns</Link>
                    <Link href="/campaigns/child-education" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">C.H.A.H.F @ Child Education</Link>
                    <Link href="/campaigns/health-is-wealth" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">C.H.A.H.F @ Health is Wealth</Link>
                    <Link href="/campaigns/changes-elder-life" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">C.H.A.H.F @ Changes Elder Life</Link>
                    <Link href="/campaigns/hungry-mitao" onClick={toggleMenu} className="px-3 py-2 rounded hover:text-[#003399]">C.H.A.H.F @ Hungry Mitao</Link>
                  </div>
                )}
              </div>

              <Link 
                href="/contact" 
                onClick={toggleMenu} 
                className="px-3 py-3 rounded-lg hover:bg-lime-50 hover:text-[#003399] transition-colors border-b border-gray-100 font-semibold flex items-center justify-between"
              >
                <span>Contact Us</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>

            {/* Quick Action in Mobile Drawer */}
            <div className="pt-2 pb-4">
              <Link
                href="/donate"
                onClick={toggleMenu}
                className="w-full py-3 px-4 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Make a Donation (80G Tax Benefit)</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

