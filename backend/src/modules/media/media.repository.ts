import { prisma } from '../../config/database';
import { CreateMediaParams, UpdateMediaParams } from './media.types';
import { Prisma } from '@prisma/client';

export class MediaRepository {
  public async create(data: CreateMediaParams) {
    return prisma.media.create({
      data
    });
  }

  public async findAll(filter?: { album_id?: bigint }) {
    const where: Prisma.MediaWhereInput = {};
    if (filter?.album_id) {
      where.album_id = filter.album_id;
    }

    return prisma.media.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
  }

  public async findById(id: bigint) {
    return prisma.media.findUnique({
      where: { id }
    });
  }

  public async update(id: bigint, data: UpdateMediaParams) {
    return prisma.media.update({
      where: { id },
      data
    });
  }

  public async delete(id: bigint) {
    return prisma.media.delete({
      where: { id }
    });
  }
}
