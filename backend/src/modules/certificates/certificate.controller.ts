import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { certificateService } from './certificate.service';
import { AppError } from '../../utils/errors';

export const getCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { certificate_number: { contains: search } },
        { donation: { donor: { email: { contains: search } } } },
        { donation: { donor: { first_name: { contains: search } } } },
      ];
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where: whereClause,
        include: {
          donation: {
            include: { donor: true }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.certificate.count({ where: whereClause })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        certificates,
        meta: { total, page, limit }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const generateCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { donationId } = req.body;
    if (!donationId) {
      return next(new AppError('Donation ID is required', 400));
    }

    const certificate = await certificateService.generateCertificate(BigInt(donationId));

    res.status(200).json({
      status: 'success',
      data: certificate
    });
  } catch (err) {
    next(err);
  }
};
