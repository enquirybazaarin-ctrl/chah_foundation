import { whatWeDoRepository, WhatWeDoRepository } from './what-we-do.repository';
import { CreateWhatWeDoCardInput, UpdateWhatWeDoCardInput, SectionSettingsInput } from './what-we-do.types';
import { AppError } from '../../utils/errors';

const INITIAL_SEEDS: CreateWhatWeDoCardInput[] = [
  {
    title: 'Nourish, Warm, Provide Essentials',
    badge: 'ESSENTIAL AID',
    icon_type: 'essentials',
    accent_color: '#1e88e5',
    description:
      'We are dedicated to assisting those in need. Our mission involves providing essential food, blankets, and groceries to vulnerable communities.',
    images: [
      'https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    ],
    cta_text: 'Know More',
    cta_link: '/campaigns?category=essentials',
    sort_order: 1,
    is_active: true,
  },
  {
    title: 'Health Oasis for All',
    badge: 'MEDICAL RELIEF',
    icon_type: 'health',
    accent_color: '#e91e63',
    description:
      'At ChahFoundation we initiate positive change by providing crucial medical support, conducting health camps, and promoting blood donation',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop',
    ],
    cta_text: 'Know More',
    cta_link: '/campaigns?category=health',
    sort_order: 2,
    is_active: true,
  },
  {
    title: 'Kids First: Education, Sanitation, Water',
    badge: 'CHILD WELFARE',
    icon_type: 'kids',
    accent_color: '#ff9800',
    description:
      'At ChahFoundation, we provide essential support for child education, clean water access, sanitation, and hygiene improvement initiatives',
    images: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
    ],
    cta_text: 'Know More',
    cta_link: '/campaigns?category=education',
    sort_order: 3,
    is_active: true,
  },
  {
    title: 'Heartfelt Rescue: Lifeline',
    badge: 'ANIMAL CARE',
    icon_type: 'animals',
    accent_color: '#4caf50',
    description:
      'We provide compassionate care, essential support, and medical treatment for animals in need, ensuring their well-being',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop',
    ],
    cta_text: 'Know More',
    cta_link: '/campaigns?category=animal-welfare',
    sort_order: 4,
    is_active: true,
  },
];

export class WhatWeDoService {
  constructor(private repo: WhatWeDoRepository = whatWeDoRepository) {}

  private async ensureInitialSeed() {
    const count = await this.repo.count();
    if (count === 0) {
      for (const item of INITIAL_SEEDS) {
        await this.repo.create(item);
      }
    }
  }

  async getPublicData() {
    await this.ensureInitialSeed();
    const [cards, section] = await Promise.all([
      this.repo.findActive(),
      this.repo.getSectionSettings(),
    ]);

    return {
      cards,
      section,
    };
  }

  async getAllCards() {
    await this.ensureInitialSeed();
    return this.repo.findAll();
  }

  async getCardById(id: bigint) {
    const card = await this.repo.findById(id);
    if (!card) {
      throw new AppError('What We Do card not found', 404);
    }
    return card;
  }

  async createCard(data: CreateWhatWeDoCardInput) {
    return this.repo.create(data);
  }

  async updateCard(id: bigint, data: UpdateWhatWeDoCardInput) {
    await this.getCardById(id);
    return this.repo.update(id, data);
  }

  async toggleCard(id: bigint, explicitState?: boolean) {
    const existing = await this.getCardById(id);
    const newState = explicitState !== undefined ? explicitState : !existing.is_active;
    return this.repo.update(id, { is_active: newState });
  }

  async deleteCard(id: bigint) {
    await this.getCardById(id);
    return this.repo.delete(id);
  }

  async getSectionSettings() {
    return this.repo.getSectionSettings();
  }

  async updateSectionSettings(settings: SectionSettingsInput) {
    return this.repo.updateSectionSettings(settings);
  }
}

export const whatWeDoService = new WhatWeDoService();
