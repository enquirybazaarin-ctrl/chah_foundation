import { Request, Response, NextFunction } from 'express';
import { donationService } from './donation.service';

export const createOfflineDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: (req as any).user?.id ? BigInt((req as any).user.id) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const donation = await donationService.createOfflineDonation(req.body, auditContext);

    res.status(201).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const createOnlineDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: (req as any).user?.id ? BigInt((req as any).user.id) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const payload = {
      ...req.body,
      idempotency_key: req.headers['idempotency-key']
    };

    const { donation, isNew } = await donationService.createOnlineDonation(payload, auditContext);

    res.status(isNew ? 201 : 200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOnlineDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: (req as any).user?.id ? BigInt((req as any).user.id) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const donation = await donationService.verifyOnlineDonation(req.body, auditContext);

    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await donationService.searchDonations(query);
    
    res.status(200).json({
      status: 'success',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donation = await donationService.getDonationById(BigInt(req.params.id as string));
    
    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const confirmDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: (req as any).user?.id ? BigInt((req as any).user.id) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const donation = await donationService.confirmDonation(BigInt(req.params.id as string), auditContext);

    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const cancelDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: (req as any).user?.id ? BigInt((req as any).user.id) : undefined,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const donation = await donationService.cancelDonation(BigInt(req.params.id as string), auditContext);

    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};
