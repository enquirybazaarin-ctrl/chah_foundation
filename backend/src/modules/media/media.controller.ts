import { Request, Response, NextFunction } from 'express';
import { MediaService } from './media.service';
import { AppError } from '../../utils/errors';

const mediaService = new MediaService();

export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }
    
    let albumId: bigint | undefined;
    if (req.body.album_id) {
      albumId = BigInt(req.body.album_id);
    }

    const media = await mediaService.uploadMedia(req.file, albumId);
    
    res.status(201).json({
      status: 'success',
      data: {
        media: {
          ...media,
          id: media.id.toString(),
          album_id: media.album_id?.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let albumId: bigint | undefined;
    if (req.query.album_id) {
      albumId = BigInt(req.query.album_id as string);
    }

    const mediaList = await mediaService.getMediaList(albumId);
    
    res.status(200).json({
      status: 'success',
      data: {
        media: mediaList.map(m => ({
          ...m,
          id: m.id.toString(),
          album_id: m.album_id?.toString()
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const media = await mediaService.getMedia(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        media: {
          ...media,
          id: media.id.toString(),
          album_id: media.album_id?.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const media = await mediaService.updateMedia(id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: {
        media: {
          ...media,
          id: media.id.toString(),
          album_id: media.album_id?.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await mediaService.deleteMedia(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
