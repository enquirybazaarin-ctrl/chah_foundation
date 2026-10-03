"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 shadow-sm">
      {/* Top Trust Bar - Brand Green */}
      <div className="w-full bg-[#A3E635] py-2 px-4 sm:px-6 lg:px-12 text-[#1A1A1A] font-bold text-[11px] sm:text-xs flex flex-col lg:flex-row items-center justify-between z-50">
        <div className="flex flex-wrap justify-between items-center w-full flex-1 gap-y-2 mb-2 lg:mb-0 lg:mr-12">
          <span className="whitespace-nowrap">Regd:-E-36382</span>
          <span className="whitespace-nowrap">PAN No:- AACTC9927G</span>
          <span className="whitespace-nowrap">80G Number:- AACTC9927GF2022801</span>
          <span className="whitespace-nowrap">Trust no:- AAXCA6387N</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </Link>
          <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2.5 7.1C2 8.7 2 12 2 12s0 3.3.5 4.9a3 3 0 0 0 2 2.1C6.1 19.5 12 19.5 12 19.5s5.9 0 7.5-.5a3 3 0 0 0 2-2.1c.5-1.6.5-4.9.5-4.9s0-3.3-.5-4.9a3 3 0 0 0-2-2.1C17.9 2.5 12 2.5 12 2.5s-5.9 0-7.5.5a3 3 0 0 0-2 2.1z"/><path d="m10 15 5-3-5-3v6z"/></svg>
          </Link>
        </div>
      </div>

      {/* Main Header - Brand Bright Modern */}
      <div className="h-20 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-12 relative">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 py-2 z-50">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0033A0] text-white">
              <span className="font-heading font-bold text-2xl">C</span>
            </div>
            <div className="ml-2 flex flex-col">
              <span className="font-heading text-[#0033A0] text-xl font-bold leading-none tracking-tight">Children's</span>
              <span className="font-heading text-[#0033A0] text-sm font-bold leading-none">Help & Helpage</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 font-medium text-[#1A1A1A]">
          <Link href="/" className="hover:text-[#A3E635] transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A3E635] transition-all group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <button className="hover:text-[#A3E635] transition-colors flex items-center gap-1 py-4">
              About Us <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white shadow-xl rounded-b-lg border-t-2 border-[#A3E635] overflow-hidden">
              <div className="flex flex-col py-2">
                <Link href="/about" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors">Who we are</Link>
                <Link href="/overteam" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors">Our Trustees and Teams</Link>
                <Link href="/donar" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors">Our Supporting (Doners)</Link>
                <Link href="/volunteer" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors">Volunteer</Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="hover:text-[#A3E635] transition-colors flex items-center gap-1 py-4">
              Programs <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white shadow-xl rounded-b-lg border-t-2 border-[#A3E635] overflow-hidden">
              <div className="flex flex-col py-2 max-h-[70vh] overflow-y-auto">
                <Link href="/workdetail/eyJpdiI6Ii9TVmtJcWhVV2VxdzI3SkU2ZG9jWGc9PSIsInZhbHVlIjoiczFNN1hhT1Y1cUNrSnVTd3hzdnRIdz09IiwibWFjIjoiOTBlODBiY2U5YmQ5OTkzNWNhMzgwOTE1NjY2YWUxZjM4ZWY4N2U3ZjQwYWQ5ZjQ3MThjNzNmODk5ZjU3ZmQyNCIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Education Support Drive</Link>
                <Link href="/workdetail/eyJpdiI6IjdENW40QVY2TGRxKzh3QjBJc0xTcnc9PSIsInZhbHVlIjoibEtFZUtPNTAreUd6ZEpvUE0ybjEyZz09IiwibWFjIjoiNGM0MjgxYzcwY2EzNTFmZjMyNTJjYjlmMmY0Y2RjY2VmNWE5OTk4OWY4OWE3OTk3MGJjMWVmMWM5MGY3ZDNlYyIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Health Support Drive</Link>
                <Link href="/workdetail/eyJpdiI6IktieGIxL2JMd08yaFFLMk10RGtKVVE9PSIsInZhbHVlIjoiNnJGa1ViQkprVXRGT1A3QXUzVzI4QT09IiwibWFjIjoiMmU2NTJlMWZlMTY4NTg0Y2ZiYjQzZDg5MDM5NTljMTVhNzY3YWJmM2M4NTUxOTYyYzQ5ODNmMGE2YzcwNzkyNSIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Dog Food Donation Drive</Link>
                <Link href="/workdetail/eyJpdiI6IjNLQVdNSjBoZ3JWVTRjSkpDaC92S3c9PSIsInZhbHVlIjoieHI4V01ybE1XM0dRU2hhbk80c1ZNQT09IiwibWFjIjoiM2NkYzNmZDA2OGYzMzkzNWQ4ZTUwMWQ4NWNmNzljNWE5M2YzN2E1NmM1MjJhN2NjNWUzYWIwNDJiNjY5ZGNiYyIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Celebrations</Link>
                <Link href="/workdetail/eyJpdiI6ImxsM1VuTkF0MXh2c3JFcXhZbjk1ZFE9PSIsInZhbHVlIjoiK3Y2TGw0TlVScjAvMzAvMlFYbisyZz09IiwibWFjIjoiYTkyMzQ1ZDkzMjc2ZmE0MGM1OTA0ZmI4MzgyODNmOWU5M2UzN2EyMGU0ZTEyNDlkZDk1MTJmOGIxNzY0MTU3MSIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Blanket Donation Drive</Link>
                <Link href="/workdetail/eyJpdiI6IlptQzk1Y05KZURGODhDSGxjc2tCQlE9PSIsInZhbHVlIjoiNVFBQ0hGbTEyNGMyZmtMS0RxdU9FZz09IiwibWFjIjoiYzk5MzIwMDFiMmM1NGJjNjcwODAwNDgwYjAzZWI3NjdiMDYxYjgzYmU4MGZlNThhMzgyMTFiNjM2YjRkY2Q5NyIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Women Empowerment Drive</Link>
                <Link href="/workdetail/eyJpdiI6InRvcGsrYnMrVkxvZXVta3k1eFJkY0E9PSIsInZhbHVlIjoiZHVLck1qWFZUdUEzeXk5ejBYMyszUT09IiwibWFjIjoiMWU0ZjVhM2RlMGFmYjA0ZjgwOTM3ZWQyNjdhZjU1NDZjNmU4NDY2NzI0N2NiODczMzE2OWM3MDc4YmYzN2Y0NiIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Environment Drive</Link>
                <Link href="/workdetail/eyJpdiI6ImdxUG12R25BQ3BidG1DTlZoL2h6MEE9PSIsInZhbHVlIjoiNm8zZzRKcndJeE1HTnMyOXlwdC8zdz09IiwibWFjIjoiYTY5MDAwZGViZWI3YzcwN2NlMmI0YjJiYTAwYTkyNDY5YjQwZjkxMmNhZDJiYjg0NWMwZjAzYjQ4NWRlMzdiNCIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Help for the Blind Drive</Link>
                <Link href="/workdetail/eyJpdiI6Imh5dUJ6ZGJQWFhLejQrMnNSbmNWN1E9PSIsInZhbHVlIjoiLzlOaTF1bjQ0NTZKWlQ5Qmt0dGxiQT09IiwibWFjIjoiYTE5NWUxZWQzZGU3ZTJmODI5ZTViOTUyMzE0ODc5MjA2ZDBhMGM5Y2ViYzFjMDUxOGVmNzkwMDk0NWUzMTQ1NSIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Old Age Support Drive</Link>
                <Link href="/workdetail/eyJpdiI6ImJITjZiekp2SVA5WDcyYUhVZ2lZOFE9PSIsInZhbHVlIjoiU1ZRaWcvUW10NHJrQkQ3cTVNbjhyZz09IiwibWFjIjoiN2M0ZWMwMzBlMjFmYTEzNWJhYzg5NGYxODRhOGYyMmEwYTNmZjUwYmQ5NjM1ZThiNjM5NmZkMDYwNGIzYjA4YiIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm">Food Distribution Outside the Hospital</Link>
              </div>
            </div>
          </div>
          <Link href="/impact" className="hover:text-[#A3E635] transition-colors relative group">
            Impact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A3E635] transition-all group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <button className="hover:text-[#A3E635] transition-colors flex items-center gap-1 py-4">
              Campaigns <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white shadow-xl rounded-b-lg border-t-2 border-[#A3E635] overflow-hidden">
              <div className="flex flex-col py-2">
                <Link href="/allcampaign/eyJpdiI6IkY1b2NPL1djM0RTUnNMMXRGTDlwSXc9PSIsInZhbHVlIjoibzhmdlg0RzB3ejR4Q2ZYcFdKd0lYZz09IiwibWFjIjoiZDJmZjA4MGM2NGRkMzBiNzhmYTZjYzlkYWI2ODFkOGRjNDc0ZTFkNjIzYWE1NzcyYzRjOTkxZDMxOTA5MmQ4NyIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm whitespace-normal">C.H.A.H.F @ child education</Link>
                <Link href="/allcampaign/eyJpdiI6InFhblhjS3hna3JxTGgrYVRaanVUTGc9PSIsInZhbHVlIjoiUXV5dnVRRmZtejEyZ3p5TGx5NTlxdz09IiwibWFjIjoiNWFiYzNjNDUxOTE3ZGExYjFhYzAxZWEyYmVkYWE2OWZlZmZiNDBjNTk3MmUwZWY2NmY1ZGVjYzQwNDEzZjNlZSIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm whitespace-normal">C.H.A.H.F @ Health is wealth</Link>
                <Link href="/campaign/eyJpdiI6IkIyZ21vOEFHRS9oeHNDNmwwYkF5aHc9PSIsInZhbHVlIjoiMTBpTklCYlc1SVRYbldCaDVFQ0NzUT09IiwibWFjIjoiODI2NWM4MWUxNjk1YmE4NmEzMzYwYTRiZmM3YWZhMjI2MmIzNWFlOTQ3MzM0ZGIxNjRjYmVlZDE3OWU4ZjdmYSIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm whitespace-normal">C.H.A.H.F @ Changes Elder life</Link>
                <Link href="/campaign/eyJpdiI6IndUS29uU3c2UFVzOHUxa2taODhXU0E9PSIsInZhbHVlIjoid2traXFrMHBOQWc3eFRVZkhYdFBLZz09IiwibWFjIjoiZTAzNjU5Y2YxMTk3YTVmMjY4YzU3MjQ5YjYyOWNlZWIxNjE2YWE0OWRiZGEzNTQyZDRiYTY2ODlhNDFmNzJhNyIsInRhZyI6IiJ9" className="px-4 py-2 hover:bg-gray-50 hover:text-[#A3E635] transition-colors text-sm whitespace-normal">C.H.A.H.F @ Hungry mitao</Link>
              </div>
            </div>
          </div>
          <Link href="/contact" className="hover:text-[#A3E635] transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A3E635] transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Action & Mobile Toggle */}
        <div className="flex items-center space-x-4 z-50">
          <Link 
            href="/donate" 
            className="hidden sm:flex items-center justify-center bg-[#A3E635] text-white font-semibold px-6 py-2.5 rounded hover:bg-[#86c822] transition-colors shadow-sm whitespace-nowrap btn-wave"
          >
            DONATE NOW &rarr;
          </Link>
          
          <button 
            className="lg:hidden p-2 text-[#1A1A1A]" 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 lg:hidden flex flex-col py-4 px-6 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-4 font-medium text-[#1A1A1A] text-lg mb-8 max-h-[60vh] overflow-y-auto pr-2">
              <Link href="/" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors py-2 border-b border-gray-100">Home</Link>
              
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="text-[#1A1A1A] font-semibold mb-2">About Us</span>
                <div className="flex flex-col pl-4 space-y-3 text-base">
                  <Link href="/about" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Who we are</Link>
                  <Link href="/overteam" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Our Trustees and Teams</Link>
                  <Link href="/donar" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Our Supporting (Doners)</Link>
                  <Link href="/volunteer" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Volunteer</Link>
                </div>
              </div>

              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="text-[#1A1A1A] font-semibold mb-2">Programs</span>
                <div className="flex flex-col pl-4 space-y-3 text-base">
                  <Link href="/workdetail/eyJpdiI6Ii9TVmtJcWhVV2VxdzI3SkU2ZG9jWGc9PSIsInZhbHVlIjoiczFNN1hhT1Y1cUNrSnVTd3hzdnRIdz09IiwibWFjIjoiOTBlODBiY2U5YmQ5OTkzNWNhMzgwOTE1NjY2YWUxZjM4ZWY4N2U3ZjQwYWQ5ZjQ3MThjNzNmODk5ZjU3ZmQyNCIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Education Support Drive</Link>
                  <Link href="/workdetail/eyJpdiI6IjdENW40QVY2TGRxKzh3QjBJc0xTcnc9PSIsInZhbHVlIjoibEtFZUtPNTAreUd6ZEpvUE0ybjEyZz09IiwibWFjIjoiNGM0MjgxYzcwY2EzNTFmZjMyNTJjYjlmMmY0Y2RjY2VmNWE5OTk4OWY4OWE3OTk3MGJjMWVmMWM5MGY3ZDNlYyIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Health Support Drive</Link>
                  <Link href="/workdetail/eyJpdiI6IktieGIxL2JMd08yaFFLMk10RGtKVVE9PSIsInZhbHVlIjoiNnJGa1ViQkprVXRGT1A3QXUzVzI4QT09IiwibWFjIjoiMmU2NTJlMWZlMTY4NTg0Y2ZiYjQzZDg5MDM5NTljMTVhNzY3YWJmM2M4NTUxOTYyYzQ5ODNmMGE2YzcwNzkyNSIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Dog Food Donation Drive</Link>
                  <Link href="/workdetail/eyJpdiI6IjNLQVdNSjBoZ3JWVTRjSkpDaC92S3c9PSIsInZhbHVlIjoieHI4V01ybE1XM0dRU2hhbk80c1ZNQT09IiwibWFjIjoiM2NkYzNmZDA2OGYzMzkzNWQ4ZTUwMWQ4NWNmNzljNWE5M2YzN2E1NmM1MjJhN2NjNWUzYWIwNDJiNjY5ZGNiYyIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Celebrations</Link>
                  <Link href="/workdetail/eyJpdiI6ImxsM1VuTkF0MXh2c3JFcXhZbjk1ZFE9PSIsInZhbHVlIjoiK3Y2TGw0TlVScjAvMzAvMlFYbisyZz09IiwibWFjIjoiYTkyMzQ1ZDkzMjc2ZmE0MGM1OTA0ZmI4MzgyODNmOWU5M2UzN2EyMGU0ZTEyNDlkZDk1MTJmOGIxNzY0MTU3MSIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Blanket Donation Drive</Link>
                  <Link href="/workdetail/eyJpdiI6IlptQzk1Y05KZURGODhDSGxjc2tCQlE9PSIsInZhbHVlIjoiNVFBQ0hGbTEyNGMyZmtMS0RxdU9FZz09IiwibWFjIjoiYzk5MzIwMDFiMmM1NGJjNjcwODAwNDgwYjAzZWI3NjdiMDYxYjgzYmU4MGZlNThhMzgyMTFiNjM2YjRkY2Q5NyIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Women Empowerment Drive</Link>
                  <Link href="/workdetail/eyJpdiI6InRvcGsrYnMrVkxvZXVta3k1eFJkY0E9PSIsInZhbHVlIjoiZHVLck1qWFZUdUEzeXk5ejBYMyszUT09IiwibWFjIjoiMWU0ZjVhM2RlMGFmYjA0ZjgwOTM3ZWQyNjdhZjU1NDZjNmU4NDY2NzI0N2NiODczMzE2OWM3MDc4YmYzN2Y0NiIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Environment Drive</Link>
                  <Link href="/workdetail/eyJpdiI6ImdxUG12R25BQ3BidG1DTlZoL2h6MEE9PSIsInZhbHVlIjoiNm8zZzRKcndJeE1HTnMyOXlwdC8zdz09IiwibWFjIjoiYTY5MDAwZGViZWI3YzcwN2NlMmI0YjJiYTAwYTkyNDY5YjQwZjkxMmNhZDJiYjg0NWMwZjAzYjQ4NWRlMzdiNCIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Help for the Blind Drive</Link>
                  <Link href="/workdetail/eyJpdiI6Imh5dUJ6ZGJQWFhLejQrMnNSbmNWN1E9PSIsInZhbHVlIjoiLzlOaTF1bjQ0NTZKWlQ5Qmt0dGxiQT09IiwibWFjIjoiYTE5NWUxZWQzZGU3ZTJmODI5ZTViOTUyMzE0ODc5MjA2ZDBhMGM5Y2ViYzFjMDUxOGVmNzkwMDk0NWUzMTQ1NSIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Old Age Support Drive</Link>
                  <Link href="/workdetail/eyJpdiI6ImJITjZiekp2SVA5WDcyYUhVZ2lZOFE9PSIsInZhbHVlIjoiU1ZRaWcvUW10NHJrQkQ3cTVNbjhyZz09IiwibWFjIjoiN2M0ZWMwMzBlMjFmYTEzNWJhYzg5NGYxODRhOGYyMmEwYTNmZjUwYmQ5NjM1ZThiNjM5NmZkMDYwNGIzYjA4YiIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">Food Distribution Outside the Hospital</Link>
                </div>
              </div>
              <Link href="/impact" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors py-2 border-b border-gray-100">Impact</Link>
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="text-[#1A1A1A] font-semibold mb-2">Campaigns</span>
                <div className="flex flex-col pl-4 space-y-3 text-base">
                  <Link href="/allcampaign/eyJpdiI6IkY1b2NPL1djM0RTUnNMMXRGTDlwSXc9PSIsInZhbHVlIjoibzhmdlg0RzB3ejR4Q2ZYcFdKd0lYZz09IiwibWFjIjoiZDJmZjA4MGM2NGRkMzBiNzhmYTZjYzlkYWI2ODFkOGRjNDc0ZTFkNjIzYWE1NzcyYzRjOTkxZDMxOTA5MmQ4NyIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">C.H.A.H.F @ child education</Link>
                  <Link href="/allcampaign/eyJpdiI6InFhblhjS3hna3JxTGgrYVRaanVUTGc9PSIsInZhbHVlIjoiUXV5dnVRRmZtejEyZ3p5TGx5NTlxdz09IiwibWFjIjoiNWFiYzNjNDUxOTE3ZGExYjFhYzAxZWEyYmVkYWE2OWZlZmZiNDBjNTk3MmUwZWY2NmY1ZGVjYzQwNDEzZjNlZSIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">C.H.A.H.F @ Health is wealth</Link>
                  <Link href="/campaign/eyJpdiI6IkIyZ21vOEFHRS9oeHNDNmwwYkF5aHc9PSIsInZhbHVlIjoiMTBpTklCYlc1SVRYbldCaDVFQ0NzUT09IiwibWFjIjoiODI2NWM4MWUxNjk1YmE4NmEzMzYwYTRiZmM3YWZhMjI2MmIzNWFlOTQ3MzM0ZGIxNjRjYmVlZDE3OWU4ZjdmYSIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">C.H.A.H.F @ Changes Elder life</Link>
                  <Link href="/campaign/eyJpdiI6IndUS29uU3c2UFVzOHUxa2taODhXU0E9PSIsInZhbHVlIjoid2traXFrMHBOQWc3eFRVZkhYdFBLZz09IiwibWFjIjoiZTAzNjU5Y2YxMTk3YTVmMjY4YzU3MjQ5YjYyOWNlZWIxNjE2YWE0OWRiZGEzNTQyZDRiYTY2ODlhNDFmNzJhNyIsInRhZyI6IiJ9" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors">C.H.A.H.F @ Hungry mitao</Link>
                </div>
              </div>
              <Link href="/contact" onClick={toggleMenu} className="hover:text-[#A3E635] transition-colors py-2 border-b border-gray-100">Contact</Link>
            </nav>
            <Link 
              href="/donate" 
              onClick={toggleMenu}
              className="flex items-center justify-center bg-[#A3E635] text-white font-semibold px-6 py-4 rounded hover:bg-[#86c822] transition-colors shadow-sm w-full text-center btn-wave"
            >
              DONATE NOW &rarr;
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
