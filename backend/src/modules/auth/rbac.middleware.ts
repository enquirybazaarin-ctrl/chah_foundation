import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors';

export const requirePermission = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const hasPermission = req.user.permissions.some(
      p => p.action === action && p.resource === resource
    );

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};
