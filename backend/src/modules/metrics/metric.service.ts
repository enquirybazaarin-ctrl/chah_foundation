import { metricRepository } from './metric.repository';
import { AppError } from '../../utils/errors';
import { prisma } from '../../lib/prisma';

export class MetricService {
  async createMetric(data: any) {
    return metricRepository.create(data);
  }

  async getMetrics() {
    return metricRepository.findAll();
  }

  async getMetricById(id: bigint) {
    const metric = await metricRepository.findById(id);
    if (!metric) throw new AppError('Metric not found', 404);
    return metric;
  }

  async updateMetric(id: bigint, data: any) {
    const existing = await metricRepository.findById(id);
    if (!existing) throw new AppError('Metric not found', 404);

    return metricRepository.update(id, data);
  }

  async deleteMetric(id: bigint) {
    const existing = await metricRepository.findById(id);
    if (!existing) throw new AppError('Metric not found', 404);

    await metricRepository.delete(id);
  }

  async getSectionData() {
    const metrics = await metricRepository.findAll();
    const setting = await prisma.setting.findUnique({
      where: { setting_key: 'our_endeavour_section' }
    });

    let section = {
      badge: "OUR IMPACT",
      heading: "Our Endeavour As NGO",
      description: "At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.",
      cta_text: "Join Our Cause",
      cta_link: "/donate",
      updated_as_on: "04/10/2026"
    };

    if (setting) {
      section = JSON.parse(setting.setting_value);
    }

    return { section, metrics };
  }

  async updateSectionData(data: any) {
    const setting = await prisma.setting.upsert({
      where: { setting_key: 'our_endeavour_section' },
      update: { setting_value: JSON.stringify(data) },
      create: { setting_key: 'our_endeavour_section', setting_value: JSON.stringify(data) }
    });
    return JSON.parse(setting.setting_value);
  }
}

export const metricService = new MetricService();
