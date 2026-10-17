import { emailRepository } from './email.repository';
import { EmailProvider } from './providers/email-provider.interface';
import { MockEmailProvider } from './providers/mock-email.provider';
import { Msg91Provider } from './providers/msg91.provider';
import { prisma } from '../../config/database';
import { format } from 'date-fns';
import { amountInWordsIndian } from '../../utils/number-to-words';

export class EmailService {
  private provider: EmailProvider;

  constructor() {
    // If MSG91_API_KEY is configured and not running under automated Jest tests, use real Msg91Provider
    if (
      process.env.MSG91_API_KEY &&
      process.env.MSG91_API_KEY !== 'mock_key' &&
      process.env.NODE_ENV !== 'test'
    ) {
      this.provider = new Msg91Provider();
    } else {
      this.provider = new MockEmailProvider();
    }
  }

  /**
   * Sends 80G donation receipt & tax exemption certificate to donor's email via MSG91.
   * Matches the official 80G Certificate Receipt template layout.
   */
  public async sendDonationReceipt(donationId: bigint, certificateNumber: string) {
    const templateId =
      process.env.MSG91_80G_TEMPLATE_ID ||
      process.env.MSG91_TEMPLATE_ID ||
      'dummy_80g_template_id';

    // 1. Check idempotency: If already sent/pending, avoid duplicate dispatch
    const existingLog = await emailRepository.findByDonationAndTemplate(donationId, templateId);
    if (existingLog && existingLog.delivery_status !== 'FAILED') {
      return existingLog;
    }

    // 2. Fetch complete donation, donor, campaign, and payment details
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: true,
        campaign: true,
        payments: true
      }
    });

    if (!donation || !donation.donor.email) {
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
      await emailRepository.updateLogStatus(emailLogId, 'PENDING');
    }

    // 4. Resolve payment transaction info
    const capturedPayment =
      donation.payments.find((p) => p.status === 'CAPTURED') ||
      donation.payments[0];

    const donorFullName = `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim() || 'Valued Donor';
    const numericAmount = Number(donation.amount);
    const formattedAmount = numericAmount.toString();
    const amountInWords = amountInWordsIndian(numericAmount);
    const formattedDate = format(donation.created_at, 'dd-MMM-yyyy');
    const transactionId = capturedPayment?.provider_payment_id || 'N/A';
    const payMode = capturedPayment?.method || (donation.payment_type === 'ONLINE' ? 'online' : donation.payment_type.toLowerCase());
    const panNumber = donation.donor.pan_number || 'N/A';
    const receiptNo = certificateNumber || donation.donation_number;

    // 5. Build variables mapping for MSG91 approved template
    // Covers both standardized keys and aliases matching the template fields
    const variables: Record<string, string> = {
      // Header & Receipt
      date: formattedDate,
      donation_date: formattedDate,
      receipt_no: receiptNo,
      certificate_number: receiptNo,
      donation_number: donation.donation_number,

      // Donor Information
      donor_name: donorFullName,
      donar_name: donorFullName,
      donor_email: donation.donor.email,
      donar_email: donation.donor.email,
      mobile_no: donation.donor.phone || 'N/A',
      phone: donation.donor.phone || 'N/A',
      pan: panNumber,
      pan_no: panNumber,
      dob: 'N/A',
      date_of_birth: 'N/A',

      // Donation / Financial Details
      donation_amount: formattedAmount,
      amount: formattedAmount,
      donation_amount_in_word: amountInWords,
      donation_amount_in_words: amountInWords,
      amount_in_words: amountInWords,
      transaction_id: transactionId,
      payment_id: transactionId,
      pay_mode: payMode,
      payment_mode: payMode,

      // Campaign & Foundation
      campaign_name: donation.campaign?.title || 'General Fund'
    };

    // 6. Send via Provider
    const result = await this.provider.sendEmail({
      to: donation.donor.email,
      recipientName: donorFullName,
      templateId,
      variables,
      relatedEntityType: 'DONATION',
      relatedEntityId: donationId
    });

    // 7. Update EmailLog status based on Provider Result
    if (result.success) {
      await emailRepository.updateLogStatus(emailLogId, 'PENDING', result.messageId);
    } else {
      await emailRepository.updateLogStatus(emailLogId, 'FAILED', undefined, result.error);
    }

    return await prisma.emailLog.findUnique({ where: { id: emailLogId } });
  }

  public async sendAdminDigest(data: {
    date: string;
    totalAmount: string;
    donationCount: number;
    newDonors: number;
    adminEmail: string;
  }) {
    const templateId =
      process.env.MSG91_ADMIN_DIGEST_TEMPLATE_ID || 'dummy_admin_digest_template';

    const newLog = await emailRepository.createLog({
      recipient_email: data.adminEmail,
      provider: this.provider instanceof Msg91Provider ? 'MSG91' : 'MOCK',
      template_id: templateId,
      delivery_status: 'PENDING',
      related_entity_type: 'SYSTEM'
    });

    const variables = {
      date: data.date,
      total_amount: data.totalAmount,
      donation_count: data.donationCount.toString(),
      new_donors: data.newDonors.toString()
    };

    const result = await this.provider.sendEmail({
      to: data.adminEmail,
      recipientName: 'Administrator',
      templateId,
      variables,
      relatedEntityType: 'SYSTEM'
    });

    if (result.success) {
      await emailRepository.updateLogStatus(newLog.id, 'PENDING', result.messageId);
    } else {
      await emailRepository.updateLogStatus(newLog.id, 'FAILED', undefined, result.error);
    }

    return await prisma.emailLog.findUnique({ where: { id: newLog.id } });
  }
}

export const emailService = new EmailService();
