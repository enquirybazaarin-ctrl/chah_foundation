import { campaignRepository } from './campaign.repository';
import { 
  CreateCampaignDTO, 
  UpdateCampaignDTO, 
  CampaignResponse, 
  FeaturedSectionResponse,
  FeaturedCampaignSectionSettings 
} from './campaign.types';
import { AppError } from '../../utils/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class CampaignService {
  public async ensureInitialEducationCampaignsSeed() {
    let cat = await prisma.campaignCategory.findFirst({ where: { slug: 'education' } });
    if (!cat) {
      await prisma.campaignCategory.create({
        data: {
          name: 'Education & School Support',
          slug: 'education',
          description: 'Child education and learning essentials',
        },
      });
    }
  }

  public async getFeaturedSectionData(): Promise<FeaturedSectionResponse> {
    await this.ensureInitialEducationCampaignsSeed();

    const [activeCampaigns, section] = await Promise.all([
      campaignRepository.findFeaturedSectionCampaigns(4),
      campaignRepository.getSectionSettings(),
    ]);

    const mapped = activeCampaigns.map((c) => this.mapResponse(c));
    const featured = mapped.find((c) => c.is_featured) || mapped[0] || null;
    const supporting = mapped.filter((c) => c.id !== featured?.id).slice(0, 3);

    return {
      featured,
      supporting,
      section,
    };
  }

  public async updateFeaturedSectionSettings(
    settings: Partial<FeaturedCampaignSectionSettings>
  ): Promise<FeaturedCampaignSectionSettings> {
    return campaignRepository.updateSectionSettings(settings);
  }

  public async ensureInitialMedicalCampaignsSeed() {
    const catExists = await prisma.campaignCategory.findFirst({ where: { slug: 'medical-emergency' } });
    if (!catExists) {
      await prisma.campaignCategory.create({
        data: {
          name: 'Medical Emergency',
          slug: 'medical-emergency',
          description: 'Urgent medical support for those in need',
        },
      });
    }
  }

  public async getMedicalSectionData(): Promise<FeaturedSectionResponse> {
    await this.ensureInitialMedicalCampaignsSeed();

    const [activeCampaigns, section] = await Promise.all([
      campaignRepository.findMedicalSectionCampaigns(4),
      campaignRepository.getMedicalSectionSettings(),
    ]);

    const mapped = activeCampaigns.map((c) => this.mapResponse(c));
    const featured = mapped.find((c) => c.is_featured) || mapped[0] || null;
    const supporting = mapped.filter((c) => c.id !== featured?.id).slice(0, 3);

    return {
      featured,
      supporting,
      section,
    };
  }

  public async updateMedicalSectionSettings(
    settings: Partial<FeaturedCampaignSectionSettings>
  ): Promise<FeaturedCampaignSectionSettings> {
    return campaignRepository.updateMedicalSectionSettings(settings);
  }

  public async getCategorySectionData(prefix: string, defaultBadge: string, defaultHeading: string, defaultSubheading: string, categorySlug: string): Promise<FeaturedSectionResponse> {
    const catExists = await prisma.campaignCategory.findFirst({ where: { slug: categorySlug } });
    if (!catExists) {
      await prisma.campaignCategory.create({
        data: {
          name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug: categorySlug,
          description: `${categorySlug} campaigns`,
        },
      });
    }

    const [activeCampaigns, section] = await Promise.all([
      campaignRepository.findCategorySectionCampaigns(categorySlug, 4),
      campaignRepository.getCategorySectionSettings(prefix, defaultBadge, defaultHeading, defaultSubheading),
    ]);

    const mapped = activeCampaigns.map((c) => this.mapResponse(c));
    const featured = mapped.find((c) => c.is_featured) || mapped[0] || null;
    const supporting = mapped.filter((c) => c.id !== featured?.id).slice(0, 3);

    return {
      featured,
      supporting,
      section,
    };
  }

  public async updateCategorySectionSettings(
    prefix: string,
    settings: Partial<FeaturedCampaignSectionSettings>
  ): Promise<FeaturedCampaignSectionSettings> {
    return campaignRepository.updateCategorySectionSettings(prefix, settings);
  }

  public async createCampaign(
    data: CreateCampaignDTO, 
    auditContext: { actorUserId?: bigint; ipAddress?: string }
  ): Promise<CampaignResponse> {
    const baseSlug = generateSlug(data.title);
    
    let rawContent = data.content || '';
    if (data.supporting_images && data.supporting_images.length > 0) {
      rawContent = rawContent.replace(/<div class="campaign-gallery-data"[^>]*>[\s\S]*?<\/div>/g, '');
      rawContent += `\n<div class="campaign-gallery-data" data-gallery='${JSON.stringify(data.supporting_images)}' style="display:none"></div>`;
    }

    const sanitizedContent = await this.sanitizeContent(rawContent);
    let attempts = 0;

    while (true) {
      const slug = attempts === 0 ? baseSlug : `${baseSlug}-${attempts}`;
      try {
        const campaign = await prisma.$transaction(async (tx) => {
          const newCampaign = await tx.campaign.create({
            data: {
              title: data.title,
              category_id: BigInt(data.category_id),
              slug,
              short_description: data.short_description,
              beneficiary_name: data.beneficiary_name,
              beneficiary_age: data.beneficiary_age,
              location: data.location,
              target_amount: data.target_amount ? new Prisma.Decimal(data.target_amount) : null,
              raised_amount: new Prisma.Decimal(0),
              start_date: data.start_date ? new Date(data.start_date) : null,
              end_date: data.end_date ? new Date(data.end_date) : null,
              content: sanitizedContent,
              featured_image_id: data.featured_image_id ? BigInt(data.featured_image_id) : null,
              featured_image_url: data.featured_image_url,
              is_featured: data.is_featured ?? false,
              is_urgent: data.is_urgent ?? false,
              urgency_label: data.urgency_label,
              cta_button_text: data.cta_button_text ?? 'Help Now',
              sort_order: data.sort_order ?? 0,
              supporters_count: data.supporters_count ?? 0,
              status: 'ACTIVE'
            },
            include: { category: true, featured_image: true }
          });

          await tx.auditLog.create({
            data: {
              action: 'CAMPAIGN_CREATED',
              entity_type: 'CAMPAIGN',
              entity_id: newCampaign.id,
              user_id: auditContext.actorUserId || null,
              ip_address: auditContext.ipAddress,
              new_values: { title: data.title, slug }
            }
          });

          return newCampaign;
        });

        return this.mapResponse(campaign);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          attempts++;
          continue;
        }
        throw error;
      }
    }
  }

  public async getCampaignsPublic(page: number, limit: number) {
    await this.ensureInitialEducationCampaignsSeed();
    const result = await campaignRepository.findAllPublic(page, limit);
    return {
      ...result,
      data: result.data.map(c => this.mapResponse(c))
    };
  }

  public async getCampaignsAdmin(page: number, limit: number) {
    await this.ensureInitialEducationCampaignsSeed();
    const result = await campaignRepository.findAllAdmin(page, limit);
    return {
      ...result,
      data: result.data.map(c => this.mapResponse(c))
    };
  }

  public async getCampaignBySlug(slug: string): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findBySlug(slug);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }
    return this.mapResponse(campaign);
  }

  public async getCampaignById(id: bigint): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }
    return this.mapResponse(campaign);
  }

  public async updateCampaign(
    id: bigint, 
    data: UpdateCampaignDTO, 
    auditContext: { actorUserId?: bigint; ipAddress?: string }
  ): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    const updateData: Prisma.CampaignUncheckedUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category_id !== undefined) updateData.category_id = BigInt(data.category_id);
    if (data.short_description !== undefined) updateData.short_description = data.short_description;
    if (data.beneficiary_name !== undefined) updateData.beneficiary_name = data.beneficiary_name;
    if (data.beneficiary_age !== undefined) updateData.beneficiary_age = data.beneficiary_age;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.target_amount !== undefined) updateData.target_amount = data.target_amount ? new Prisma.Decimal(data.target_amount) : null;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
    if (data.featured_image_id !== undefined) updateData.featured_image_id = data.featured_image_id ? BigInt(data.featured_image_id) : null;
    if (data.featured_image_url !== undefined) updateData.featured_image_url = data.featured_image_url;
    if (data.is_featured !== undefined) updateData.is_featured = data.is_featured;
    if (data.is_urgent !== undefined) updateData.is_urgent = data.is_urgent;
    if (data.urgency_label !== undefined) updateData.urgency_label = data.urgency_label;
    if (data.cta_button_text !== undefined) updateData.cta_button_text = data.cta_button_text;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
    if (data.supporters_count !== undefined) updateData.supporters_count = data.supporters_count;
    
    let baseContent = data.content !== undefined ? data.content : campaign.content;
    if (data.supporting_images !== undefined) {
      baseContent = baseContent.replace(/<div class="campaign-gallery-data"[^>]*>[\s\S]*?<\/div>/g, '');
      if (data.supporting_images.length > 0) {
        baseContent += `\n<div class="campaign-gallery-data" data-gallery='${JSON.stringify(data.supporting_images)}' style="display:none"></div>`;
      }
      updateData.content = await this.sanitizeContent(baseContent);
    } else if (data.content !== undefined) {
      updateData.content = await this.sanitizeContent(data.content);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCampaign = await tx.campaign.update({
        where: { id },
        data: updateData,
        include: { category: true, featured_image: true }
      });

      await tx.auditLog.create({
        data: {
          action: 'CAMPAIGN_UPDATED',
          entity_type: 'CAMPAIGN',
          entity_id: id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress
        }
      });

      return updatedCampaign;
    });

    return this.mapResponse(updated);
  }

  public async cancelCampaign(
    id: bigint, 
    auditContext: { actorUserId?: bigint; ipAddress?: string }
  ): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (campaign.status === 'CANCELLED') {
      return this.mapResponse(campaign);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCampaign = await tx.campaign.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { category: true, featured_image: true }
      });

      await tx.auditLog.create({
        data: {
          action: 'CAMPAIGN_CANCELLED',
          entity_type: 'CAMPAIGN',
          entity_id: id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          old_values: { status: campaign.status },
          new_values: { status: 'CANCELLED' }
        }
      });

      return updatedCampaign;
    });

    return this.mapResponse(updated);
  }

  public async deleteCampaign(
    id: bigint, 
    auditContext: { actorUserId?: bigint; ipAddress?: string }
  ): Promise<boolean> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Safety check: Do not delete a campaign that has received actual donations
    const donationCount = await prisma.donation.count({
      where: { campaign_id: id, status: 'SUCCESS' }
    });
    if (donationCount > 0) {
      throw new AppError('Cannot delete a campaign with completed donations. You can cancel it instead.', 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.donation.deleteMany({ where: { campaign_id: id } });
      await tx.subscription.deleteMany({ where: { campaign_id: id } });
      await tx.campaign.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          action: 'CAMPAIGN_DELETED',
          entity_type: 'CAMPAIGN',
          entity_id: id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          old_values: { title: campaign.title, slug: campaign.slug }
        }
      });
    });

    return true;
  }

  private async sanitizeContent(html: string): Promise<string> {
    const { default: sanitizeHtml } = await import('sanitize-html');
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'figure', 'figcaption']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
        'iframe': ['src', 'width', 'height', 'allowfullscreen'],
        'div': ['class', 'data-gallery', 'style', 'id']
      },
      allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
    });
  }

  private mapResponse(campaign: any): CampaignResponse {
    let galleryImages: string[] = [];
    if (campaign.content) {
      const match = campaign.content.match(/data-gallery='(.*?)'/) || campaign.content.match(/data-gallery="([^\"]*)"/);
      if (match) {
        try {
          const raw = match[1].replace(/&quot;/g, '"');
          galleryImages = JSON.parse(raw);
        } catch {}
      }
    }
    const featUrl = campaign.featured_image_url || campaign.featured_image?.url || null;
    const allImages = [
      ...(featUrl ? [featUrl] : []),
      ...galleryImages.filter((img: string) => img !== featUrl)
    ];

    return {
      id: campaign.id.toString(),
      category_id: campaign.category_id.toString(),
      title: campaign.title,
      slug: campaign.slug,
      short_description: campaign.short_description || null,
      beneficiary_name: campaign.beneficiary_name || null,
      beneficiary_age: campaign.beneficiary_age !== undefined && campaign.beneficiary_age !== null ? Number(campaign.beneficiary_age) : null,
      location: campaign.location || null,
      target_amount: campaign.target_amount ? campaign.target_amount.toString() : null,
      raised_amount: campaign.raised_amount ? campaign.raised_amount.toString() : '0',
      status: campaign.status,
      start_date: campaign.start_date ? campaign.start_date.toISOString() : null,
      end_date: campaign.end_date ? campaign.end_date.toISOString() : null,
      content: campaign.content,
      featured_image_id: campaign.featured_image_id ? campaign.featured_image_id.toString() : null,
      featured_image_url: featUrl,
      images: allImages,
      supporting_images: galleryImages,
      is_featured: Boolean(campaign.is_featured),
      is_urgent: Boolean(campaign.is_urgent),
      urgency_label: campaign.urgency_label || null,
      cta_button_text: campaign.cta_button_text || 'Help Now',
      sort_order: Number(campaign.sort_order || 0),
      supporters_count: Number(campaign.supporters_count || 0),
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      category: campaign.category ? {
        id: campaign.category.id.toString(),
        name: campaign.category.name,
        slug: campaign.category.slug,
      } : undefined,
      featured_image: campaign.featured_image ? {
        id: campaign.featured_image.id.toString(),
        url: campaign.featured_image.url,
        alt_text: campaign.featured_image.alt_text,
      } : null,
    };
  }
  public async getCampaignSupporters(campaignId: bigint, limit: number) {
    const donations = await prisma.donation.findMany({
      where: {
        campaign_id: campaignId,
        status: { in: ['SUCCESS'] }
      },
      include: {
        donor: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit
    });

    return donations.map(d => {
      const name = d.is_anonymous ? "Anonymous" : (d.donor.first_name + (d.donor.last_name ? " " + d.donor.last_name : ""));
      return {
        id: d.id.toString(),
        name,
        amount: d.amount.toString(),
        initial: name.charAt(0).toUpperCase(),
        created_at: d.created_at
      };
    });
  }
}

export const campaignService = new CampaignService();
