import { Request, Response, NextFunction } from 'express';
import { loginSchema, updatePasswordSchema, adminResetPasswordSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation';
import * as authService from './auth.service';
import { env } from '../../config/env';
import { prisma } from '../../config/database';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { token } = await authService.loginUser(
      validatedData.email,
      validatedData.password,
      req.ip,
      req.headers['user-agent']
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours in ms
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          action: 'LOGOUT_SUCCESS',
          entity_type: 'AUTH',
          entity_id: req.user.id,
          user_id: req.user.id,
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is guaranteed to exist due to authMiddleware
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updatePasswordSchema.parse(req.body);
    await authService.updatePassword(req.user!.id, validatedData.oldPassword, validatedData.newPassword);
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const adminResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hasManageUsers = req.user!.permissions.some(p => p.resource === 'users' && p.action === 'manage');
    if (req.user!.role.name !== 'SUPER_ADMIN' && !hasManageUsers) {
      return res.status(403).json({ status: 'error', message: 'Forbidden: Missing manage:users permission' });
    }

    const validatedData = adminResetPasswordSchema.parse(req.body);
    await authService.adminResetPassword(req.user!.id, BigInt(validatedData.userId), validatedData.newPassword);
    res.status(200).json({ status: 'success', message: 'User password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(validatedData.email);
    res.status(200).json({ status: 'success', message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(validatedData.email, validatedData.token, validatedData.newPassword);
    res.status(200).json({ status: 'success', message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

