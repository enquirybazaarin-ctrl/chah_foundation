import { heroSlideRepository, HeroSlideRepository } from './hero-slide.repository';
import { CreateHeroSlideInput, UpdateHeroSlideInput } from './hero-slide.types';
import { AppError } from '../../utils/errors';

export class HeroSlideService {
  constructor(private repo: HeroSlideRepository = heroSlideRepository) {}

  async getActiveSlides() {
    return this.repo.findActive();
  }

  async getAllSlides() {
    return this.repo.findAll();
  }

  async getSlideById(id: bigint) {
    const slide = await this.repo.findById(id);
    if (!slide) {
      throw new AppError('Hero slide not found', 404);
    }
    return slide;
  }

  async createSlide(data: CreateHeroSlideInput) {
    return this.repo.create(data);
  }

  async updateSlide(id: bigint, data: UpdateHeroSlideInput) {
    await this.getSlideById(id);
    return this.repo.update(id, data);
  }

  async toggleSlide(id: bigint, explicitState?: boolean) {
    const existing = await this.getSlideById(id);
    const newState = explicitState !== undefined ? explicitState : !existing.is_active;
    return this.repo.update(id, { is_active: newState });
  }

  async deleteSlide(id: bigint) {
    await this.getSlideById(id);
    return this.repo.delete(id);
  }
}

export const heroSlideService = new HeroSlideService();
