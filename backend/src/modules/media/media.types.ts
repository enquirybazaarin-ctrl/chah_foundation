export interface CreateMediaParams {
  album_id?: bigint | null;
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
}

export interface UpdateMediaParams {
  album_id?: bigint | null;
  alt_text?: string | null;
  caption?: string | null;
}
