import { Metadata } from "next";
import Link from "next/link";
import { 
  Heart, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  GraduationCap,
  Stethoscope,
  HeartHandshake
} from "lucide-react";
import { PROGRAMS_REGISTRY } from "@/lib/programs-data";
import { getProjects, type ProjectItem } from "@/lib/api";
import { JoinVolunteerBanner } from "@/components/common/JoinVolunteerBanner";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Our Programs & Humanitarian Drives | CHAH Foundation India",
  description: "Explore our dedicated humanitarian programs across child education, healthcare, eldercare, hunger relief, and animal welfare across 15 States in India.",
  alternates: {
    canonical: "https://chahfoundation.com/programs"
  }
};

export default async function ProgramsIndexPage() {
  const dbProjects = await getProjects(1, 100).catch(() => []);
  const dbMap = new Map<string, ProjectItem>();
  dbProjects.forEach((p) => {
    if (p.slug) dbMap.set(p.slug, p);
  });

  const programs: Array<{
    slug: string;
    title: string;
    category: string;
    heroImage: string;
    whyDescription: string;
    tagline?: string;
  }> = [];

  const seenSlugs = new Set<string>();

  // 1. First process all registry programs with DB overrides
  Object.values(PROGRAMS_REGISTRY).forEach((reg) => {
    seenSlugs.add(reg.slug);
    const dbP = dbMap.get(reg.slug);
    programs.push({
      slug: reg.slug,
      title: dbP?.title || reg.title,
      category: dbP?.category || reg.category,
      heroImage: dbP?.featured_image_url || reg.heroImage,
      whyDescription: dbP?.short_description || reg.whyDescription,
      tagline: reg.tagline,
    });
  });

  // 2. Also append any newly created DB projects from admin panel
  dbProjects.forEach((p) => {
    if (!seenSlugs.has(p.slug) && (p.status === 'ACTIVE' || p.status === 'PUBLISHED')) {
      seenSlugs.add(p.slug);
      programs.push({
        slug: p.slug,
        title: p.title,
        category: p.category || 'Humanitarian Initiative',
        heroImage: p.featured_image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
        whyDescription: p.short_description || p.description || "Active grassroots project organized by CHAH Foundation.",
        tagline: p.category || "Grassroots Program",
      });
    }
  });


  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full min-h-[300px] sm:min-h-0 sm:h-[340px] md:h-[380px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="CHAH Foundation Programs across India"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/25 pointer-events-none" />

          <div className="relative z-10 w-full pb-6 sm:pb-10 pt-16 sm:pt-20">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-lime-400">Programs</span>
              </nav>

              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  GROUND IMPACT INITIATIVES
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  Our Programs &amp; Drives
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium leading-relaxed">
                  Sustainable, audited, and transparent humanitarian programs transforming lives of children, elders, and communities across 15 States.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#003399] font-bold shadow-xs">
                  10+ Core Focus Areas
                </span>
                <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 font-black shadow-xs">
                  Section 80G Tax Exemption
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-medium border border-white/20 hidden sm:inline">
                  Serving Across 15 States in India
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-lime-700" />
              <span>DEDICATED FIELD INITIATIVES</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399]">
              Every Cause We <span className="text-[#95c718]">Champion</span>
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-600 font-normal">
              Click any program below to discover why it matters, what our teams do on the ground, photo archives, and how you can support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {programs.map((prog) => (
              <div
                key={prog.slug}
                className="group rounded-3xl bg-[#fafaf8] border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#003399]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={prog.heroImage}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-xs">
                        {prog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black text-[#003399] tracking-tight group-hover:text-[#95c718] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {prog.whyDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 mt-2">
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#95c718]" />
                      <span>15 States</span>
                    </span>
                    <Link
                      href={`/programs/${prog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003399] group-hover:text-[#85b514] transition-colors"
                    >
                      <span>Explore Program</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Join Our Volunteer Team Banner */}
          <div className="mt-14 sm:mt-18">
            <JoinVolunteerBanner />
          </div>

        </div>
      </section>

      {/* Triple Action CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#003399] to-[#001e5a] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Help Us Expand Our Grassroots Programs
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your support directly purchases textbooks, medicines, rations, and winter warmth for vulnerable children and elders across India.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="px-7 py-3.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 hover:scale-102"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/volunteer"
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Join as Volunteer</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
