import { prisma } from '../../config/database';

export class EmailRepository {
  public async findByDonationAndTemplate(donationId: bigint, templateId: string) {
    return prisma.emailLog.findFirst({
      where: {
        related_entity_type: 'DONATION',
        related_entity_id: donationId,
        template_id: templateId
      }
    });
  }

  public async createLog(data: {
    recipient_email: string;
    provider: string;
    template_id: string;
    delivery_status: 'PENDING' | 'SENT' | 'FAILED';
    related_entity_type?: string;
    related_entity_id?: bigint;
  }) {
    // Note: using 'PENDING' for status since schema has PENDING, DELIVERED, FAILED
    // If the schema restricts it to these, we map SENT -> PENDING or update schema mentally
    // Let's use PENDING as initial, and if successful API call, we might leave it PENDING or DELIVERED based on rules.
    // The rules say: "Do not falsely represent provider acceptance as mailbox delivery. record the appropriate status supported by the existing EmailLog schema, such as PENDING, SENT, FAILED... use existing enum where possible".
    // Prisma schema enum DeliveryStatus: PENDING, DELIVERED, FAILED
    // We will use PENDING.
    
    return prisma.emailLog.create({
      data: {
        recipient_email: data.recipient_email,
        provider: data.provider,
        template_id: data.template_id,
        delivery_status: 'PENDING',
        related_entity_type: data.related_entity_type,
        related_entity_id: data.related_entity_id
      }
    });
  }

  public async updateLogStatus(
    id: bigint, 
    status: 'PENDING' | 'DELIVERED' | 'FAILED', 
    providerMessageId?: string, 
    failureReason?: string
  ) {
    return prisma.emailLog.update({
      where: { id },
      data: {
        delivery_status: status,
        provider_message_id: providerMessageId,
        failure_reason: failureReason,
        sent_at: status === 'PENDING' || status === 'DELIVERED' ? new Date() : undefined, // If sent/delivered, mark sent_at
        updated_at: new Date()
      }
    });
  }
}

export const emailRepository = new EmailRepository();
