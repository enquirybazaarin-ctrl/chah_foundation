export interface UploadFileOptions {
  filename: string;
  buffer: Buffer;
  mimetype: string;
}

export interface UploadFileResult {
  url: string;
  filename: string;
  size: number;
}

export interface StorageProvider {
  uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  deleteFile(filename: string): Promise<boolean>;
  getFileUrl(filename: string): string;
}
