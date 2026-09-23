import { prisma } from '../../config/database';
import { CreateAlbumParams, UpdateAlbumParams } from './album.types';

export class AlbumRepository {
  public async create(data: CreateAlbumParams) {
    return prisma.album.create({
      data
    });
  }

  public async findAll() {
    return prisma.album.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  public async findById(id: bigint) {
    return prisma.album.findUnique({
      where: { id }
    });
  }

  public async update(id: bigint, data: UpdateAlbumParams) {
    return prisma.album.update({
      where: { id },
      data
    });
  }

  public async delete(id: bigint) {
    return prisma.album.delete({
      where: { id }
    });
  }
}
