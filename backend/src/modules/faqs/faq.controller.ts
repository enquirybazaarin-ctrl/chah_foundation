import { Request, Response, NextFunction } from 'express';
import { faqService } from './faq.service';

export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faq = await faqService.createFaq(req.body);
    res.status(201).json({
      status: 'success',
      data: { faq }
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = (req as any).user && ['ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN'].includes((req as any).user.role?.name);
    const onlyPublished = !isAdmin;
    const category = req.query.category as string | undefined;
    
    const faqs = await faqService.getFaqs(onlyPublished, category);
    res.status(200).json({
      status: 'success',
      data: { faqs }
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const faq = await faqService.getFaqById(id);
    res.status(200).json({
      status: 'success',
      data: { faq }
    });
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const faq = await faqService.updateFaq(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { faq }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await faqService.deleteFaq(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
