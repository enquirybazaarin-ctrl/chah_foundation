import { prisma } from '../../config/database';

export class FaqRepository {
  async create(data: any) {
    return prisma.faq.create({
      data
    });
  }

  async findAll(onlyPublished = true, category?: string) {
    const where: any = {};
    if (onlyPublished) where.is_published = true;
    if (category) where.category = category;

    return prisma.faq.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id: bigint) {
    return prisma.faq.findUnique({
      where: { id }
    });
  }

  async update(id: bigint, data: any) {
    return prisma.faq.update({
      where: { id },
      data
    });
  }

  async delete(id: bigint) {
    return prisma.faq.delete({
      where: { id }
    });
  }
}

export const faqRepository = new FaqRepository();
