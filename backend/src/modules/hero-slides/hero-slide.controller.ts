import { Request, Response, NextFunction } from 'express';
import { heroSlideService } from './hero-slide.service';

export const getActiveSlides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slides = await heroSlideService.getActiveSlides();
    res.status(200).json({
      status: 'success',
      data: { slides },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSlides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slides = await heroSlideService.getAllSlides();
    res.status(200).json({
      status: 'success',
      data: { slides },
    });
  } catch (error) {
    next(error);
  }
};

export const getSlideById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const slide = await heroSlideService.getSlideById(id);
    res.status(200).json({
      status: 'success',
      data: { slide },
    });
  } catch (error) {
    next(error);
  }
};

export const createSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slide = await heroSlideService.createSlide(req.body);
    res.status(201).json({
      status: 'success',
      data: { slide },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const slide = await heroSlideService.updateSlide(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { slide },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const slide = await heroSlideService.toggleSlide(id, req.body?.is_active);
    res.status(200).json({
      status: 'success',
      data: { slide },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await heroSlideService.deleteSlide(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
