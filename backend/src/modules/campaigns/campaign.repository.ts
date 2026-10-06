import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { FeaturedCampaignSectionSettings } from './campaign.types';

export class CampaignRepository {
  public async create(data: Prisma.CampaignUncheckedCreateInput) {
    return prisma.campaign.create({
      data,
      include: { category: true, featured_image: true }
    });
  }

  public async countActive() {
    return prisma.campaign.count({
      where: { status: 'ACTIVE' }
    });
  }

  public async findById(id: bigint) {
    return prisma.campaign.findUnique({
      where: { id },
      include: { category: true, featured_image: true }
    });
  }

  public async findBySlug(slug: string) {
    return prisma.campaign.findUnique({
      where: { slug },
      include: { category: true, featured_image: true }
    });
  }

  public async findAllPublic(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          status: { in: ['ACTIVE', 'COMPLETED', 'CANCELLED'] }
        },
        include: { category: true, featured_image: true },
        orderBy: [
          { is_featured: 'desc' },
          { sort_order: 'asc' },
          { created_at: 'desc' }
        ],
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

  public async findFeaturedSectionCampaigns(limit: number = 4) {
    return prisma.campaign.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: { category: true, featured_image: true },
      orderBy: [
        { is_featured: 'desc' },
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit
    });
  }

  public async findAllAdmin(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        include: { category: true, featured_image: true },
        orderBy: [
          { is_featured: 'desc' },
          { sort_order: 'asc' },
          { created_at: 'desc' }
        ],
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
      include: { category: true, featured_image: true }
    });
  }

  public async getSectionSettings(): Promise<FeaturedCampaignSectionSettings> {
    const settings = await prisma.setting.findMany({
      where: {
        setting_key: {
          in: [
            'fundraising_section_badge',
            'fundraising_section_heading',
            'fundraising_section_subheading'
          ]
        }
      }
    });

    const map = new Map(settings.map((s) => [s.setting_key, s.setting_value]));

    return {
      badge: map.get('fundraising_section_badge') ?? 'FUNDRAISING FOR EXTREME NEEDS',
      heading: map.get('fundraising_section_heading') ?? 'Help a child continue their journey of learning.',
      subheading:
        map.get('fundraising_section_subheading') ??
        'Help children access education, school essentials and the opportunities they deserve.',
    };
  }

  public async updateSectionSettings(
    settings: Partial<FeaturedCampaignSectionSettings>
  ): Promise<FeaturedCampaignSectionSettings> {
    const updates: Promise<any>[] = [];

    if (settings.badge !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'fundraising_section_badge' },
          update: { setting_value: settings.badge },
          create: { setting_key: 'fundraising_section_badge', setting_value: settings.badge },
        })
      );
    }

    if (settings.heading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'fundraising_section_heading' },
          update: { setting_value: settings.heading },
          create: { setting_key: 'fundraising_section_heading', setting_value: settings.heading },
        })
      );
    }

    if (settings.subheading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'fundraising_section_subheading' },
          update: { setting_value: settings.subheading },
          create: { setting_key: 'fundraising_section_subheading', setting_value: settings.subheading },
        })
      );
    }

    await Promise.all(updates);
    return this.getSectionSettings();
  }

  public async getMedicalSectionSettings(): Promise<FeaturedCampaignSectionSettings> {
    const settings = await prisma.setting.findMany({
      where: {
        setting_key: {
          in: [
            'medical_section_badge',
            'medical_section_heading',
            'medical_section_subheading'
          ]
        }
      }
    });

    const map = new Map(settings.map((s) => [s.setting_key, s.setting_value]));

    return {
      badge: map.get('medical_section_badge') ?? 'MEDICAL EMERGENCY CASES',
      heading: map.get('medical_section_heading') ?? 'Health cannot wait.',
      subheading:
        map.get('medical_section_subheading') ??
        'When medical emergencies happen, timely support can make all the difference. Help provide essential treatment and care to people facing critical medical needs.',
    };
  }

  public async updateMedicalSectionSettings(
    settings: Partial<FeaturedCampaignSectionSettings>
  ): Promise<FeaturedCampaignSectionSettings> {
    const updates: Promise<any>[] = [];

    if (settings.badge !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'medical_section_badge' },
          update: { setting_value: settings.badge },
          create: { setting_key: 'medical_section_badge', setting_value: settings.badge },
        })
      );
    }

    if (settings.heading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'medical_section_heading' },
          update: { setting_value: settings.heading },
          create: { setting_key: 'medical_section_heading', setting_value: settings.heading },
        })
      );
    }

    if (settings.subheading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'medical_section_subheading' },
          update: { setting_value: settings.subheading },
          create: { setting_key: 'medical_section_subheading', setting_value: settings.subheading },
        })
      );
    }

    await Promise.all(updates);
    return this.getMedicalSectionSettings();
  }

  public async findMedicalSectionCampaigns(limit: number = 4) {
    return prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        category: {
          slug: 'medical-emergency' // Assuming slug is medical-emergency
        }
      },
      include: { category: true, featured_image: true },
      orderBy: [
        { is_featured: 'desc' },
        { sort_order: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit
    });
  }
}

export const campaignRepository = new CampaignRepository();
