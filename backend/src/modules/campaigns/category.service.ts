import { campaignCategoryRepository } from './category.repository';
import { CreateCampaignCategoryDTO, UpdateCampaignCategoryDTO, CampaignCategoryResponse } from './category.types';
import { AppError } from '../../utils/errors';
import { Prisma } from '@prisma/client';

// Helper to create basic slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class CampaignCategoryService {
  public async createCategory(data: CreateCampaignCategoryDTO): Promise<CampaignCategoryResponse> {
    const baseSlug = generateSlug(data.name);
    let attempts = 0;

    while (true) {
      const slug = attempts === 0 ? baseSlug : `${baseSlug}-${attempts}`;
      try {
        const category = await campaignCategoryRepository.create({
          name: data.name,
          description: data.description,
          slug
        });
        return this.mapResponse(category);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          attempts++;
          continue;
        }
        throw error;
      }
    }
  }

  public async getCategories(): Promise<CampaignCategoryResponse[]> {
    const categories = await campaignCategoryRepository.findAll();
    return categories.map(c => this.mapResponse(c));
  }

  public async getCategoryById(id: bigint): Promise<CampaignCategoryResponse> {
    const category = await campaignCategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Campaign category not found', 404);
    }
    return this.mapResponse(category);
  }

  public async updateCategory(id: bigint, data: UpdateCampaignCategoryDTO): Promise<CampaignCategoryResponse> {
    const category = await campaignCategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Campaign category not found', 404);
    }

    
    if (data.name && data.name !== category.name) {
      const baseSlug = generateSlug(data.name);
      let attempts = 0;
      let slug: string;
      while (true) {
        slug = attempts === 0 ? baseSlug : `${baseSlug}-${attempts}`;
        try {
          const updated = await campaignCategoryRepository.update(id, {
            name: data.name,
            description: data.description,
            slug
          });
          return this.mapResponse(updated);
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            attempts++;
            continue;
          }
          throw error;
        }
      }
    } else {
      const updated = await campaignCategoryRepository.update(id, {
        description: data.description !== undefined ? data.description : category.description
      });
      return this.mapResponse(updated);
    }
  }

  private mapResponse(category: any): CampaignCategoryResponse {
    return {
      id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    };
  }
}

export const campaignCategoryService = new CampaignCategoryService();
