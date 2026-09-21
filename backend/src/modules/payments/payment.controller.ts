import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service';

export const handleRazorpayWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const eventIdHeader = req.headers['x-razorpay-event-id'] as string | undefined;

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    const auditContext = {
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const result = await paymentService.handleRazorpayWebhook(
      rawBody,
      signature,
      eventIdHeader,
      auditContext
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
