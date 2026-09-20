import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import * as authService from './auth.service';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch {
      return next(new AppError('Invalid or expired token', 401));
    }

    if (!decoded.id) {
      return next(new AppError('Invalid token payload', 401));
    }

    // Convert decoded.id back to BigInt
    const userId = BigInt(decoded.id);

    const currentUser = await authService.getCurrentUser(userId);

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists or is inactive.', 401));
    }

    // Attach user to request context
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
