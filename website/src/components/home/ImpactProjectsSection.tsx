import Link from "next/link";
import { ArrowRight, MapPin, HeartHandshake, CheckCircle2 } from "lucide-react";
import type { ImpactProjectsSectionData, ProjectItem } from "@/lib/api";

interface ImpactProjectsSectionProps {
  data?: ImpactProjectsSectionData | null;
}

export function ImpactProjectsSection({ data }: ImpactProjectsSectionProps) {
  if (!data) return null;

  const { section, featured, supporting } = data;

  return (
    <section className="py-10 md:py-14 bg-gray-50 border-y border-gray-200/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200/80">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.14em] text-lime-600 uppercase">
                {section.badge || "OUR IMPACT"}
              </span>
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-[42px] font-bold text-gray-950 tracking-tight leading-tight max-w-4xl">
            {section.heading}
          </h2>
          {section.subheading && (
            <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
              {section.subheading}
            </p>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Featured Project */}
          {featured && (
            <div className="lg:col-span-8 flex flex-col group">
              <Link href={featured.cta_link || `/projects/${featured.slug}`} className="block relative aspect-[4/3] lg:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={featured.featured_image_url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200"}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />
              </Link>
              
              <div className="mt-6 flex flex-col items-start">
                {featured.category && (
                  <span className="text-xs font-bold tracking-widest text-lime-500 uppercase mb-3">
                    {featured.category}
                  </span>
                )}
                
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-lime-600 transition-colors">
                  <Link href={featured.cta_link || `/projects/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                  {featured.short_description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 mb-6">
                  {featured.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {featured.location}
                    </span>
                  )}
                  {featured.impact_summary && (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                      {featured.impact_summary}
                    </span>
                  )}
                </div>

                <Link
                  href={featured.cta_link || `/projects/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-lime-500 font-bold hover:text-lime-600 transition-colors group/link"
                >
                  {featured.cta_text || "View Project"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          )}

          {/* Supporting Projects */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-10">
            {supporting.map((project) => (
              <div key={project.id} className="group flex flex-col">
                <Link href={project.cta_link || `/projects/${project.slug}`} className="block relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 mb-5 shadow-sm">
                  <img
                    src={project.featured_image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent pointer-events-none" />
                </Link>
                
                {project.category && (
                  <span className="text-[11px] font-bold tracking-widest text-lime-500 uppercase mb-2">
                    {project.category}
                  </span>
                )}
                
                <h4 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-lime-600 transition-colors line-clamp-2">
                  <Link href={project.cta_link || `/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h4>
                
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                  {project.short_description}
                </p>

                <Link
                  href={project.cta_link || `/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-lime-500 hover:text-lime-600 transition-colors group/link mt-auto"
                >
                  {project.cta_text || "View Project"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
          
        </div>

        {/* Bottom View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 px-8 py-4 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-lime-500 hover:border-lime-300 transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
