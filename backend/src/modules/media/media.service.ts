import { MediaRepository } from './media.repository';
import { CreateMediaParams, UpdateMediaParams } from './media.types';
import { AppError } from '../../utils/errors';
import { StorageProvider } from '../../services/storage/storage.interface';
import { LocalDiskStorageProvider } from '../../services/storage/providers/local-disk.provider';
import sizeOf from 'image-size';
import crypto from 'crypto';
import path from 'path';

export class MediaService {
  private mediaRepository: MediaRepository;
  private storageProvider: StorageProvider;

  constructor() {
    this.mediaRepository = new MediaRepository();
    // Defaulting to local disk for now. Can be injected or factory-created later.
    this.storageProvider = new LocalDiskStorageProvider();
  }

  public async uploadMedia(file: Express.Multer.File, albumId?: bigint) {
    if (!file) {
      throw new AppError('No file provided', 400);
    }

    // Determine dimensions if it's an image
    let width: number | null = null;
    let height: number | null = null;
    
    if (file.mimetype.startsWith('image/')) {
      try {
        const dimensions = sizeOf(file.buffer);
        if (dimensions.width && dimensions.height) {
          width = dimensions.width;
          height = dimensions.height;
        }
      } catch (err) {
        console.warn('Could not determine image dimensions', err);
        // We do not fail the upload if image-size fails to parse it, unless we strictly want to
      }
    }

    // Generate secure random filename to prevent collisions and malicious names
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomUUID() + ext;

    // Upload to storage provider
    const uploadResult = await this.storageProvider.uploadFile({
      filename: randomName,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    // Save metadata to DB
    const mediaData: CreateMediaParams = {
      album_id: albumId,
      filename: uploadResult.filename,
      url: uploadResult.url,
      mime_type: file.mimetype,
      file_size: uploadResult.size,
      width,
      height,
    };

    return this.mediaRepository.create(mediaData);
  }

  public async getMediaList(albumId?: bigint) {
    return this.mediaRepository.findAll({ album_id: albumId });
  }

  public async getMedia(id: bigint) {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new AppError('Media not found', 404);
    }
    return media;
  }

  public async updateMedia(id: bigint, data: UpdateMediaParams) {
    await this.getMedia(id); // Ensures it exists
    return this.mediaRepository.update(id, data);
  }

  public async deleteMedia(id: bigint) {
    const media = await this.getMedia(id);
    
    // Attempt to delete the physical file
    await this.storageProvider.deleteFile(media.filename);

    // Delete database record
    await this.mediaRepository.delete(id);
    return true;
  }
}
