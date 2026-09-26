import { testimonialRepository } from './testimonial.repository';
import { AppError } from '../../utils/errors';

export class TestimonialService {
  async createTestimonial(data: any) {
    return testimonialRepository.create({
      ...data,
      avatar_image_id: data.avatar_image_id ? BigInt(data.avatar_image_id) : undefined,
    });
  }

  async getTestimonials(onlyPublished = true) {
    return testimonialRepository.findAll(onlyPublished);
  }

  async getTestimonialById(id: bigint) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError('Testimonial not found', 404);
    return testimonial;
  }

  async updateTestimonial(id: bigint, data: any) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError('Testimonial not found', 404);

    const updateData = { ...data };
    if (data.avatar_image_id !== undefined) {
      updateData.avatar_image_id = data.avatar_image_id ? BigInt(data.avatar_image_id) : null;
    }

    return testimonialRepository.update(id, updateData);
  }

  async deleteTestimonial(id: bigint) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError('Testimonial not found', 404);

    await testimonialRepository.delete(id);
  }
}

export const testimonialService = new TestimonialService();
