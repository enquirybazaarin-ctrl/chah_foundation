import { Request, Response, NextFunction } from 'express';
import { testimonialService } from './testimonial.service';

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json({
      status: 'success',
      data: { testimonial }
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Admins can see all, public can only see published
    const isAdmin = (req as any).user && ['ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN'].includes((req as any).user.role?.name);
    const onlyPublished = !isAdmin;
    
    const testimonials = await testimonialService.getTestimonials(onlyPublished);
    res.status(200).json({
      status: 'success',
      data: { testimonials }
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const testimonial = await testimonialService.getTestimonialById(id);
    res.status(200).json({
      status: 'success',
      data: { testimonial }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const testimonial = await testimonialService.updateTestimonial(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { testimonial }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await testimonialService.deleteTestimonial(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
