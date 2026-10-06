import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { AnimatedCounter } from "./AnimatedCounter";
import { Utensils, Users, School, Hospital, Heart, Shield, Activity, GraduationCap } from "lucide-react";
import type { OurEndeavourSectionData } from "@/lib/api";

const IconMap: Record<string, React.ElementType> = {
  Utensils, Users, School, Hospital, Heart, Shield, Activity, GraduationCap
};

export function OurEndeavour({ data }: { data?: OurEndeavourSectionData | null }) {
  if (!data || !data.section) {
    return null;
  }

  const { section, metrics } = data;

  return (
    <section className="relative py-10 md:py-14 overflow-hidden bg-gray-50 border-y border-gray-200/50">
      {/* Background with kids overlay - very subtle */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'grayscale(100%) brightness(150%)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-white/50 pointer-events-none" />
      
      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.14em] text-gray-800 uppercase">
                {section.badge}
              </span>
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight max-w-4xl">
            {section.heading}
          </h2>
          <p 
            className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {metrics?.map((metric) => {
             const endVal = parseFloat(metric.metric_value) || 0;
             const suffix = metric.metric_value.replace(/[\d.]/g, '');
             const decimals = metric.metric_value.includes('.') ? metric.metric_value.split('.')[1].length : 0;
             const IconComponent = IconMap[metric.icon || "Heart"] || Heart;
             
             return (
              <div key={metric.id} className="bg-white rounded-3xl p-6 flex items-center gap-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-14 h-14 bg-lime-50 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <div className="text-[32px] font-bold text-gray-900 flex items-baseline leading-none tracking-tight mb-1">
                    <AnimatedCounter end={endVal} decimals={decimals} suffix={suffix} />
                    <span className="text-lime-500 text-[28px] font-black ml-0.5">+</span>
                  </div>
                  <div className="text-[13px] font-medium text-gray-500">{metric.metric_name}</div>
                </div>
              </div>
             );
          })}
        </div>

        <div className="text-right text-[13px] text-gray-500 font-medium mb-10 mr-4">
          Updated as on: {section.updated_as_on}
        </div>

        {section.cta_text && section.cta_link && (
          <div className="flex justify-center">
            <Link 
              href={section.cta_link} 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-8 py-3.5 text-sm font-bold text-gray-950 shadow-sm hover:bg-lime-500 transition-colors"
            >
              {section.cta_text}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
