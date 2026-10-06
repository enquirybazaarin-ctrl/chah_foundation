import Link from "next/link";
import { ArrowRight, GraduationCap, HeartPulse, BookOpen, PawPrint } from "lucide-react";

export function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-[#fafafa] overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Collage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-[#53b34b]"></div>
              <span className="text-[#53b34b] font-medium text-[13px] tracking-[0.15em] uppercase">What We Do</span>
            </div>
            <h2 className="text-[38px] md:text-[46px] lg:text-[54px] font-bold text-[#0033A0] mb-6 leading-[1.15] tracking-tight">
              Supporting <span className="text-[#53b34b]">Citizens in Need:</span> Our National Commitment
            </h2>
            <p className="text-[#666666] text-[16px] leading-[1.8]">
              We strive to do good for all, addressing the diverse needs of people, fostering positive change and lasting impact.
            </p>
          </div>

          <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            {/* Organic Background Blob */}
            <div className="absolute inset-4 bg-[#eef5e5] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transform rotate-12 -z-10" />
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffc107] rounded-full blur-[60px] opacity-20 -z-10" />

            {/* Collage Circles */}
            <div className="relative w-full h-full max-w-md mx-auto">
              {/* Main large circle (Kids) */}
              <div 
                className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full border-4 border-white shadow-xl overflow-hidden z-20"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              {/* Top right circle (Doctor) */}
              <div 
                className="absolute top-0 right-0 w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden z-30"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              {/* Bottom right circle (Distribution) */}
              <div 
                className="absolute top-[40%] right-[5%] w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden z-10"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=400&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              {/* Bottom left circle (Dog) */}
              <div 
                className="absolute bottom-[5%] left-[25%] w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden z-30"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />

              {/* Handwritten text */}
              <div className="absolute bottom-[-10%] right-[-10%] text-[#0033A0] font-medium text-lg rotate-[-10deg] leading-tight" style={{ fontFamily: 'cursive' }}>
                People<br/>Communities<br/>A Brighter Tomorrow
              </div>

              {/* Decorative elements */}
              <svg className="absolute top-[15%] -left-8 w-10 h-10 text-[#ffc107] z-0" fill="none" viewBox="0 0 100 100">
                <path d="M40,50 L10,70 M50,40 L30,20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <svg className="absolute top-10 -right-12 w-8 h-8 text-[#53b34b] z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          
          {/* Card 1: Blue */}
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div 
              className="w-full sm:w-1/2 h-56 sm:h-auto rounded-3xl overflow-hidden shadow-sm flex-shrink-0"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="w-full sm:w-1/2 bg-[#f0f5fa] rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-full bg-[#1e88e5] text-white flex items-center justify-center mb-4 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0033A0] mb-3 leading-tight">Nourish, Warm, Provide Essentials</h3>
              <p className="text-[14px] text-[#555] mb-6 leading-relaxed">
                We are dedicated to assisting those in need. Our mission involves providing essential food, blankets, and groceries to vulnerable communities.
              </p>
              <Link href="/about" className="text-[#1e88e5] font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Pink */}
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div 
              className="w-full sm:w-1/2 h-56 sm:h-auto rounded-3xl overflow-hidden shadow-sm flex-shrink-0"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="w-full sm:w-1/2 bg-[#fdf2f4] rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-full bg-[#e91e63] text-white flex items-center justify-center mb-4 shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0033A0] mb-3 leading-tight">Health Oasis for All</h3>
              <p className="text-[14px] text-[#555] mb-6 leading-relaxed">
                At ChahFoundation we initiate positive change by providing crucial medical support, conducting health camps, and promoting blood donation.
              </p>
              <Link href="/about" className="text-[#e91e63] font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Yellow */}
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div 
              className="w-full sm:w-1/2 h-56 sm:h-auto rounded-3xl overflow-hidden shadow-sm flex-shrink-0"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="w-full sm:w-1/2 bg-[#fffbf0] rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-full bg-[#ff9800] text-white flex items-center justify-center mb-4 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0033A0] mb-3 leading-tight">Kids First: Education, Sanitation, Water</h3>
              <p className="text-[14px] text-[#555] mb-6 leading-relaxed">
                At ChahFoundation, we provide essential support for child education, clean water access, sanitation, and hygiene improvement initiatives.
              </p>
              <Link href="/about" className="text-[#ff9800] font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Green */}
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div 
              className="w-full sm:w-1/2 h-56 sm:h-auto rounded-3xl overflow-hidden shadow-sm flex-shrink-0"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="w-full sm:w-1/2 bg-[#f0f9f3] rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-full bg-[#4caf50] text-white flex items-center justify-center mb-4 shadow-sm">
                <PawPrint className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0033A0] mb-3 leading-tight">Heartfelt Rescue: Lifeline</h3>
              <p className="text-[14px] text-[#555] mb-6 leading-relaxed">
                We provide compassionate care, essential support, and medical treatment for animals in need, ensuring their well-being.
              </p>
              <Link href="/about" className="text-[#4caf50] font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Know More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="w-full bg-[#f4f9ef] rounded-[2.5rem] p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-sm">
          {/* Decorative swoosh bg */}
          <div className="absolute top-0 right-0 w-[60%] h-full opacity-30 -z-10" 
               style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="%2384c441" d="M30,100 C60,60 40,20 100,0 L100,100 Z" /></svg>')`, backgroundSize: 'cover', backgroundPosition: 'right' }} 
          />

          <div className="max-w-xl z-10">
            <span className="text-[#53b34b] font-medium text-[13px] tracking-[0.15em] uppercase mb-4 block">Be a part of the change</span>
            <h2 className="text-[32px] lg:text-[40px] font-bold text-[#0033A0] mb-5 leading-[1.15]">
              Together, We Can<br/>Build a Brighter Tomorrow
            </h2>
            <p className="text-[#555] text-[15px] mb-8 leading-[1.7]">
              Your support helps us continue our initiatives in education, healthcare, essential support and animal care, creating lasting impact in the lives of those who need it most.
            </p>
            <Link 
              href="/donate" 
              className="inline-flex items-center gap-2 bg-[#005e2d] text-white font-medium text-[15px] px-8 py-3.5 rounded-full hover:bg-[#004722] transition-colors shadow-lg"
            >
              Support Our Work <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative w-full lg:w-auto flex-shrink-0 z-10 flex justify-center">
            {/* Image mask */}
            <div className="w-72 h-64 lg:w-96 lg:h-80 rounded-[40px_100px_40px_100px] overflow-hidden border-8 border-white shadow-xl relative z-10">
              <div 
                className="w-full h-full"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </div>
            
            {/* Yellow Sticker */}
            <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 w-36 h-36 bg-[#ffc107] rounded-full flex items-center justify-center shadow-lg rotate-[-10deg] z-20">
              <div className="text-[#0033A0] text-center font-bold text-[17px] leading-tight px-4" style={{ fontFamily: 'cursive' }}>
                Real People<br/>Real Support<br/>Real Change
              </div>
            </div>

            {/* Heart */}
            <svg className="absolute bottom-10 -right-16 w-8 h-8 text-[#53b34b] z-0 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
