import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowRight, Heart, Users, CheckCircle, Target } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { OurEndeavour } from "@/components/home/OurEndeavour";
import { KnowAboutUs } from "@/components/home/KnowAboutUs";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { FundraiseCategoriesSection } from "@/components/home/FundraiseCategoriesSection";
import { DonationBannerSection } from "@/components/home/DonationBannerSection";
import { OurPartnersSection } from "@/components/home/OurPartnersSection";
import { CompletedProjectsSection } from "@/components/home/CompletedProjectsSection";
import { PartnerWithUsSection } from "@/components/home/PartnerWithUsSection";
import { JoinVolunteerBanner } from "@/components/common/JoinVolunteerBanner";
import { PROGRAMS_REGISTRY } from "@/lib/programs-data";
import { getCampaigns, getHeroSlides, getWhatWeDoData, getFeaturedCampaignSection, getMedicalEmergencySection, getImpactProjectsSection, getOurEndeavourData, getEldercareSection, getFoodSection, getProjects, getKnowAboutUsData } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [campaigns, heroSlides, whatWeDoData, featuredCampaignData, medicalSectionData, eldercareSectionData, foodSectionData, impactProjectsData, ourEndeavourData, completedProjects, knowAboutUsData] = await Promise.all([
    getCampaigns(1, 10).catch(() => []),
    getHeroSlides().catch(() => []),
    getWhatWeDoData().catch(() => null),
    getFeaturedCampaignSection().catch(() => null),
    getMedicalEmergencySection().catch(() => null),
    getEldercareSection().catch(() => null),
    getFoodSection().catch(() => null),
    getImpactProjectsSection().catch(() => null),
    getOurEndeavourData().catch(() => null),
    getProjects(1, 50).catch(() => []),
    getKnowAboutUsData().catch(() => null),
  ]);

  let finalProjects = completedProjects;
  if (!finalProjects || finalProjects.length === 0) {
    finalProjects = Object.values(PROGRAMS_REGISTRY).map((prog) => ({
      id: prog.id,
      slug: prog.slug,
      title: prog.title,
      description: prog.whatWeDoDescription || prog.whyDescription,
      short_description: prog.whyDescription,
      category: prog.category,
      location: prog.location || "Across India",
      impact_summary: prog.tagline,
      beneficiary_info: prog.beneficiaryInfo || "Communities in need",
      featured_image_url: prog.heroImage,
      status: "ACTIVE",
      is_featured: true,
      cta_text: "View Project",
      cta_link: `/programs/${prog.slug}`,
      project_date: null,
    }));
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSlider slides={heroSlides} />

      <OurEndeavour data={ourEndeavourData} />
      <KnowAboutUs data={knowAboutUsData} />
      
      {/* What We Do Section */}
      <WhatWeDoSection 
        badge={whatWeDoData?.section?.badge}
        heading={whatWeDoData?.section?.heading}
        subheading={whatWeDoData?.section?.subheading}
        items={whatWeDoData?.cards}
      />


      {/* Filterable Campaign Categories */}
      <FundraiseCategoriesSection 
        featuredData={featuredCampaignData} 
        medicalData={medicalSectionData}
        eldercareData={eldercareSectionData}
        foodData={foodSectionData}
        impactData={impactProjectsData} 
      />

      {/* Projects We Have Done (Filtered Projects Section) */}
      <CompletedProjectsSection projects={finalProjects} />

      {/* Volunteer Team Banner */}
      <section className="py-8 sm:py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <JoinVolunteerBanner />
        </div>
      </section>

      {/* Partner With Us Section */}
      <PartnerWithUsSection />

      {/* Donation Banner */}
      <DonationBannerSection />

      {/* Partners Continuous Scrolling Section */}
      <OurPartnersSection />
    </>
  );
}
