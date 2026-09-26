import { Request, Response, NextFunction } from 'express';
import { campaignCategoryService } from './category.service';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await campaignCategoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await campaignCategoryService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await campaignCategoryService.getCategoryById(BigInt(req.params.id as string));
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await campaignCategoryService.updateCategory(BigInt(req.params.id as string), req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await campaignCategoryService.deleteCategory(BigInt(req.params.id as string));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
