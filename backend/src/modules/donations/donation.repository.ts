import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { PrismaClientOrTransaction, DonationSearchQuery } from './donation.types';

export class DonationRepository {
  public async createDonation(tx: PrismaClientOrTransaction, data: Prisma.DonationUncheckedCreateInput) {
    return tx.donation.create({
      data
    });
  }

  public async createPayment(tx: PrismaClientOrTransaction, data: Prisma.PaymentUncheckedCreateInput) {
    return tx.payment.create({
      data
    });
  }

  public async findById(id: bigint) {
    return prisma.donation.findUnique({
      where: { id },
      include: {
        donor: true,
        campaign: true,
        payments: true
      }
    });
  }

  public async findPaymentByProviderOrderId(providerOrderId: string) {
    return prisma.payment.findFirst({
      where: { provider_order_id: providerOrderId },
      include: {
        donation: {
          include: {
            donor: true,
            campaign: true,
            payments: true
          }
        }
      }
    });
  }

  public async findPaymentById(id: bigint) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        donation: {
          include: {
            donor: true,
            campaign: true,
            payments: true
          }
        }
      }
    });
  }

  public async confirmDonation(tx: PrismaClientOrTransaction, id: bigint) {
    // Atomic state transition: Ensure it is PENDING
    const result = await tx.$executeRaw`
      UPDATE donations 
      SET status = 'SUCCESS', updated_at = NOW(3)
      WHERE id = ${id} AND status = 'PENDING'
    `;
    return result; // returns affected rows count
  }

  public async capturePayment(tx: PrismaClientOrTransaction, donationId: bigint) {
    // Note: Update all CREATED payments for this donation to CAPTURED. 
    // In offline flow, there is typically one MANUAL payment.
    return tx.payment.updateMany({
      where: { 
        donation_id: donationId, 
        status: 'CREATED' 
      },
      data: {
        status: 'CAPTURED',
        updated_at: new Date()
      }
    });
  }

  public async cancelDonation(tx: PrismaClientOrTransaction, id: bigint) {
    // Atomic state transition: Ensure it is PENDING
    const result = await tx.$executeRaw`
      UPDATE donations 
      SET status = 'CANCELLED', updated_at = NOW(3)
      WHERE id = ${id} AND status = 'PENDING'
    `;
    return result;
  }

  public async incrementCampaign(tx: PrismaClientOrTransaction, campaignId: bigint, amount: Prisma.Decimal) {
    return tx.campaign.update({
      where: { id: campaignId },
      data: {
        raised_amount: {
          increment: amount
        }
      }
    });
  }

  public async search(query: DonationSearchQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search, status, campaign_id } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DonationWhereInput = {};
    
    if (status) {
      where.status = status;
    }

    if (campaign_id) {
      where.campaign_id = BigInt(campaign_id);
    }

    if (search) {
      where.OR = [
        { donation_number: { contains: search } },
        {
          donor: {
            OR: [
              { first_name: { contains: search } },
              { last_name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } }
            ]
          }
        }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.donation.count({ where }),
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          donor: {
            select: {
              id: true,
              donor_number: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true
            }
          },
          campaign: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })
    ]);

    return {
      data,
      total
    };
  }
}

export const donationRepository = new DonationRepository();
