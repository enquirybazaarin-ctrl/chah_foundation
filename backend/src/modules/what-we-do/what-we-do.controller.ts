import { Request, Response, NextFunction } from 'express';
import { whatWeDoService } from './what-we-do.service';

export const getPublicData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await whatWeDoService.getPublicData();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await whatWeDoService.getAllCards();
    const section = await whatWeDoService.getSectionSettings();
    res.status(200).json({
      status: 'success',
      data: { cards, section },
    });
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const card = await whatWeDoService.getCardById(id);
    res.status(200).json({
      status: 'success',
      data: { card },
    });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await whatWeDoService.createCard(req.body);
    res.status(201).json({
      status: 'success',
      data: { card },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const card = await whatWeDoService.updateCard(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { card },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const card = await whatWeDoService.toggleCard(id, req.body?.is_active);
    res.status(200).json({
      status: 'success',
      data: { card },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await whatWeDoService.deleteCard(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateSectionSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await whatWeDoService.updateSectionSettings(req.body);
    res.status(200).json({
      status: 'success',
      data: { section },
    });
  } catch (error) {
    next(error);
  }
};
