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
    const count = await campaignRepository.countActive();
    if (count > 0) return;

    let cat = await prisma.campaignCategory.findFirst({ where: { slug: 'education' } });
    if (!cat) {
      cat = await prisma.campaignCategory.create({
        data: {
          name: 'Education & School Support',
          slug: 'education',
          description: 'Child education and learning essentials',
        },
      });
    }

    const seeds = [
      {
        title: 'Help Amit continue his education',
        slug: 'help-amit-continue-education',
        category_id: cat.id,
        short_description: 'Amit needs support for his school fees and essential learning materials to stay in school.',
        beneficiary_name: 'Amit',
        beneficiary_age: 10,
        location: 'Sitapur, Uttar Pradesh',
        target_amount: new Prisma.Decimal(8000),
        raised_amount: new Prisma.Decimal(3200),
        status: 'ACTIVE' as const,
        content: 'Amit is a diligent 10-year-old student who dreams of becoming a science teacher. Due to severe economic hardship, his family cannot afford this term school fees, uniforms, and textbooks. Your contribution ensures Amit does not drop out and can pursue his education safely.',
        featured_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        is_featured: true,
        is_urgent: true,
        urgency_label: '5 days left',
        cta_button_text: 'Help Amit',
        sort_order: 1,
        supporters_count: 12,
      },
      {
        title: 'Help Veena get her school kit & uniform',
        slug: 'help-veena-school-kit',
        category_id: cat.id,
        short_description: 'Veena dreams of becoming a teacher. Help provide her with books, a bag, and a school uniform.',
        beneficiary_name: 'Veena',
        beneficiary_age: 8,
        location: 'Lucknow, Uttar Pradesh',
        target_amount: new Prisma.Decimal(5000),
        raised_amount: new Prisma.Decimal(1500),
        status: 'ACTIVE' as const,
        content: 'Veena is an 8-year-old bright student starting 3rd grade. Her parents work as daily wage earners and struggle to purchase compulsory school supplies. A contribution of just ₹500 provides a full textbook set and bag.',
        featured_image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
        is_featured: false,
        is_urgent: false,
        urgency_label: null,
        cta_button_text: 'Help Veena',
        sort_order: 2,
        supporters_count: 7,
      },
      {
        title: 'Help Bharti continue school after family hardship',
        slug: 'help-bharti-continue-school',
        category_id: cat.id,
        short_description: 'Provide annual tuition support and stationery to prevent Bharti from dropping out of class 7.',
        beneficiary_name: 'Bharti',
        beneficiary_age: 12,
        location: 'Barabanki, Uttar Pradesh',
        target_amount: new Prisma.Decimal(10000),
        raised_amount: new Prisma.Decimal(4200),
        status: 'ACTIVE' as const,
        content: 'Bharti is top of her class in mathematics and hopes to attend college. Following her father illness, the family faces tuition arrears. Sponsorship covers tuition, exam fees, and coaching support.',
        featured_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
        is_featured: false,
        is_urgent: false,
        urgency_label: null,
        cta_button_text: 'Help Bharti',
        sort_order: 3,
        supporters_count: 19,
      },
      {
        title: 'Clean water & sanitation kit for Aarav and schoolmates',
        slug: 'clean-water-sanitation-aarav',
        category_id: cat.id,
        short_description: 'Ensure Aarav and his fellow 120 schoolmates have clean drinking water and hygiene essentials.',
        beneficiary_name: 'Aarav',
        beneficiary_age: 9,
        location: 'Rae Bareli, Uttar Pradesh',
        target_amount: new Prisma.Decimal(12000),
        raised_amount: new Prisma.Decimal(6800),
        status: 'ACTIVE' as const,
        content: 'Clean drinking water is fundamental for school attendance and preventing waterborne diseases. This initiative installs a filtration unit and handwashing station at Aarav primary school.',
        featured_image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
        is_featured: false,
        is_urgent: false,
        urgency_label: null,
        cta_button_text: 'Help Aarav',
        sort_order: 4,
        supporters_count: 24,
      },
    ];

    for (const seed of seeds) {
      await prisma.campaign.create({ data: seed });
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

  public async createCampaign(
    data: CreateCampaignDTO, 
    auditContext: { actorUserId?: bigint; ipAddress?: string }
  ): Promise<CampaignResponse> {
    const baseSlug = generateSlug(data.title);
    const sanitizedContent = await this.sanitizeContent(data.content);
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
              raised_amount: data.raised_amount ? new Prisma.Decimal(data.raised_amount) : new Prisma.Decimal(0),
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
    if (data.raised_amount !== undefined) updateData.raised_amount = new Prisma.Decimal(data.raised_amount);
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
    if (data.content !== undefined) updateData.content = await this.sanitizeContent(data.content);

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

  private async sanitizeContent(html: string): Promise<string> {
    const { default: sanitizeHtml } = await import('sanitize-html');
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'iframe': ['src', 'width', 'height', 'allowfullscreen']
      },
      allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
    });
  }

  private mapResponse(campaign: any): CampaignResponse {
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
      featured_image_url: campaign.featured_image_url || campaign.featured_image?.url || null,
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
}

export const campaignService = new CampaignService();
