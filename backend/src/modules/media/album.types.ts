export interface CreateAlbumParams {
  name: string;
  description?: string | null;
}

export interface UpdateAlbumParams {
  name?: string;
  description?: string | null;
}
