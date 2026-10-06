import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function KnowAboutUs() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl z-10 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
                  Know About Us
                </span>
              </span>
            </div>
            
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight mb-6">
              We provide a place for{" "}
              <span className="text-lime-500 relative inline-block whitespace-nowrap">
                children
                {/* Yellow underline svg */}
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round"/>
                </svg>
              </span>{" "}
              with special needs
            </h2>
            
            <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed font-medium">
              Children's Help and Helpage Foundation stands as a prominent NGO committed to reshaping the destinies of underprivileged children.
            </p>
            
            <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
              Discover the profound impact of our initiatives spanning education, healthcare, and empowerment, as we tirelessly work towards creating a brighter future for those in need. Your generous donation has the power to catalyze lasting change, enabling us to continue our mission and uplift vulnerable lives. Join us in making a difference today, as your support contributes to a world where every child has access to education, quality healthcare, and the tools needed for a self-reliant and empowered future. Together, we can transform lives and build a better tomorrow.
            </p>
            
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-8 py-3.5 text-sm font-bold text-gray-950 shadow-sm hover:bg-lime-500 transition-colors"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            {/* Decorative Swoosh near button (bottom left) */}
            <svg className="absolute -bottom-14 left-40 w-28 h-14 text-lime-100" fill="none" viewBox="0 0 100 50">
              <path d="M10,40 C 30,10 50,40 70,20 C 80,10 90,20 90,30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          
          {/* Right Image/Graphic */}
          <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center mt-6 lg:mt-0">
            {/* Background Blob 1 (Light Green) */}
            <div className="absolute inset-0 bg-[#eef5e5] rounded-[63%_37%_33%_67%/43%_28%_72%_57%] transform rotate-12 scale-105 -z-10" />
            
            {/* Background Blob 2 (Light Yellow) */}
            <div className="absolute inset-4 bg-[#fdf8e7] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transform -rotate-12 scale-100 -z-10" />
            
            {/* Main Image with Blob Mask */}
            <div className="relative z-10 w-full h-full max-w-[88%] max-h-[88%]">
              <div 
                className="w-full h-full bg-gray-200 overflow-hidden shadow-xl"
                style={{
                  borderRadius: '53% 47% 43% 57% / 43% 41% 59% 57%',
                  backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
            
            {/* Floating Decorative Elements */}
            {/* Heart */}
            <svg className="absolute top-6 right-6 lg:right-0 w-8 h-8 text-[#84c441] rotate-12 z-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            
            {/* Top Left Yellow Streaks */}
            <svg className="absolute top-12 left-10 lg:-left-2 w-10 h-10 text-[#ffc107] z-20" fill="none" viewBox="0 0 100 100">
              <path d="M30,50 L10,30 M45,40 L40,10 M60,50 L80,20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
            
            {/* Bottom Left Yellow Streaks */}
            <svg className="absolute bottom-16 left-8 lg:left-0 w-10 h-10 text-[#ffc107] z-20" fill="none" viewBox="0 0 100 100">
              <path d="M40,50 L10,70 M50,40 L30,20 M60,60 L70,90" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
            
            {/* Bottom Right Yellow Curve */}
            <svg className="absolute bottom-8 right-12 lg:right-8 w-14 h-8 text-[#ffc107] z-20" fill="none" viewBox="0 0 100 50">
              <path d="M10,40 Q40,10 90,30" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
