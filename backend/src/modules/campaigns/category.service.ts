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
    // Ensure the 4 core categories always exist
    const coreCategories = [
      { name: 'Medical Emergency', slug: 'medical-emergency', description: 'Urgent medical care and treatment fundraisers' },
      { name: 'Education', slug: 'education', description: 'Child education and school essentials fundraisers' },
      { name: 'Elder Care', slug: 'elder-care', description: 'Support, shelter, and medical care for senior citizens' },
      { name: 'Food & Hunger', slug: 'food-and-hunger', description: 'Nutritious meals and hunger relief fundraisers' },
    ];

    for (const cat of coreCategories) {
      const existing = await campaignCategoryRepository.findBySlug(cat.slug);
      if (!existing) {
        try {
          await campaignCategoryRepository.create(cat);
        } catch {
          // Ignore if concurrently created
        }
      }
    }

    const categories = await campaignCategoryRepository.findAll();
    
    // Sort so core categories appear first
    const coreOrder = ['medical-emergency', 'education', 'elder-care', 'food-and-hunger'];
    categories.sort((a, b) => {
      const indexA = coreOrder.indexOf(a.slug);
      const indexB = coreOrder.indexOf(b.slug);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

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

  public async deleteCategory(id: bigint): Promise<void> {
    const category = await campaignCategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Campaign category not found', 404);
    }
    // Check if category has associated campaigns?
    // According to Prisma schema it might cascade or error.
    await campaignCategoryRepository.delete(id);
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
