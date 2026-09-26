import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import * as argon2 from 'argon2';

export class UserService {
  public async getUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { first_name: { contains: search } },
        { last_name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { role: true }
      })
    ]);

    // Don't send real passwords, except if explicitly needed, but let's just sanitize
    const sanitizedData = data.map(u => ({
      ...u,
      id: u.id.toString(),
      role_id: u.role_id.toString(),
      password_hash: undefined // Hide password hash
    }));

    return {
      users: sanitizedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  public async createUser(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Email already in use', 400);
    }
    
    // Default password 'password123' if not provided
    const password = data.password || 'password123';
    const hash = await argon2.hash(password);
    
    const role = await prisma.role.findUnique({ where: { name: data.role || 'ADMIN' } });
    if (!role) throw new AppError('Invalid role', 400);

    const user = await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash: hash,
        role_id: role.id,
        status: data.status || 'ACTIVE'
      },
      include: { role: true }
    });

    return {
      ...user,
      id: user.id.toString(),
      role_id: user.role_id.toString(),
      password_hash: undefined
    };
  }

  public async updateUserStatus(id: bigint, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true }
    });
    return {
      ...user,
      id: user.id.toString(),
      role_id: user.role_id.toString(),
      password_hash: undefined
    };
  }
}

export const userService = new UserService();
