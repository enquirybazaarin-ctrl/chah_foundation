import { Request, Response, NextFunction } from 'express';
import { donorService } from './donor.service';

export const createDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    const result = await donorService.createDonor(req.body, auditContext);

    // Minimal public response vs Admin response
    // Actually we can just return success and the minimal donor data (with masked PAN).
    // The public client won't know if it's new or existing. 
    res.status(201).json({
      status: 'success',
      data: result.donor
    });
  } catch (error) {
    next(error);
  }
};

export const getDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await donorService.getDonors(req.query as any);
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getDonorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donorId = BigInt(req.params.id as string);
    const donor = await donorService.getDonorById(donorId);
    res.status(200).json({
      status: 'success',
      data: donor
    });
  } catch (error) {
    // If BigInt conversion fails, it will be caught and can be a 400 or 500.
    next(error);
  }
};

export const updateDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donorId = BigInt(req.params.id as string);
    const auditContext = {
      actorUserId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    const donor = await donorService.updateDonor(donorId, req.body, auditContext);
    res.status(200).json({
      status: 'success',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

export const getDonorDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donorId = BigInt(req.params.id as string);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
    const result = await donorService.getDonorDonations(donorId, page, limit);
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getDuplicateSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    
    const result = await donorService.getDuplicateSuggestions(page, limit);
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const resolveDuplicateSuggestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const { action } = req.body; // 'merge' or 'ignore'
    
    const auditContext = {
      actorUserId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    const suggestion = await donorService.resolveDuplicateSuggestion(id, action, auditContext);
    res.status(200).json({
      status: 'success',
      data: suggestion
    });
  } catch (error) {
    next(error);
  }
};
