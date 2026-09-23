import { Request, Response, NextFunction } from 'express';
import { AlbumService } from './album.service';

const albumService = new AlbumService();

export const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await albumService.createAlbum(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        album: {
          ...album,
          id: album.id.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await albumService.getAlbums();
    res.status(200).json({
      status: 'success',
      data: {
        albums: albums.map(a => ({
          ...a,
          id: a.id.toString()
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const album = await albumService.getAlbum(id);
    res.status(200).json({
      status: 'success',
      data: {
        album: {
          ...album,
          id: album.id.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const album = await albumService.updateAlbum(id, req.body);
    res.status(200).json({
      status: 'success',
      data: {
        album: {
          ...album,
          id: album.id.toString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await albumService.deleteAlbum(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
