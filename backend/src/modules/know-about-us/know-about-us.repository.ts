import { prisma } from '../../config/database';
import { KnowAboutUsData, UpdateKnowAboutUsInput } from './know-about-us.types';

export const DEFAULT_KNOW_ABOUT_US_DATA: KnowAboutUsData = {
  badge: 'Know About Us',
  heading: 'About Us',
  heading_highlight: 'Us',
  subheading: 'We are a registered non-profit dedicated to educating, feeding, and empowering underprivileged children in Varanasi and rural Uttar-pradesh.',
  body: "Since 2015, we've transformed over 50,000 lives through free education, daily meals, healthcare, and skill training. Discover the profound impact of our initiatives spanning education, healthcare, and empowerment, as we tirelessly work towards creating a brighter future for those in need.",
  quote: 'Every child deserves hope. Every smile matters.',
  primary_button_text: 'Support Our Mission',
  primary_button_url: '/campaigns',
  secondary_button_text: 'Learn More',
  secondary_button_url: '/about',
  images: [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop'
  ],
};

const SETTING_KEY = 'know_about_us_data';

export class KnowAboutUsRepository {
  async getData(): Promise<KnowAboutUsData> {
    const setting = await prisma.setting.findUnique({
      where: { setting_key: SETTING_KEY },
    });

    if (!setting) {
      return DEFAULT_KNOW_ABOUT_US_DATA;
    }

    try {
      const parsed = JSON.parse(setting.setting_value) as Partial<KnowAboutUsData>;
      return {
        ...DEFAULT_KNOW_ABOUT_US_DATA,
        ...parsed,
        images: Array.isArray(parsed.images) && parsed.images.length > 0 ? parsed.images : DEFAULT_KNOW_ABOUT_US_DATA.images,
      };
    } catch {
      return DEFAULT_KNOW_ABOUT_US_DATA;
    }
  }

  async updateData(input: UpdateKnowAboutUsInput): Promise<KnowAboutUsData> {
    const current = await this.getData();
    const updated: KnowAboutUsData = {
      badge: input.badge !== undefined ? input.badge : current.badge,
      heading: input.heading !== undefined ? input.heading : current.heading,
      heading_highlight: input.heading_highlight !== undefined ? input.heading_highlight : current.heading_highlight,
      subheading: input.subheading !== undefined ? input.subheading : current.subheading,
      body: input.body !== undefined ? input.body : current.body,
      quote: input.quote !== undefined ? input.quote : current.quote,
      primary_button_text: input.primary_button_text !== undefined ? input.primary_button_text : current.primary_button_text,
      primary_button_url: input.primary_button_url !== undefined ? input.primary_button_url : current.primary_button_url,
      secondary_button_text: input.secondary_button_text !== undefined ? input.secondary_button_text : current.secondary_button_text,
      secondary_button_url: input.secondary_button_url !== undefined ? input.secondary_button_url : current.secondary_button_url,
      images: input.images !== undefined ? input.images : current.images,
    };

    await prisma.setting.upsert({
      where: { setting_key: SETTING_KEY },
      update: { setting_value: JSON.stringify(updated) },
      create: { setting_key: SETTING_KEY, setting_value: JSON.stringify(updated) },
    });

    return updated;
  }

  async addImage(imageUrl: string): Promise<KnowAboutUsData> {
    const current = await this.getData();
    const updatedImages = [...current.images, imageUrl];
    return this.updateData({ images: updatedImages });
  }

  async deleteImage(imageIndex: number): Promise<KnowAboutUsData> {
    const current = await this.getData();
    if (imageIndex < 0 || imageIndex >= current.images.length) {
      return current;
    }
    const updatedImages = current.images.filter((_, idx) => idx !== imageIndex);
    return this.updateData({ images: updatedImages });
  }
}

export const knowAboutUsRepository = new KnowAboutUsRepository();
