import { faqRepository } from './faq.repository';
import { AppError } from '../../utils/errors';

export class FaqService {
  async createFaq(data: any) {
    return faqRepository.create(data);
  }

  async getFaqs(onlyPublished = true, category?: string) {
    return faqRepository.findAll(onlyPublished, category);
  }

  async getFaqById(id: bigint) {
    const faq = await faqRepository.findById(id);
    if (!faq) throw new AppError('FAQ not found', 404);
    return faq;
  }

  async updateFaq(id: bigint, data: any) {
    const existing = await faqRepository.findById(id);
    if (!existing) throw new AppError('FAQ not found', 404);

    return faqRepository.update(id, data);
  }

  async deleteFaq(id: bigint) {
    const existing = await faqRepository.findById(id);
    if (!existing) throw new AppError('FAQ not found', 404);

    await faqRepository.delete(id);
  }
}

export const faqService = new FaqService();
