import { appEventEmitter } from './event-emitter';
import { DonationEvents, DonationSuccessPayload } from './donation.events';
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
