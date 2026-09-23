import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadFileOptions, UploadFileResult } from '../storage.interface';
import { env } from '../../../config/env';

export class LocalDiskStorageProvider implements StorageProvider {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    // Ensure the uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
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
