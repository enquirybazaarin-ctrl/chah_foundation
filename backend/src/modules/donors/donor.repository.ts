import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { CreateDonorDTO, DonorSearchQuery, PrismaClientOrTransaction, UpdateDonorDTO } from './donor.types';

export class DonorRepository {
  public async create(tx: PrismaClientOrTransaction, data: CreateDonorDTO & { donor_number: string }) {
    return tx.donor.create({
      data
    });
  }

  public async findById(id: bigint, tx: PrismaClientOrTransaction = prisma) {
    return tx.donor.findUnique({
      where: { id }
    });
  }

  public async findByEmail(email: string, tx: PrismaClientOrTransaction = prisma) {
    // Return first match since email is non-unique but we use it for matching
    return tx.donor.findFirst({
      where: { email },
      orderBy: { created_at: 'asc' }
    });
  }

  public async findByPhone(phone: string, tx: PrismaClientOrTransaction = prisma) {
    return tx.donor.findFirst({
      where: { phone },
      orderBy: { created_at: 'asc' }
    });
  }

  public async update(id: bigint, data: UpdateDonorDTO, tx: PrismaClientOrTransaction = prisma) {
    return tx.donor.update({
      where: { id },
      data
    });
  }

  public async search(query: DonorSearchQuery) {
    const { search, status } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DonorWhereInput = {};
    
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { donor_number: { contains: search } },
        { first_name: { contains: search } },
        { last_name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.donor.count({ where }),
      prisma.donor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          donations: {
            where: { status: 'SUCCESS' },
            select: { amount: true }
          }
        }
      })
    ]);

    return {
      data,
      total
    };
  }

  public async findDonations(donorId: bigint, page: any = 1, limit: any = 10) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.DonationWhereInput = {
      donor_id: donorId
    };

    const [total, data] = await prisma.$transaction([
      prisma.donation.count({ where }),
      prisma.donation.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { created_at: 'desc' }
      })
    ]);

    return {
      data,
      total
    };
  }
}

export const donorRepository = new DonorRepository();
