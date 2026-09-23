import { emailRepository } from './email.repository';
import { EmailProvider } from './providers/email-provider.interface';
import { MockEmailProvider } from './providers/mock-email.provider';
import { Msg91Provider } from './providers/msg91.provider';
import { prisma } from '../../config/database';

export class EmailService {
  private provider: EmailProvider;

  constructor() {
    // In production, we'd use Msg91Provider.
    // For now, if MSG91_API_KEY is not present or we are in a dev environment, use mock.
    if (process.env.NODE_ENV === 'production' && process.env.MSG91_API_KEY) {
      this.provider = new Msg91Provider();
    } else {
      this.provider = new MockEmailProvider();
    }
  }

  public async sendDonationReceipt(donationId: bigint, certificateNumber: string) {
    // We assume the organization already has an approved MSG91 template ID.
    // This should come from env variables.
    const templateId = process.env.MSG91_80G_TEMPLATE_ID || 'dummy_80g_template_id';

    // 1. Check idempotency
    const existingLog = await emailRepository.findByDonationAndTemplate(donationId, templateId);
    
    // If it exists and is not FAILED, we do not re-send
    if (existingLog && existingLog.delivery_status !== 'FAILED') {
      return existingLog;
    }

    // 2. Fetch required donation and donor details
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true, campaign: true }
    });

    if (!donation || !donation.donor.email) {
      // If no email is present, we cannot send a receipt.
      // We could log a failure or simply return.
      return null;
    }

    // 3. Create (or reuse) EmailLog in PENDING state
    let emailLogId = existingLog?.id;
    if (!emailLogId) {
      const newLog = await emailRepository.createLog({
        recipient_email: donation.donor.email,
        provider: this.provider instanceof Msg91Provider ? 'MSG91' : 'MOCK',
        template_id: templateId,
        delivery_status: 'PENDING',
        related_entity_type: 'DONATION',
        related_entity_id: donationId
      });
      emailLogId = newLog.id;
    } else {
      // If retrying a FAILED one, mark it back to PENDING first
      await emailRepository.updateLogStatus(emailLogId, 'PENDING');
    }

    // 4. Prepare Variables (Do not log this object in production)
    const variables = {
      donor_name: donation.donor.first_name + (donation.donor.last_name ? ' ' + donation.donor.last_name : ''),
      donation_number: donation.donation_number,
      certificate_number: certificateNumber,
      donation_amount: donation.amount.toString(),
      donation_date: donation.created_at.toISOString().split('T')[0],
      campaign_name: donation.campaign?.title || 'General Fund',
      pan: donation.donor.pan_number || 'N/A' // Sent to provider, but never logged locally
    };

    // 5. Send via Provider
    const result = await this.provider.sendEmail({
      to: donation.donor.email,
      templateId,
      variables,
      relatedEntityType: 'DONATION',
      relatedEntityId: donationId
    });

    // 6. Update EmailLog status based on Provider Result
    // We treat acceptance as PENDING (meaning MSG91 took it but delivery is async).
    // If it failed immediately at the provider, we mark FAILED.
    if (result.success) {
      await emailRepository.updateLogStatus(emailLogId, 'PENDING', result.messageId);
    } else {
      await emailRepository.updateLogStatus(emailLogId, 'FAILED', undefined, result.error);
    }

    return await prisma.emailLog.findUnique({ where: { id: emailLogId } });
  }
}

export const emailService = new EmailService();
