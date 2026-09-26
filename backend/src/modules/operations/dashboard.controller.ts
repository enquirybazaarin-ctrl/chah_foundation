import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { startOfDay, startOfMonth } from 'date-fns';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = startOfDay(new Date());
    const thisMonth = startOfMonth(new Date());

    // 1. Financials
    const [donationsToday, donationsThisMonth, totalDonationsAllTime] = await Promise.all([
      prisma.donation.aggregate({
        where: { status: 'SUCCESS', created_at: { gte: today } },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.donation.aggregate({
        where: { status: 'SUCCESS', created_at: { gte: thisMonth } },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.donation.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true }
      })
    ]);

    // 2. Donors
    const [newDonorsToday, newDonorsThisMonth, totalDonors] = await Promise.all([
      prisma.donor.count({ where: { created_at: { gte: today } } }),
      prisma.donor.count({ where: { created_at: { gte: thisMonth } } }),
      prisma.donor.count()
    ]);

    // 3. Requires Attention
    const [unreadEnquiries, pendingCertificates, failedPayments] = await Promise.all([
      prisma.contactEnquiry.count({ where: { status: 'UNREAD' } }),
      prisma.certificate.count({ where: { status: 'FAILED' } }),
      prisma.payment.count({ where: { status: 'FAILED', created_at: { gte: thisMonth } } }) // Failed payments this month
    ]);

    // 4. Recent Transactions
    const recentDonations = await prisma.donation.findMany({
      where: { status: 'SUCCESS' },
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { donor: { select: { first_name: true, last_name: true, email: true } } }
    });

    // 5. Active Campaigns
    const activeCampaignsCount = await prisma.campaign.count({
      where: { status: 'ACTIVE' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        financials: {
          today: {
            amount: donationsToday._sum.amount || 0,
            count: donationsToday._count.id
          },
          thisMonth: {
            amount: donationsThisMonth._sum.amount || 0,
            count: donationsThisMonth._count.id
          },
          allTime: {
            amount: totalDonationsAllTime._sum.amount || 0
          }
        },
        donors: {
          newToday: newDonorsToday,
          newThisMonth: newDonorsThisMonth,
          total: totalDonors
        },
        requiresAttention: {
          unreadEnquiries,
          pendingCertificates,
          failedPayments
        },
        recentDonations,
        activeCampaigns: activeCampaignsCount
      }
    });
  } catch (err) {
    next(err);
  }
};
