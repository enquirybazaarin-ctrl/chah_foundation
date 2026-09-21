import { Router } from 'express';
import { handleRazorpayWebhook } from './payment.controller';

const router = Router();

// POST /api/v1/payments/razorpay/webhook
router.post('/razorpay/webhook', handleRazorpayWebhook);

export default router;
