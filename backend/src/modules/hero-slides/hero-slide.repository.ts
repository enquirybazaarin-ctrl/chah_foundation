import { prisma } from '../../config/database';
import { CreateHeroSlideInput, UpdateHeroSlideInput } from './hero-slide.types';

export class HeroSlideRepository {
  async findActive() {
    return prisma.heroSlide.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
      include: { media: true },
    });
  }

  async findAll() {
    return prisma.heroSlide.findMany({
      orderBy: { sort_order: 'asc' },
      include: { media: true },
    });
  }

  async findById(id: bigint) {
    return prisma.heroSlide.findUnique({
      where: { id },
      include: { media: true },
    });
  }

  async create(data: CreateHeroSlideInput) {
    return prisma.heroSlide.create({
      data: {
        tag: data.tag,
        title: data.title,
        highlight: data.highlight,
        description: data.description,
        image_url: data.image_url,
        media_id: data.media_id ? BigInt(data.media_id) : undefined,
        primary_button_text: data.primary_button_text,
        primary_button_url: data.primary_button_url,
        secondary_button_text: data.secondary_button_text,
        secondary_button_url: data.secondary_button_url,
        sort_order: data.sort_order ?? 0,
        is_active: data.is_active ?? true,
      },
      include: { media: true },
    });
  }

  async update(id: bigint, data: UpdateHeroSlideInput) {
    const updateData: any = { ...data };
    if (data.media_id !== undefined) {
      updateData.media_id = data.media_id ? BigInt(data.media_id) : null;
    }
    return prisma.heroSlide.update({
      where: { id },
      data: updateData,
      include: { media: true },
    });
  }

  async delete(id: bigint) {
    return prisma.heroSlide.delete({
      where: { id },
    });
  }
}

export const heroSlideRepository = new HeroSlideRepository();
