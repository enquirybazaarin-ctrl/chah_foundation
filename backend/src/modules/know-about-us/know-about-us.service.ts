import { knowAboutUsRepository } from './know-about-us.repository';
import { KnowAboutUsData, UpdateKnowAboutUsInput } from './know-about-us.types';

export class KnowAboutUsService {
  async getData(): Promise<KnowAboutUsData> {
    return knowAboutUsRepository.getData();
  }

  async updateData(input: UpdateKnowAboutUsInput): Promise<KnowAboutUsData> {
    return knowAboutUsRepository.updateData(input);
  }

  async addImage(imageUrl: string): Promise<KnowAboutUsData> {
    return knowAboutUsRepository.addImage(imageUrl);
  }

  async deleteImage(imageIndex: number): Promise<KnowAboutUsData> {
    return knowAboutUsRepository.deleteImage(imageIndex);
  }
}

export const knowAboutUsService = new KnowAboutUsService();
