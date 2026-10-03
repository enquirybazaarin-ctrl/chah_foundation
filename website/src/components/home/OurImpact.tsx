import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // or "cn"
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

export function OurImpact() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A3E635]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block font-semibold text-[#A3E635] tracking-widest text-sm uppercase mb-4">
            Our Impact
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
            Creating Change Where It Matters Most
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
            For children who need a chance, families facing difficult times, and communities with limited access to essential care — CHAH Foundation works where help is needed most.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            From education and nutrition to healthcare and women empowerment, we work to create practical support, dignity and opportunity for people and communities who need it most.
          </p>
        </div>

        {/* Impact Statistics - Editorial Style */}
        <div className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 border-t border-b border-gray-100 py-12">
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-heading text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
                24.5M<span className="text-[#A3E635]">+</span>
              </span>
              <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                Meals Served
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-gray-100 md:pl-8">
              <span className="font-heading text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
                6.9M<span className="text-[#A3E635]">+</span>
              </span>
              <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                People Reached
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-gray-100 md:pl-8">
              <span className="font-heading text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
                172<span className="text-[#A3E635]">+</span>
              </span>
              <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                Schools & Communities
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-gray-100 md:pl-8">
              <span className="font-heading text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
                31<span className="text-[#A3E635]">+</span>
              </span>
              <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                Healthcare Institutions
              </span>
            </div>

          </div>
          <div className="text-right mt-4">
            <p className="text-xs text-gray-400 font-medium">Impact updated: 03 October 2026</p>
          </div>
        </div>

        {/* CHAH Impact Pillars */}
        <div className="mb-20">
          <h3 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-12 text-center uppercase tracking-wider border-b border-gray-100 pb-4 max-w-max mx-auto">
            Where Your Support Creates Change
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Pillar 1 */}
            <div className="flex flex-col group">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-[#A3E635]/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" alt="Children" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#A3E635] font-bold text-sm">01</span>
                <h4 className="font-heading text-2xl font-bold text-[#1A1A1A]">Children</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Supporting children with education, nutrition, healthcare and opportunities for a better future.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col group">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-[#A3E635]/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2069&auto=format&fit=crop" alt="Healthcare" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#A3E635] font-bold text-sm">02</span>
                <h4 className="font-heading text-2xl font-bold text-[#1A1A1A]">Healthcare</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Helping communities access medical support, health awareness, check-ups, medicines and critical care.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col group">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-[#A3E635]/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop" alt="Education" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#A3E635] font-bold text-sm">03</span>
                <h4 className="font-heading text-2xl font-bold text-[#1A1A1A]">Education</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Creating opportunities for children and underserved communities through access to education and learning support.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col group lg:col-start-1 lg:ml-auto w-full lg:max-w-md">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-[#A3E635]/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop" alt="Nutrition" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#A3E635] font-bold text-sm">04</span>
                <h4 className="font-heading text-2xl font-bold text-[#1A1A1A]">Nutrition</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Providing nutritious meals and food support to people and communities facing difficult circumstances.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="flex flex-col group lg:mr-auto w-full lg:max-w-md">
              <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-[#A3E635]/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                <img src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=2069&auto=format&fit=crop" alt="Women Empowerment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#A3E635] font-bold text-sm">05</span>
                <h4 className="font-heading text-2xl font-bold text-[#1A1A1A]">Women Empowerment</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Supporting women through awareness, health, hygiene, safety and opportunities for greater independence.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 border-t border-gray-100">
          <Link 
            href="/donate" 
            // @ts-ignore
            className={cn(buttonVariants({ size: "lg" }), "bg-[#A3E635] hover:bg-[#86c822] text-[#1A1A1A] font-bold w-full sm:w-auto text-base h-14 px-10 rounded-full shadow-lg hover:-translate-y-0.5 transition-all btn-wave border-none")}
          >
            <Heart className="mr-2 h-5 w-5 fill-current" />
            Be Part of the Change
          </Link>
          <Link 
            href="/campaigns" 
            // @ts-ignore
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto text-base h-14 px-10 rounded-full border-gray-200 text-[#1A1A1A] hover:bg-gray-50 transition-all")}
          >
            Explore Our Work
            <ArrowRight className="ml-2 h-5 w-5 text-[#A3E635]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
