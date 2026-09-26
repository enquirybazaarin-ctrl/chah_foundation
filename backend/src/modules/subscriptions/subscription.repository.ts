import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class SubscriptionRepository {
  public async findSubscriptions(page: number, limit: number, status?: string, frequency?: string, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.SubscriptionWhereInput = {};
    if (status) {
      where.status = status as any;
    }
    if (frequency) {
      where.frequency = frequency as any;
    }
    if (search) {
      where.OR = [
        { subscription_number: { contains: search } },
        { donor: { first_name: { contains: search } } },
        { donor: { last_name: { contains: search } } },
        { donor: { email: { contains: search } } }
      ];
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          donor: {
            select: { first_name: true, last_name: true, email: true }
          },
          campaign: {
            select: { title: true }
          }
        }
      }),
      prisma.subscription.count({ where })
    ]);

    return { subscriptions, total };
  }

  public async findSubscriptionById(id: bigint) {
    return prisma.subscription.findUnique({
      where: { id },
      include: { donor: true, campaign: true }
    });
  }

  public async findSubscriptionByRazorpayId(razorpaySubscriptionId: string) {
    return prisma.subscription.findUnique({
      where: { razorpay_subscription_id: razorpaySubscriptionId }
    });
  }

  public async createSubscription(data: Prisma.SubscriptionCreateInput) {
    return prisma.subscription.create({ data });
  }

  public async updateSubscriptionStatus(id: bigint, status: any) {
    return prisma.subscription.update({
      where: { id },
      data: { status }
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
