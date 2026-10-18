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

export const getFeaturedSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await campaignService.getFeaturedSectionData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateFeaturedSectionSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await campaignService.updateFeaturedSectionSettings(req.body);
    res.status(200).json({ success: true, data: { section } });
  } catch (error) {
    next(error);
  }
};

export const getMedicalSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await campaignService.getMedicalSectionData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateMedicalSectionSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await campaignService.updateMedicalSectionSettings(req.body);
    res.status(200).json({ success: true, data: { section } });
  } catch (error) {
    next(error);
  }
};

export const getEldercareSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await campaignService.getCategorySectionData('eldercare', 'ELDER CARE', 'Support the elderly in their twilight years.', 'Help us provide food, medical care, and a dignified life to the elderly.', 'elder-care');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateEldercareSectionSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await campaignService.updateCategorySectionSettings('eldercare', req.body);
    res.status(200).json({ success: true, data: { section } });
  } catch (error) {
    next(error);
  }
};

export const getFoodSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await campaignService.getCategorySectionData('food', 'FOOD & HUNGER', 'Fight hunger, save lives.', 'Your contribution can help provide nutritious meals to those struggling with hunger.', 'food-and-hunger');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateFoodSectionSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await campaignService.updateCategorySectionSettings('food', req.body);
    res.status(200).json({ success: true, data: { section } });
  } catch (error) {
    next(error);
  }
};

export const getCampaignSupporters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const supporters = await campaignService.getCampaignSupporters(BigInt(req.params.id as string), limit);
    res.status(200).json({ success: true, data: supporters });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditContext = {
      actorUserId: req.user?.id ? BigInt(req.user.id) : undefined,
      ipAddress: req.ip
    };
    await campaignService.deleteCampaign(BigInt(req.params.id as string), auditContext);
    res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    next(error);
  }
};
