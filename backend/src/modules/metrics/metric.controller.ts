import { Request, Response, NextFunction } from 'express';
import { metricService } from './metric.service';

export const createMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metric = await metricService.createMetric(req.body);
    res.status(201).json({
      status: 'success',
      data: { metric }
    });
  } catch (error) {
    next(error);
  }
};

export const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await metricService.getMetrics();
    res.status(200).json({
      status: 'success',
      data: { metrics }
    });
  } catch (error) {
    next(error);
  }
};

export const getMetricById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const metric = await metricService.getMetricById(id);
    res.status(200).json({
      status: 'success',
      data: { metric }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const metric = await metricService.updateMetric(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { metric }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await metricService.deleteMetric(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
