import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadFileOptions, UploadFileResult } from '../storage.interface';
import { env } from '../../../config/env';

export function getStorageDirectory(): string {
  let targetDir = process.env.STORAGE_DIR || path.join(process.cwd(), 'uploads');
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  } catch (err) {
    console.warn(`Could not initialize STORAGE_DIR "${targetDir}". Falling back to default "./uploads":`, err);
    targetDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(targetDir)) {
      try { fs.mkdirSync(targetDir, { recursive: true }); } catch (_) {}
    }
    return targetDir;
  }
}

export class LocalDiskStorageProvider implements StorageProvider {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = getStorageDirectory();
    
    // Configurable base URL (e.g. http://localhost:8080/media)
    // Default to /media for relative paths
    this.baseUrl = env.STORAGE_BASE_URL || '/media'; 
  }

  public async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const filePath = path.join(this.uploadDir, options.filename);
    
    // Write the buffer to disk
    await fs.promises.writeFile(filePath, options.buffer);

    return {
      url: this.getFileUrl(options.filename),
      filename: options.filename,
      size: options.buffer.length,
    };
  }

  public async deleteFile(filename: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete local file ${filename}:`, error);
      return false;
    }
  }

  public getFileUrl(filename: string): string {
    return `${this.baseUrl}/${filename}`;
  }
}
