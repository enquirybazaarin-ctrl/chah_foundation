"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
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
      setErrorMessage("Please enter your email ID.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(trimmed);
      setSuccessMessage("Thank you for subscribing to latest updates!");
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
      {/* Footer Top Promotional Banner */}
      <div className="w-full relative overflow-hidden bg-white border-t border-gray-100">
        <img
          src="/footerimg.png"
          alt="Join Us To Make Transform In India - CHAH Foundation"
          className="w-full h-auto object-cover max-h-[520px] mx-auto block"
          loading="lazy"
        />
      </div>

      {/* Main Footer in Deep Black with Vibrant Lime Accent Top Line */}
      <footer className="w-full bg-black text-white relative border-t-[3px] border-[#84cc16]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          
          {/* Main 4-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Column 1: Brand & Logo (md:col-span-4) */}
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="inline-block group">
                <img
                  src="/mainlogo.webp"
                  alt="Children's help & helpage Foundation"
                  className="h-16 md:h-20 w-auto object-contain"
                />
                <p className="text-sm text-neutral-300 font-medium mt-3 tracking-wide">
                  Children&apos;s help and helpage Foundation
                </p>
              </Link>
            </div>

            {/* Column 2: Navigation Links (md:col-span-2) */}
            <div className="md:col-span-2">
              <ul className="space-y-3 text-sm text-neutral-300 font-normal">
                <li>
                  <Link href="/" className="hover:text-lime-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-lime-400 transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/overteam" className="hover:text-lime-400 transition-colors">
                    Our Trustees &amp; Teams
                  </Link>
                </li>
                <li>
                  <Link href="/donar" className="hover:text-lime-400 transition-colors">
                    Our Supporting (Donors)
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="hover:text-lime-400 transition-colors">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-lime-400 transition-colors">
                    Programs &amp; Drives
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-lime-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-lime-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-lime-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Social Links (md:col-span-2) */}
            <div className="md:col-span-2">
              <ul className="space-y-3 text-sm text-neutral-300 font-normal">
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    You tube
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Whatsapp
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription (md:col-span-4) */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
                Subscribe to get latest updates
              </h3>

              <form onSubmit={handleSubscribe} className="space-y-2" noValidate>
                <div className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-md border border-neutral-700 bg-black shadow-inner">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Please Enter Your Email Id"
                    className="w-full px-4 py-3 bg-black text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#1565c0] hover:bg-[#0d47a1] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </div>

                {/* Real-time Status Messages */}
                {successMessage && (
                  <p className="text-xs text-lime-400 flex items-center gap-1.5 mt-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </p>
                )}
                {errorMessage && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* Divider Line */}
          <div className="border-t border-neutral-800 my-8 sm:my-10" />

          {/* Bottom Copyright & Credit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <p className="text-center sm:text-left">
              Copyright © 2026 Children&apos;s help and helpage Foundation. All Rights Reserved.
            </p>
            <p className="text-center sm:text-right">
              Design & Developed by:{" "}
              <a
                href="https://digitalhubplus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-lime-400 transition-colors underline-offset-2 hover:underline"
              >
                Digital Hub Plus
              </a>
            </p>
          </div>

        </div>
      </footer>

      {/* Floating Action Badges (WhatsApp & 50% Tax Save Badge) */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-3 pointer-events-none">
        
        {/* Floating Tax Exemption 50% Badge */}
        <Link
          href="/donate"
          aria-label="Tax Save up to 50% on donations"
          className="pointer-events-auto group px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white border border-blue-400/40 shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-1.5 sm:gap-2"
        >
          <div className="flex flex-col text-right leading-tight">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-200">
              TAX SAVE
            </span>
            <span className="text-[11px] sm:text-xs font-black text-lime-400">
              50% UP TO
            </span>
          </div>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-lime-400 animate-pulse" />
        </Link>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/919004004534"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 group"
        >
          {/* WhatsApp SVG Icon */}
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
