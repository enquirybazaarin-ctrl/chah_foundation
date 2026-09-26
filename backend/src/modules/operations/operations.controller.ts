import { Request, Response, NextFunction } from 'express';
import { operationsService } from './operations.service';

// ----------------------------------------------------
// Contact Enquiries
// ----------------------------------------------------
export const submitEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enquiry = await operationsService.submitEnquiry(req.body);
    res.status(201).json({ status: 'success', data: { enquiry } });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const status = req.query.status as string;

    const result = await operationsService.getEnquiries({ page, limit, status });
    res.status(200).json({
      status: 'success',
      data: {
        enquiries: result.enquiries,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const enquiry = await operationsService.updateEnquiryStatus(id, req.body);
    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// Newsletter
// ----------------------------------------------------
export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriber = await operationsService.subscribeNewsletter(req.body);
    res.status(200).json({ status: 'success', data: { subscriber } });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const status = req.query.status as string;

    const result = await operationsService.getSubscribers({ page, limit, status });
    res.status(200).json({
      status: 'success',
      data: {
        subscribers: result.subscribers,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriberStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email as string;
    const subscriber = await operationsService.updateSubscriberStatus(email, req.body);
    res.status(200).json({ status: 'success', data: { subscriber } });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// Settings
// ----------------------------------------------------
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is an admin
    const isAdmin = (req as any).user && ['ADMIN', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'].includes((req as any).user.role?.name);
    
    const settings = await operationsService.getSettings(isAdmin);
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (error) {
    next(error);
  }
};

export const upsertSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await operationsService.upsertSetting(req.body);
    res.status(200).json({ status: 'success', data: { setting } });
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.key as string;
    await operationsService.deleteSetting(key);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// Audit Logs
// ----------------------------------------------------
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const entity_type = req.query.entity_type as string;
    const action = req.query.action as string;

    const result = await operationsService.getAuditLogs({ page, limit, entity_type, action });
    res.status(200).json({
      status: 'success',
      data: {
        logs: result.logs,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// Form 10BE
// ----------------------------------------------------
export const getForm10BEReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await operationsService.getForm10BEReports();
    res.status(200).json({ status: 'success', data: { reports } });
  } catch (error) {
    next(error);
  }
};

export const generateForm10BE = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { financial_year } = req.body;
    const userId = (req as any).user.id;
    const report = await operationsService.generateForm10BE(financial_year, userId);
    res.status(202).json({ status: 'accepted', data: { report } });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// Bank Reconciliation
// ----------------------------------------------------
export const getReconciliationJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await operationsService.getReconciliationJobs();
    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (error) {
    next(error);
  }
};

export const uploadReconciliationFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real application, we would use multer to handle the file upload
    // For now we assume req.body.csv_content or similar is passed.
    const { csv_content, filename } = req.body;
    const userId = (req as any).user.id;
    
    if (!csv_content || !filename) {
       return res.status(400).json({ status: 'error', message: 'csv_content and filename are required' });
    }
    
    const job = await operationsService.processBankReconciliation(csv_content, filename, userId);
    res.status(202).json({ status: 'accepted', data: { job } });
  } catch (error) {
    next(error);
  }
};
