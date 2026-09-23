import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CampaignRepository {
  public async create(data: Prisma.CampaignUncheckedCreateInput) {
    return prisma.campaign.create({
      data,
      include: { category: true }
    });
  }

  public async findById(id: bigint) {
    return prisma.campaign.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  public async findBySlug(slug: string) {
    return prisma.campaign.findUnique({
      where: { slug },
      include: { category: true }
    });
  }

  public async findAllPublic(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          status: { in: ['ACTIVE', 'COMPLETED', 'CANCELLED'] }
        },
        include: { category: true },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      prisma.campaign.count({
        where: {
          status: { in: ['ACTIVE', 'COMPLETED', 'CANCELLED'] }
        }
      })
    ]);
    return { data, total, page, limit };
  }

  public async findAllAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        include: { category: true },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      prisma.campaign.count()
    ]);
    return { data, total, page, limit };
  }

  public async update(id: bigint, data: Prisma.CampaignUncheckedUpdateInput) {
    return prisma.campaign.update({
      where: { id },
      data,
      include: { category: true }
    });
  }
}

export const campaignRepository = new CampaignRepository();
