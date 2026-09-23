import { AlbumRepository } from './album.repository';
import { CreateAlbumParams, UpdateAlbumParams } from './album.types';
import { AppError } from '../../utils/errors';

export class AlbumService {
  private albumRepository: AlbumRepository;

  constructor() {
    this.albumRepository = new AlbumRepository();
  }

  public async createAlbum(data: CreateAlbumParams) {
    return this.albumRepository.create(data);
  }

  public async getAlbums() {
    return this.albumRepository.findAll();
  }

  public async getAlbum(id: bigint) {
    const album = await this.albumRepository.findById(id);
    if (!album) {
      throw new AppError('Album not found', 404);
    }
    return album;
  }

  public async updateAlbum(id: bigint, data: UpdateAlbumParams) {
    await this.getAlbum(id); // Ensures it exists
    return this.albumRepository.update(id, data);
  }

  public async deleteAlbum(id: bigint) {
    await this.getAlbum(id); // Ensures it exists
    await this.albumRepository.delete(id);
    return true;
  }
}
