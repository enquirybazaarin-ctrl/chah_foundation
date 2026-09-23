import { Request, Response, NextFunction } from 'express';
import { campaignService } from './campaign.service';

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: req.user?.id ? BigInt(req.user.id) : undefined,
      ipAddress: req.ip
    };
    const campaign = await campaignService.createCampaign(req.body, auditContext);
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const getCampaignsPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await campaignService.getCampaignsPublic(page, limit);
    // Hide content in lists to save bandwidth
    const listData = result.data.map(({ content: _content, ...rest }) => rest);
    res.status(200).json({ success: true, data: listData, meta: { total: result.total, page, limit } });
  } catch (error) {
    next(error);
  }
};

export const getCampaignsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await campaignService.getCampaignsAdmin(page, limit);
    const listData = result.data.map(({ content: _content, ...rest }) => rest);
    res.status(200).json({ success: true, data: listData, meta: { total: result.total, page, limit } });
  } catch (error) {
    next(error);
  }
};

export const getCampaignBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaign = await campaignService.getCampaignBySlug(req.params.slug as string);
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaign = await campaignService.getCampaignById(BigInt(req.params.id as string));
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: req.user?.id ? BigInt(req.user.id) : undefined,
      ipAddress: req.ip
    };
    const campaign = await campaignService.updateCampaign(BigInt(req.params.id as string), req.body, auditContext);
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const cancelCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: req.user?.id ? BigInt(req.user.id) : undefined,
      ipAddress: req.ip
    };
    const campaign = await campaignService.cancelCampaign(BigInt(req.params.id as string), auditContext);
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};
