import { metricRepository } from './metric.repository';
import { AppError } from '../../utils/errors';

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
}

export const metricService = new MetricService();
