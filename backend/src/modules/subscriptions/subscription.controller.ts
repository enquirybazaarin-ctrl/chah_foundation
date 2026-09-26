import { Request, Response, NextFunction } from 'express';
import { subscriptionRepository } from './subscription.repository';
import { AppError } from '../../utils/errors';

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const frequency = req.query.frequency as string;
    const search = req.query.search as string;

    const { subscriptions, total } = await subscriptionRepository.findSubscriptions(page, limit, status, frequency, search);

    res.status(200).json({
      status: 'success',
      data: {
        subscriptions,
        meta: { total, page, limit }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const subscription = await subscriptionRepository.findSubscriptionById(BigInt(id));

    if (!subscription) {
      return next(new AppError('Subscription not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { subscription }
    });
  } catch (err) {
    next(err);
  }
};

import { razorpayService } from '../payments/razorpay.service';

export const updateSubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return next(new AppError('Invalid subscription status', 400));
    }

    const subscription = await subscriptionRepository.findSubscriptionById(BigInt(id));
    if (!subscription) {
      return next(new AppError('Subscription not found', 404));
    }

    if (subscription.razorpay_subscription_id) {
      if (status === 'PAUSED') {
        await razorpayService.pauseSubscription(subscription.razorpay_subscription_id);
      } else if (status === 'ACTIVE') {
        await razorpayService.resumeSubscription(subscription.razorpay_subscription_id);
      } else if (status === 'CANCELLED') {
        await razorpayService.cancelSubscription(subscription.razorpay_subscription_id);
      }
    }

    const updated = await subscriptionRepository.updateSubscriptionStatus(BigInt(id), status);

    res.status(200).json({
      status: 'success',
      data: { subscription: updated }
    });
  } catch (err) {
    next(err);
  }
};
