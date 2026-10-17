import { Request, Response, NextFunction } from 'express';
import { knowAboutUsService } from './know-about-us.service';

export async function getData(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await knowAboutUsService.getData();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateData(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await knowAboutUsService.updateData(req.body);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function addImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { image_url } = req.body;
    const data = await knowAboutUsService.addImage(image_url);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { index } = req.body;
    const data = await knowAboutUsService.deleteImage(Number(index));
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}
