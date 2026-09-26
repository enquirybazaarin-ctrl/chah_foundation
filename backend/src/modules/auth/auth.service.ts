import { prisma } from '../../config/database';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import { AuthenticatedUser } from './auth.types';

export const loginUser = async (email: string, password: string, ip?: string, userAgent?: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    // Audit failed login attempt for unknown user
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN_FAILED',
        entity_type: 'AUTH',
        entity_id: 0,
        ip_address: ip,
        user_agent: userAgent,
        new_values: { reason: 'Unknown user', email: normalizedEmail }
      }
    });
    throw new AppError('Invalid email or password', 401);
  }

  const isValid = await argon2.verify(user.password_hash, password);

  if (!isValid) {
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN_FAILED',
        entity_type: 'AUTH',
        entity_id: user.id,
        user_id: user.id,
        ip_address: ip,
        user_agent: userAgent,
        new_values: { reason: 'Invalid password' }
      }
    });
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'ACTIVE') {
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN_DENIED',
        entity_type: 'AUTH',
        entity_id: user.id,
        user_id: user.id,
        ip_address: ip,
        user_agent: userAgent,
        new_values: { reason: `User status is ${user.status}` }
      }
    });
    throw new AppError('Invalid email or password', 401); // Generic error
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id.toString() }, // BigInt cannot be serialized directly by jwt, store as string
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  await prisma.auditLog.create({
    data: {
      action: 'LOGIN_SUCCESS',
      entity_type: 'AUTH',
      entity_id: user.id,
      user_id: user.id,
      ip_address: ip,
      user_agent: userAgent
    }
  });

  return { token };
};

export const getCurrentUser = async (userId: bigint): Promise<AuthenticatedUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!user || user.status !== 'ACTIVE') return null;

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    role: {
      id: user.role.id,
      name: user.role.name
    },
    permissions: user.role.permissions.map(rp => ({
      action: rp.permission.action,
      resource: rp.permission.resource
    }))
  };
};

export const updatePassword = async (userId: bigint, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const isValid = await argon2.verify(user.password_hash, oldPassword);
  if (!isValid) throw new AppError('Invalid old password', 400);

  const newHash = await argon2.hash(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password_hash: newHash } });
};

export const adminResetPassword = async (adminId: bigint, targetUserId: bigint, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError('User not found', 404);

  const newHash = await argon2.hash(newPassword);
  await prisma.user.update({ where: { id: targetUserId }, data: { password_hash: newHash } });
  
  await prisma.auditLog.create({
    data: {
      action: 'ADMIN_PASSWORD_RESET',
      entity_type: 'AUTH',
      entity_id: targetUserId,
      user_id: adminId,
      new_values: { targetUserId: targetUserId.toString() }
    }
  });
};

export const forgotPassword = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  
  if (!user) {
    // Return success to prevent email enumeration
    return;
  }

  // Token is valid for 15 minutes and tied to current password hash
  const secret = env.JWT_SECRET + user.password_hash;
  const token = jwt.sign({ id: user.id.toString(), email: user.email }, secret, { expiresIn: '15m' });

  // In production this would send via MSG91
  console.log(`\n======================================================`);
  console.log(`[FORGOT PASSWORD] Reset Link generated for ${user.email}`);
  console.log(`Link: ${env.ADMIN_CORS_ORIGIN}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`);
  console.log(`======================================================\n`);
};

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw new AppError('Invalid token or email', 400);

  const secret = env.JWT_SECRET + user.password_hash;
  try {
    jwt.verify(token, secret);
  } catch (err) {
    throw new AppError('Invalid or expired token', 400);
  }

  const newHash = await argon2.hash(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { password_hash: newHash } });
};
