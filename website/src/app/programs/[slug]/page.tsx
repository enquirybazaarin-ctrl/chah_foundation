import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Heart, 
  UserCheck, 
  Handshake, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  ImageIcon, 
  Share2,
  Gift
} from "lucide-react";
import { getProjectBySlug, getProjects, type ProjectItem } from "@/lib/api";
import { getProgramBySlugFromRegistry, PROGRAMS_REGISTRY } from "@/lib/programs-data";
import { JoinVolunteerBanner } from "@/components/common/JoinVolunteerBanner";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Try fetching from backend database first
  let dbProject: ProjectItem | null = await getProjectBySlug(slug);
  if (!dbProject) {
    const allProjects = await getProjects(1, 50);
    dbProject = allProjects.find(
      (p) =>
        p.slug === slug ||
        p.slug === `${slug}-1` ||
        p.category?.toLowerCase() === slug.replace(/-/g, ' ').toLowerCase() ||
        p.title?.toLowerCase() === slug.replace(/-/g, ' ').toLowerCase()
    ) || null;
  }
  const registryProgram = getProgramBySlugFromRegistry(slug);

  const title = dbProject?.title || registryProgram?.title || "Program Drive";
  const description = 
    dbProject?.short_description || 
    dbProject?.description?.slice(0, 160) || 
    registryProgram?.whyDescription?.slice(0, 160) || 
    "Learn about our impactful humanitarian drive at CHAH Foundation India.";

  const heroImage = 
    dbProject?.featured_image_url || 
    registryProgram?.heroImage || 
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop";

  return {
    title: `${title} | CHAH Foundation India`,
    description,
    keywords: [
      title,
      "CHAH Foundation Programs",
      "NGO India",
      "Child Education",
      "Elder Care",
      "Charity Drives Mumbai",
      "80G Tax Exemption Donation"
    ],
    alternates: {
      canonical: `https://chahfoundation.com/programs/${slug}`
    },
    openGraph: {
      title: `${title} | CHAH Foundation India`,
      description,
      url: `https://chahfoundation.com/programs/${slug}`,
      siteName: "CHAH Foundation India",
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CHAH Foundation India`,
      description,
      images: [heroImage]
    }
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;

  // 1. Fetch dynamic data from Admin/Backend Database
  let dbProject: ProjectItem | null = await getProjectBySlug(slug);
  if (!dbProject) {
    const allProjects = await getProjects(1, 50);
    dbProject = allProjects.find(
      (p) =>
        p.slug === slug ||
        p.slug === `${slug}-1` ||
        p.category?.toLowerCase() === slug.replace(/-/g, ' ').toLowerCase() ||
        p.title?.toLowerCase() === slug.replace(/-/g, ' ').toLowerCase()
    ) || null;
  }

  // 2. Fetch registry fallback data for comprehensive presentation
  const registryProgram = getProgramBySlugFromRegistry(slug);

  // If not found in either, return 404
  if (!dbProject && !registryProgram) {
    notFound();
  }

  // Unified data resolution (Admin DB takes precedence when populated)
  const title = dbProject?.title || registryProgram?.title || "Program";
  const category = dbProject?.category || registryProgram?.category || "Community Welfare";
  const heroImage = dbProject?.featured_image_url || registryProgram?.heroImage || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop";
  const location = dbProject?.location || registryProgram?.location || "Pan-India across 15 States";
  const beneficiaryInfo = dbProject?.beneficiary_info || registryProgram?.beneficiaryInfo || "Underprivileged children & elders";
  
  // Why section
  const whyHeading = dbProject?.impact_summary || `Why ${category || title}?`;
  const whyDescription = dbProject?.short_description || registryProgram?.whyDescription || "Underprivileged children and families in India face deep challenges every day, requiring urgent and sustainable intervention.";
  const whyPoints = registryProgram?.whyPoints || [
    { title: "Critical Community Need", desc: "Marginalized families lack resources to fulfill everyday essential requirements." },
    { title: "Empowering Next Generations", desc: "Direct grassroots support prevents distress migration, child labour, and isolation." },
    { title: "Lasting Social Change", desc: "Continuous on-ground assistance creates self-reliance and community dignity." }
  ];

  // What We Do section
  const whatWeDoDescription = dbProject?.description || registryProgram?.whatWeDoDescription || "Our dedicated field teams and volunteers coordinate on the ground to deliver continuous, transparent relief and empowerment.";
  const whatWeDoInitiatives = registryProgram?.whatWeDoInitiatives || (dbProject?.activities && dbProject.activities.length > 0
    ? dbProject.activities.map(a => ({ title: a.title, desc: a.description || "Active community initiative." }))
    : [
        { title: "Direct Ground Delivery", desc: "Our field volunteers reach beneficiaries directly without intermediate delays." },
        { title: "Transparent Tracking & Audit", desc: "Every activity is documented with photo proofs and community audits." },
        { title: "Community Partnerships", desc: "Working alongside local schools, care homes, and hospitals." }
      ]);

  // Gallery Images - Pure Visual Photos
  const galleryImages: { url: string }[] = [];

  // If DB has gallery images, use them
  if (dbProject?.gallery_images && dbProject.gallery_images.length > 0) {
    dbProject.gallery_images.forEach(img => {
      if (img.url) {
        galleryImages.push({
          url: img.url,
        });
      }
    });
  }

  // If registry has gallery images, merge or use them
  if (galleryImages.length === 0 && registryProgram?.galleryImages) {
    registryProgram.galleryImages.forEach(img => {
      if (img.url) galleryImages.push({ url: img.url });
    });
  }

  // If still empty, add default high quality fallbacks
  if (galleryImages.length === 0) {
    galleryImages.push(
      { url: heroImage },
      { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop" }
    );
  }

  // Impact Stats
  const impactStats = registryProgram?.impactStats || [
    { label: "Direct Beneficiaries", value: "10,000+" },
    { label: "States Impacted", value: "15 States" },
    { label: "Community Drives", value: "120+" },
    { label: "Transparency Score", value: "100%" }
  ];

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "CHAH Foundation India",
    "url": "https://chahfoundation.com",
    "logo": "https://chahfoundation.com/mainlogo.webp",
    "department": {
      "@type": "Project",
      "name": title,
      "description": whyDescription,
      "image": heroImage,
      "areaServed": location
    }
  };

  return (
    <article className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ======================================================== */}
      {/* 1. HERO BANNER (DIRECTLY AFTER HEADER)                   */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full min-h-[340px] sm:min-h-0 sm:h-[380px] md:h-[440px] lg:h-[480px] flex flex-col justify-end">
          <img
            src={heroImage}
            alt={`${title} - CHAH Foundation India`}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/25 pointer-events-none" />

          {/* Breadcrumbs & Hero Content */}
          <div className="relative z-10 w-full pb-6 sm:pb-10 pt-16 sm:pt-20">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/programs" className="hover:text-lime-300 transition-colors">Programs</Link>
                <span>/</span>
                <span className="text-lime-400 truncate max-w-[180px] sm:max-w-none">{title}</span>
              </nav>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                    {category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/20 hidden sm:inline">
                    Program Initiative
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                  {title}
                </h1>

                {registryProgram?.tagline && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-3xl font-medium leading-relaxed">
                    {registryProgram.tagline}
                  </p>
                )}
              </div>

              {/* Location & Trust Indicators */}
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2 text-[11px] sm:text-xs text-white/90">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#003399] font-bold shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#95c718]" />
                  <span>{location}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#95c718]" />
                  <span>Section 80G Certified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 font-medium hidden sm:inline-flex">
                  <Users className="w-3.5 h-3.5 text-lime-300" />
                  <span>{beneficiaryInfo}</span>
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PROGRAM IMPACT STATS BAR                              */}
      {/* ======================================================== */}
      <section className="bg-white border-b border-gray-100 py-6 sm:py-8 shadow-2xs">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="p-3">
                <p className={`text-2xl sm:text-4xl font-black ${idx % 2 === 0 ? "text-[#003399]" : "text-[#95c718]"}`}>
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECTION: WHY (PROGRAM NAME) DESCRIPTION               */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200/80">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>THE CHALLENGE &amp; URGENCY</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399] leading-tight">
              {whyHeading.toLowerCase().startsWith("why ") ? (
                <>
                  Why <span className="text-[#95c718]">{whyHeading.slice(4)}</span>
                </>
              ) : (
                <span>{whyHeading}</span>
              )}
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
              {whyDescription}
            </p>
          </div>

          {/* 3 Key Pillars of the Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-black text-sm">
                  0{index + 1}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#003399] tracking-tight">
                  {point.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION: WHAT WE DO? (HEADING & TEXT)                 */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#003399] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#003399]" />
                <span>ACTION ON THE GROUND</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight leading-tight">
                What <span className="text-[#95c718]">We Do?</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                {whatWeDoDescription}
              </p>

              <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#003399] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#95c718]" />
                  <span>Grassroots Delivery Model</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every drive is executed directly by our trusted field volunteers and coordinators across 15 states, guaranteeing zero overhead leakages and direct impact.
                </p>
              </div>
            </div>

            {/* Right Initiatives Cards */}
            <div className="lg:col-span-7 space-y-4">
              {whatWeDoInitiatives.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#003399]/40 hover:shadow-sm transition-all text-left flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-lime-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#003399] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SECTION: GALLERY / IMAGES RELATED TO THIS PROGRAM      */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
              <ImageIcon className="w-4 h-4 text-lime-700" />
              <span>FIELD IMPACT &amp; VISUAL ARCHIVE</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#003399] leading-tight">
              On-Ground <span className="text-[#95c718]">Glimpses &amp; Impact</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
              Real moments captured from our field drives, showing the tangible change created by our volunteers and donors for {title}.
            </p>
          </div>

          {/* Responsive Gallery Grid - Only Images Displayed */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-300 aspect-[4/3]"
              >
                <img
                  src={img.url}
                  alt={`${title} supporting photograph ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Join Volunteer Team Banner */}
          <div className="mt-12 sm:mt-16">
            <JoinVolunteerBanner defaultInterest={title} />
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FINAL TRIPLE-ACTION CTA: DONATE, VOLUNTEER, PARTNER    */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#003399] via-[#002673] to-[#001e5a] text-white text-center relative overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-lime-400/10 pointer-events-none blur-2xl" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-300 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-lime-300" />
            <span>MAKE A DIRECT IMPACT FOR {title.toUpperCase()}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Be Part of the <span className="text-[#95c718]">Change</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-normal">
            Whether you choose to make a tax-exempt contribution, volunteer your time, or collaborate as an institutional partner, your support fuels {title} on the ground.
          </p>

          {/* 3 Prominent Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-left">
            
            {/* Card 1: Donate */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 border-2 border-transparent hover:border-[#95c718] shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#95c718] text-slate-950 flex items-center justify-center font-bold mb-4 shadow-xs">
                  <Heart className="w-6 h-6 fill-slate-950" />
                </div>
                <h3 className="text-lg font-black text-[#003399]">
                  Donate to this Drive
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Directly fund meals, medicines, or learning kits. Receive instant 80G tax receipt and photo updates.
                </p>
              </div>
              <Link
                href={`/donate?cause=${encodeURIComponent(slug)}`}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Give Donation Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Volunteer */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 border-2 border-transparent hover:border-[#003399] shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold mb-4 shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#003399]">
                  Join as Volunteer
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Join our changemaker family. Help distribute rations, teach children, or conduct health camps.
                </p>
              </div>
              <Link
                href="/volunteer"
                className="mt-6 w-full py-3 px-4 rounded-xl bg-[#003399] hover:bg-[#002673] text-white font-black text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Become a Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Partnership */}
            <div className="p-6 rounded-3xl bg-white text-slate-900 border-2 border-transparent hover:border-[#95c718] shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold mb-4 shadow-xs">
                  <Handshake className="w-6 h-6 text-lime-700" />
                </div>
                <h3 className="text-lg font-black text-[#003399]">
                  Corporate / CSR Partner
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Partner with us for CSR compliance, corporate employee drives, and audited social governance.
                </p>
              </div>
              <Link
                href="/partner-with-us"
                className="mt-6 w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#003399] font-black text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Partner With Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Quick Assurance Tags */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Section 80G Tax Exemption
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Societies Registration Act 1950
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Audited Ground Reports
            </span>
          </div>

        </div>
      </section>

    </article>
  );
}
