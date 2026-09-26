import { appEventEmitter } from './event-emitter';
import { DonationEvents, DonationSuccessPayload } from './donation.events';
import { prisma } from '../config/database';
import { certificateService } from '../modules/certificates/certificate.service';
import { emailService } from '../modules/emails/email.service';

export const DonationJob = {
  processDonationSuccess: async (donationId: bigint) => {
    try {
      // 1. Generate Certificate
      const certificate = await certificateService.generateCertificate(donationId);
      
      // 2. Send Email
      if (certificate && certificate.certificate_number) {
        await emailService.sendDonationReceipt(donationId, certificate.certificate_number);
      }

      // 3. Campaign Goal Check
      const donation = await prisma.donation.findUnique({
        where: { id: donationId },
        include: { campaign: true }
      });

      if (donation && donation.campaign && donation.campaign.target_amount) {
        // If the new raised amount is >= target amount, and it wasn't before this donation.
        // We can do a simplistic check: if it is >= target amount, we send an alert (debouncing could be done via a flag, 
        // but for now we'll just check if it's hit). A robust way is to check if it crossed *just now*, 
        // i.e., raised_amount - donation.amount < target_amount.
        const raised = Number(donation.campaign.raised_amount);
        const target = Number(donation.campaign.target_amount);
        const amount = Number(donation.amount);
        
        if (raised >= target && (raised - amount) < target) {
          // Send Alert (We reuse sendAdminDigest or create a new sendCampaignAlert)
          const adminEmailSetting = await prisma.setting.findUnique({
            where: { setting_key: 'NGO_CONTACT_EMAIL' }
          });
          const adminEmail = adminEmailSetting?.setting_value || process.env.ADMIN_EMAIL;
          if (adminEmail) {
            await emailService.sendAdminDigest({
              date: new Date().toISOString().split('T')[0],
              totalAmount: raised.toString(),
              donationCount: 1, // Just a placeholder for the payload
              newDonors: 0,
              adminEmail: adminEmail // Send this as an alert email. (In real-world we'd use a specific Campaign Goal template)
            });
          }
        }
      }

    } catch (error) {
      // Log the error safely. Do not log sensitive donor information or PAN.
      console.error(`Error processing post-donation tasks for donation ${donationId}:`, 
        error instanceof Error ? error.message : 'Unknown error');
    }
  }
};

export const processDonationSuccess = DonationJob.processDonationSuccess;

appEventEmitter.on(DonationEvents.DONATION_SUCCESS, (payload: DonationSuccessPayload) => {
  void DonationJob.processDonationSuccess(payload.donationId);
});
