import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowRight, Heart, Users, CheckCircle, Target } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { OurEndeavour } from "@/components/home/OurEndeavour";
import { KnowAboutUs } from "@/components/home/KnowAboutUs";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { FeaturedCampaignsSection } from "@/components/home/FeaturedCampaignsSection";
import { MedicalEmergencySection } from "@/components/home/MedicalEmergencySection";
import { ImpactProjectsSection } from "@/components/home/ImpactProjectsSection";
import { getCampaigns, getHeroSlides, getWhatWeDoData, getFeaturedCampaignSection, getMedicalEmergencySection, getImpactProjectsSection, getOurEndeavourData } from "@/lib/api";

export default async function Home() {
  const [campaigns, heroSlides, whatWeDoData, featuredCampaignData, medicalSectionData, impactProjectsData, ourEndeavourData] = await Promise.all([
    getCampaigns(1, 10).catch(() => []),
    getHeroSlides().catch(() => []),
    getWhatWeDoData().catch(() => null),
    getFeaturedCampaignSection().catch(() => null),
    getMedicalEmergencySection().catch(() => null),
    getImpactProjectsSection().catch(() => null),
    getOurEndeavourData().catch(() => null),
  ]);

  return (
    <>
      {/* Hero Section */}
      <HeroSlider slides={heroSlides} />

      <OurEndeavour data={ourEndeavourData} />
      <KnowAboutUs />
      
      {/* What We Do Section */}
      <WhatWeDoSection 
        badge={whatWeDoData?.section?.badge}
        heading={whatWeDoData?.section?.heading}
        subheading={whatWeDoData?.section?.subheading}
        items={whatWeDoData?.cards}
      />


      {/* High-Converting Featured Campaigns / Urgent Needs Section */}
      <FeaturedCampaignsSection data={featuredCampaignData} />

      <MedicalEmergencySection data={medicalSectionData} />

      <ImpactProjectsSection data={impactProjectsData} />
    </>
  );
}
