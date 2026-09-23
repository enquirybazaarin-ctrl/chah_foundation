export const DonationEvents = {
  DONATION_SUCCESS: 'DONATION_SUCCESS'
};

export interface DonationSuccessPayload {
  donationId: bigint;
}
