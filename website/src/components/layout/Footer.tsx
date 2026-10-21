"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { 
  Loader2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  HeartHandshake, 
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(trimmed);
      setSuccessMessage("Thank you for subscribing to CHAH Foundation updates!");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to subscribe. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-auto">
      {/* ─── 1. TOP PROMOTIONAL BANNER (NATURAL RATIO & ZERO CROPPING) ─── */}
      <div className="w-full relative bg-white border-t border-gray-100">
        <img
          src="/footerimg.png"
          alt="Join Us To Make Transform In India - CHAH Foundation"
          className="w-full h-auto block max-w-[2048px] mx-auto"
          loading="lazy"
        />
      </div>

      {/* ─── 2. CREDIBILITY & TRUST HIGHLIGHT BAR ─── */}
      <div className="w-full bg-[#0d1627] text-white border-t-2 border-[#95c718] border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#95c718]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 text-[#95c718] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">80G Tax Exemption</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  50% tax deduction on all donations under Section 80G with instant receipt.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#95c718]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">100% Transparency</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Zero platform fees. Direct vendor &amp; hospital settlement with verified bills.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#95c718]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 text-[#95c718] flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Govt. Registered NGO</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Regd: E-36382 • PAN: AACTC9927G • 80G No: AACTC9927GF2022801
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#95c718]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Donor Helpline</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Call or WhatsApp: <strong className="text-white font-semibold">+91 90040 04534</strong> for quick support.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── 3. MAIN FOOTER CONTENT ─── */}
      <footer className="w-full bg-[#080d19] text-slate-300 relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Column 1: Brand, About & Direct Contact (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block group">
                <img
                  src="/mainlogo.webp"
                  alt="Children's help and helpage Foundation"
                  className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-102"
                />
                <p className="text-xs sm:text-sm text-lime-400 font-semibold mt-2 tracking-wide uppercase">
                  Children&apos;s Help &amp; Helpage Foundation
                </p>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                A registered non-profit organization dedicated to urgent medical care for critical children, dignified elderly welfare, hunger eradication, and primary education for underprivileged families across India.
              </p>

              {/* Trust Accreditation Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/5 border border-white/10 text-slate-300">
                  Regd: E-36382
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-lime-400/10 border border-lime-400/30 text-lime-400">
                  80G Certified
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-400/10 border border-blue-400/30 text-blue-300">
                  CSR-1 Approved
                </span>
              </div>

              {/* Contact Information List */}
              <div className="pt-2 space-y-3 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80">
                <a 
                  href="tel:+919004004534" 
                  className="flex items-center gap-3 hover:text-lime-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#95c718] group-hover:bg-[#95c718] group-hover:text-slate-950 transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91 90040 04534 / +91 98765 43210</span>
                </a>

                <a 
                  href="mailto:info@chahfoundation.org" 
                  className="flex items-center gap-3 hover:text-lime-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#95c718] group-hover:bg-[#95c718] group-hover:text-slate-950 transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info@chahfoundation.org</span>
                </a>

                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#95c718] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Mumbai, Maharashtra • Operating Nationwide</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Quick Links</span>
                <span className="w-8 h-0.5 bg-[#95c718] rounded-full inline-block" />
              </h3>

              <ul className="space-y-2.5 text-sm font-normal">
                <li>
                  <Link href="/" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/overteam" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Our Trustees &amp; Team
                  </Link>
                </li>
                <li>
                  <Link href="/donar" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Supporting Donors
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Programs &amp; Drives
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Volunteer With Us
                  </Link>
                </li>
                <li>
                  <Link href="/partner-with-us" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Partner With Us (CSR)
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Causes & Campaigns (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Focus Areas</span>
                <span className="w-8 h-0.5 bg-[#95c718] rounded-full inline-block" />
              </h3>

              <ul className="space-y-2.5 text-sm font-normal">
                <li>
                  <Link href="/campaigns/health-is-wealth" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Child Surgeries &amp; Healthcare
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns/child-education" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Child Education &amp; School Kits
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns/changes-elder-life" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Elderly Support &amp; Shelter
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns/hungry-mitao" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Hungry Mitao (Nutrition Drives)
                  </Link>
                </li>
                <li>
                  <Link href="/programs/food-distribution-outside-the-hospital" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Hospital Food Distribution
                  </Link>
                </li>
                <li>
                  <Link href="/programs/blanket-donation-drive" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Winter Blanket Donation
                  </Link>
                </li>
                <li>
                  <Link href="/programs/women-empowerment-drive" className="hover:text-lime-400 hover:translate-x-1 inline-block transition-all">
                    Women Empowerment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Social Connectivity (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Stay Connected</span>
                <span className="w-8 h-0.5 bg-[#95c718] rounded-full inline-block" />
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                Subscribe to get verified impact stories, audited relief work updates, and transparent fund utilization reports.
              </p>

              {/* Newsletter Input Form */}
              <form onSubmit={handleSubscribe} className="space-y-2.5" noValidate>
                <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl overflow-hidden border border-slate-700 bg-white/5 focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20 transition-all shadow-inner">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email ID"
                    className="w-full px-4 py-3 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 bg-[#95c718] hover:bg-[#84b514] text-slate-950 text-sm font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {successMessage && (
                  <p className="text-xs text-lime-400 flex items-center gap-1.5 font-medium pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </p>
                )}
                {errorMessage && (
                  <p className="text-xs text-rose-400 font-medium pt-1">
                    {errorMessage}
                  </p>
                )}
              </form>

              {/* Social Channels Icons Strip */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Follow Our Social Work
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow CHAH Foundation on Facebook"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 hover:border-transparent hover:scale-110 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow CHAH Foundation on Instagram"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 hover:border-transparent hover:scale-110 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to CHAH Foundation YouTube"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 hover:border-transparent hover:scale-110 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919004004534"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with CHAH Foundation on WhatsApp"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#25D366] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 hover:border-transparent hover:scale-110 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ─── 4. LEGAL & COMPLIANCE SECONDARY BAR ─── */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/privacy" className="hover:text-lime-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-lime-400 transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link href="/contact" className="hover:text-lime-400 transition-colors">
                Refund &amp; Cancellation Policy
              </Link>
              <Link href="/donar" className="hover:text-lime-400 transition-colors">
                Donor Rights &amp; Code of Ethics
              </Link>
            </div>

            <div className="text-slate-400 font-medium">
              Registered Non-Profit Trust • Form 10BE &amp; 80G Certified
            </div>
          </div>

          {/* ─── 5. FINAL COPYRIGHT & CREDIT STRIP ─── */}
          <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p className="text-center sm:text-left">
              Copyright &copy; 2026 Children&apos;s Help &amp; Helpage Foundation (CHAH). All Rights Reserved.
            </p>
            <p className="text-center sm:text-right">
              Crafted with care by{" "}
              <a
                href="https://digitalhubplus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 font-medium hover:text-lime-400 transition-colors underline-offset-2 hover:underline"
              >
                Digital Hub Plus
              </a>
            </p>
          </div>

        </div>
      </footer>

      {/* ─── 6. FLOATING ACTION BADGES (WHATSAPP & 50% TAX SAVE) ─── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-3 pointer-events-none">
        
        {/* Floating Tax Exemption 50% Badge */}
        <Link
          href="/donate"
          aria-label="Tax Save up to 50% on donations"
          className="pointer-events-auto group px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-slate-900 via-[#003399] to-blue-900 text-white border border-blue-400/40 shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <div className="flex flex-col text-right leading-tight">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-200">
              TAX BENEFIT
            </span>
            <span className="text-[11px] sm:text-xs font-black text-lime-400">
              SAVE 50% (80G)
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
        </Link>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/919004004534"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200 group"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

      </div>
    </div>
  );
}
