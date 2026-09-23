import { campaignRepository } from './campaign.repository';
import { CreateCampaignDTO, UpdateCampaignDTO, CampaignResponse } from './campaign.types';
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
  public async createCampaign(data: CreateCampaignDTO, auditContext: { actorUserId?: bigint; ipAddress?: string }): Promise<CampaignResponse> {
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
              target_amount: data.target_amount ? new Prisma.Decimal(data.target_amount) : null,
              start_date: data.start_date ? new Date(data.start_date) : null,
              end_date: data.end_date ? new Date(data.end_date) : null,
              content: sanitizedContent,
              featured_image_id: data.featured_image_id ? BigInt(data.featured_image_id) : null,
              status: 'ACTIVE'
            },
            include: { category: true }
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
    const result = await campaignRepository.findAllPublic(page, limit);
    return {
      ...result,
      data: result.data.map(c => this.mapResponse(c))
    };
  }

  public async getCampaignsAdmin(page: number, limit: number) {
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
    // ACTIVE, COMPLETED, CANCELLED are all public
    return this.mapResponse(campaign);
  }

  public async getCampaignById(id: bigint): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }
    return this.mapResponse(campaign);
  }

  public async updateCampaign(id: bigint, data: UpdateCampaignDTO, auditContext: { actorUserId?: bigint; ipAddress?: string }): Promise<CampaignResponse> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    const updateData: Prisma.CampaignUncheckedUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category_id !== undefined) updateData.category_id = BigInt(data.category_id);
    if (data.target_amount !== undefined) updateData.target_amount = data.target_amount ? new Prisma.Decimal(data.target_amount) : null;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
    if (data.featured_image_id !== undefined) updateData.featured_image_id = data.featured_image_id ? BigInt(data.featured_image_id) : null;
    if (data.content !== undefined) updateData.content = await this.sanitizeContent(data.content);

    // Slug is immutable once active (which it always is initially). Title changes do NOT change slug.
    
    const updated = await prisma.$transaction(async (tx) => {
      const updatedCampaign = await tx.campaign.update({
        where: { id },
        data: updateData,
        include: { category: true }
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

  public async cancelCampaign(id: bigint, auditContext: { actorUserId?: bigint; ipAddress?: string }): Promise<CampaignResponse> {
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
        include: { category: true }
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
      target_amount: campaign.target_amount ? campaign.target_amount.toString() : null,
      raised_amount: campaign.raised_amount.toString(),
      status: campaign.status,
      start_date: campaign.start_date ? campaign.start_date.toISOString() : null,
      end_date: campaign.end_date ? campaign.end_date.toISOString() : null,
      content: campaign.content,
      featured_image_id: campaign.featured_image_id ? campaign.featured_image_id.toString() : null,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at
    };
  }
}

export const campaignService = new CampaignService();
