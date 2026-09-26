import { prisma } from '../../config/database';

export class MetricRepository {
  async create(data: any) {
    return prisma.impactMetric.create({
      data
    });
  }

  async findAll() {
    return prisma.impactMetric.findMany({
      orderBy: { created_at: 'asc' }
    });
  }

  async findById(id: bigint) {
    return prisma.impactMetric.findUnique({
      where: { id }
    });
  }

  async update(id: bigint, data: any) {
    return prisma.impactMetric.update({
      where: { id },
      data
    });
  }

  async delete(id: bigint) {
    return prisma.impactMetric.delete({
      where: { id }
    });
  }
}

export const metricRepository = new MetricRepository();
