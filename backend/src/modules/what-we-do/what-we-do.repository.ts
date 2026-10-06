import { prisma } from '../../config/database';
import { CreateWhatWeDoCardInput, UpdateWhatWeDoCardInput, SectionSettingsInput } from './what-we-do.types';
import { Prisma } from '@prisma/client';

export class WhatWeDoRepository {
  async findActive() {
    return prisma.whatWeDoCard.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
  }

  async findAll() {
    return prisma.whatWeDoCard.findMany({
      orderBy: { sort_order: 'asc' },
    });
  }

  async count() {
    return prisma.whatWeDoCard.count();
  }

  async findById(id: bigint) {
    return prisma.whatWeDoCard.findUnique({
      where: { id },
    });
  }

  async create(data: CreateWhatWeDoCardInput) {
    return prisma.whatWeDoCard.create({
      data: {
        title: data.title,
        badge: data.badge,
        icon_type: data.icon_type ?? 'essentials',
        accent_color: data.accent_color ?? '#53b34b',
        description: data.description,
        images: data.images as Prisma.InputJsonValue,
        cta_text: data.cta_text ?? 'Know More',
        cta_link: data.cta_link ?? '/about',
        sort_order: data.sort_order ?? 0,
        is_active: data.is_active ?? true,
      },
    });
  }

  async update(id: bigint, data: UpdateWhatWeDoCardInput) {
    const updateData: Prisma.WhatWeDoCardUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.icon_type !== undefined) updateData.icon_type = data.icon_type;
    if (data.accent_color !== undefined) updateData.accent_color = data.accent_color;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.images !== undefined) updateData.images = data.images as Prisma.InputJsonValue;
    if (data.cta_text !== undefined) updateData.cta_text = data.cta_text;
    if (data.cta_link !== undefined) updateData.cta_link = data.cta_link;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return prisma.whatWeDoCard.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: bigint) {
    return prisma.whatWeDoCard.delete({
      where: { id },
    });
  }

  async getSectionSettings(): Promise<SectionSettingsInput> {
    const settings = await prisma.setting.findMany({
      where: {
        setting_key: {
          in: ['what_we_do_badge', 'what_we_do_heading', 'what_we_do_subheading'],
        },
      },
    });

    const map = new Map(settings.map((s) => [s.setting_key, s.setting_value]));

    return {
      badge: map.get('what_we_do_badge') ?? 'WHAT WE DO',
      heading: map.get('what_we_do_heading') ?? 'Supporting Citizens in Need Our National Commitment',
      subheading:
        map.get('what_we_do_subheading') ??
        'We strive to do good for all, addressing the diverse needs of people, fostering positive change and lasting impact.',
    };
  }

  async updateSectionSettings(settings: SectionSettingsInput): Promise<SectionSettingsInput> {
    const updates: Promise<any>[] = [];

    if (settings.badge !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'what_we_do_badge' },
          update: { setting_value: settings.badge },
          create: { setting_key: 'what_we_do_badge', setting_value: settings.badge },
        })
      );
    }

    if (settings.heading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'what_we_do_heading' },
          update: { setting_value: settings.heading },
          create: { setting_key: 'what_we_do_heading', setting_value: settings.heading },
        })
      );
    }

    if (settings.subheading !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { setting_key: 'what_we_do_subheading' },
          update: { setting_value: settings.subheading },
          create: { setting_key: 'what_we_do_subheading', setting_value: settings.subheading },
        })
      );
    }

    await Promise.all(updates);
    return this.getSectionSettings();
  }
}

export const whatWeDoRepository = new WhatWeDoRepository();
