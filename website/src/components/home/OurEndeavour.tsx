import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { AnimatedCounter } from "./AnimatedCounter";
import { Utensils, Users, School, Hospital, Heart, Shield, Activity, GraduationCap } from "lucide-react";
import type { OurEndeavourSectionData } from "@/lib/api";

const IconMap: Record<string, React.ElementType> = {
  Utensils, Users, School, Hospital, Heart, Shield, Activity, GraduationCap
};

const DEFAULT_SECTION = {
  badge: "OUR IMPACT",
  heading: "Our Endeavour As NGO",
  description: "At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.",
  cta_text: "Join Our Cause",
  cta_link: "/donate",
  updated_as_on: "04/10/2026"
};

const DEFAULT_METRICS = [
  { id: "1", metric_name: "Meals Served", metric_value: "2.5M+", icon: "Utensils" },
  { id: "2", metric_name: "People Reached", metric_value: "10,000+", icon: "Users" },
  { id: "3", metric_name: "Schools & Communities", metric_value: "172+", icon: "School" },
  { id: "4", metric_name: "Healthcare Camps", metric_value: "350+", icon: "Hospital" }
];

function parseMetricValue(val: string) {
  const hasPlus = val.includes('+');
  const clean = val.replace(/\+/g, '').trim();
  const hasComma = clean.includes(',');
  const noComma = clean.replace(/,/g, '');
  const match = noComma.match(/^([^0-9.]*)([0-9.]+)\s*([^0-9.]*)$/);

  if (!match) {
    return {
      prefix: '',
      end: 0,
      decimals: 0,
      suffix: clean,
      hasPlus,
      useLocale: false
    };
  }

  const prefix = match[1] || '';
  const numStr = match[2];
  const suffix = match[3] || '';
  const end = parseFloat(numStr) || 0;
  const decMatch = numStr.match(/\.(\d+)/);
  const decimals = decMatch ? decMatch[1].length : 0;

  return {
    prefix,
    end,
    decimals,
    suffix,
    hasPlus,
    useLocale: hasComma
  };
}

function getMetricCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("health") || lower.includes("medic")) return "Medical";
  if (lower.includes("school") || lower.includes("educat")) return "Education";
  if (lower.includes("people") || lower.includes("elder") || lower.includes("reach")) return "Elder Care";
  if (lower.includes("meal") || lower.includes("food") || lower.includes("hunger")) return "Food & Hunger";
  return "Impact";
}

const CATEGORY_ORDER: Record<string, number> = {
  "Medical": 1,
  "Education": 2,
  "Elder Care": 3,
  "Food & Hunger": 4,
};

export function OurEndeavour({ data }: { data?: OurEndeavourSectionData | null }) {
  const section = data?.section || DEFAULT_SECTION;

  // Filter out any legacy or rogue cron metrics ('Funds Raised', 'Active Donors')
  const validApiMetrics = (data?.metrics || []).filter(
    (m) => m && m.metric_name && m.metric_name !== 'Funds Raised' && m.metric_name !== 'Active Donors'
  );

  // If DB metrics are present and valid (at least 4 core metrics), use them; otherwise fall back to DEFAULT_METRICS
  const rawMetrics = validApiMetrics.length >= 4 ? validApiMetrics : DEFAULT_METRICS;
  const metrics = [...rawMetrics].sort((a, b) => {
    const orderA = CATEGORY_ORDER[getMetricCategory(a.metric_name)] || 99;
    const orderB = CATEGORY_ORDER[getMetricCategory(b.metric_name)] || 99;
    return orderA - orderB;
  });

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
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#003399] tracking-tight leading-tight max-w-4xl">
            {section.heading?.includes("As NGO") ? (
              <>
                {section.heading.replace("As NGO", "")}
                <span className="text-[#95c718]">As NGO</span>
              </>
            ) : (
              section.heading
            )}
          </h2>
          <p 
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mb-4">
          {metrics?.map((metric) => {
             const parsed = parseMetricValue(metric.metric_value);
             const IconComponent = IconMap[metric.icon || "Heart"] || Heart;
             const categoryName = getMetricCategory(metric.metric_name);
             
             return (
              <div 
                key={metric.id} 
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 shadow-xs sm:shadow-sm border border-gray-200/80 hover:shadow-md hover:border-lime-300 transition-all"
              >
                <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto">
                  <div className="shrink-0 w-9 h-9 sm:w-13 sm:h-13 bg-lime-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-lime-200/60">
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-lime-600" />
                  </div>
                  <span className="sm:hidden text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-200/60">
                    {categoryName}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="hidden sm:flex items-center mb-1">
                    <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-200/60">
                      {categoryName}
                    </span>
                  </div>
                  <div className="text-xl sm:text-[28px] font-bold text-[#003399] flex items-baseline leading-none tracking-tight mb-1">
                    <AnimatedCounter 
                      end={parsed.end} 
                      decimals={parsed.decimals} 
                      prefix={parsed.prefix}
                      suffix={parsed.suffix} 
                      useLocale={parsed.useLocale}
                    />
                    {parsed.hasPlus && (
                      <span className="text-[#95c718] text-lg sm:text-[24px] font-black ml-0.5">+</span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-[13px] font-medium text-gray-500 truncate">{metric.metric_name}</div>
                </div>
              </div>
             );
          })}
        </div>

        <div className="text-center sm:text-right text-xs sm:text-[13px] text-gray-500 font-medium mb-8 sm:mb-10 sm:mr-4">
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
