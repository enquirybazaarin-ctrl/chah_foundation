import { prisma } from '../../config/database';


export class CampaignCategoryRepository {
  public async create(data: { name: string; slug: string; description?: string | null }) {
    return prisma.campaignCategory.create({
      data
    });
  }

  public async findById(id: bigint) {
    return prisma.campaignCategory.findUnique({
      where: { id }
    });
  }

  public async findBySlug(slug: string) {
    return prisma.campaignCategory.findUnique({
      where: { slug }
    });
  }

  public async findAll() {
    return prisma.campaignCategory.findMany({
      orderBy: { name: 'asc' }
    });
  }

  public async update(id: bigint, data: { name?: string; slug?: string; description?: string | null }) {
    return prisma.campaignCategory.update({
      where: { id },
      data
    });
  }
}

export const campaignCategoryRepository = new CampaignCategoryRepository();
