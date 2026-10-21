import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCampaignBySlug, getCampaignSupporters } from '@/lib/api';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import CampaignCategoryHubView from '@/components/campaigns/CampaignCategoryHubView';
import { getCampaignCategory } from '@/lib/campaign-categories-data';
import { getFallbackCampaign } from '@/lib/fallback-campaigns';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Check if it's a flagship category hub
  const categoryConfig = getCampaignCategory(slug);
  if (categoryConfig) {
    return {
      title: `${categoryConfig.legacyTitle} | CHAH Foundation India`,
      description: `${categoryConfig.defaultHeading} — ${categoryConfig.defaultSubheading}`,
      alternates: {
        canonical: `https://chahfoundation.com/campaigns/${slug}`
      },
      openGraph: {
        title: `${categoryConfig.legacyTitle} | CHAH Foundation India`,
        description: categoryConfig.defaultSubheading,
        images: [{ url: categoryConfig.heroImage }]
      }
    };
  }

  // 2. Otherwise check for individual beneficiary campaign
  let campaign: any = null;
  try {
    campaign = await getCampaignBySlug(slug);
  } catch {
    campaign = null;
  }

  if (!campaign) {
    campaign = getFallbackCampaign(slug);
  }

  if (campaign) {
    return {
      title: `${campaign.title} | Active Fundraiser | CHAH Foundation`,
      description: campaign.short_description || campaign.title,
      openGraph: {
        title: campaign.title,
        description: campaign.short_description || campaign.title,
        images: campaign.featured_image_url ? [{ url: campaign.featured_image_url }] : []
      }
    };
  }

  return { title: 'Campaign | CHAH Foundation India' };
}

export default async function CampaignPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check if this is one of the 4 Flagship Campaign Category Hubs
  const categoryConfig = getCampaignCategory(slug);
  if (categoryConfig) {
    // Fetch live section data from backend/admin panel
    let sectionData;
    try {
      sectionData = await categoryConfig.fetcher();
    } catch {
      sectionData = {
        featured: categoryConfig.fallbackFeatured,
        supporting: categoryConfig.fallbackSupporting,
        section: {
          badge: categoryConfig.defaultBadge,
          heading: categoryConfig.defaultHeading,
          subheading: categoryConfig.defaultSubheading,
        }
      };
    }

    const { fetcher: _fetcher, ...serializableConfig } = categoryConfig;

    return (
      <CampaignCategoryHubView 
        config={serializableConfig} 
        sectionData={sectionData} 
      />
    );
  }

  // 2. Individual Beneficiary Campaign Story Page
  let campaign: any = null;
  let supporters: any[] = [];

  // Try live database first
  try {
    campaign = await getCampaignBySlug(slug);
    if (campaign && campaign.id) {
      supporters = await getCampaignSupporters(campaign.id).catch(() => []);
    }
  } catch {
    campaign = null;
  }

  // Fallback to rich predefined campaign if not in live database yet
  if (!campaign) {
    campaign = getFallbackCampaign(slug);
  }

  if (!campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <CampaignDetailView campaign={campaign} initialSupporters={supporters} />
      </div>
    </div>
  );
}
