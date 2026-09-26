import { prisma } from '../../config/database';

export class TestimonialRepository {
  async create(data: any) {
    return prisma.testimonial.create({
      data,
      include: { avatar_image: true }
    });
  }

  async findAll(onlyPublished = true) {
    return prisma.testimonial.findMany({
      where: onlyPublished ? { is_published: true } : undefined,
      orderBy: { created_at: 'desc' },
      include: { avatar_image: true }
    });
  }

  async findById(id: bigint) {
    return prisma.testimonial.findUnique({
      where: { id },
      include: { avatar_image: true }
    });
  }

  async update(id: bigint, data: any) {
    return prisma.testimonial.update({
      where: { id },
      data,
      include: { avatar_image: true }
    });
  }

  async delete(id: bigint) {
    return prisma.testimonial.delete({
      where: { id }
    });
  }
}

export const testimonialRepository = new TestimonialRepository();
