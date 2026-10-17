import dotenv from 'dotenv';
dotenv.config();

import { Msg91Provider } from '../src/modules/emails/providers/msg91.provider';
import { amountInWordsIndian } from '../src/utils/number-to-words';

async function main() {
  const recipientEmail = process.argv[2] || process.env.TEST_DONOR_EMAIL || 'ptamit7826@gmail.com';
  const apiKey = process.env.MSG91_API_KEY;
  const templateId = process.env.MSG91_80G_TEMPLATE_ID || process.env.MSG91_TEMPLATE_ID;

  console.log('--------------------------------------------------');
  console.log('CHAH Foundation — MSG91 80G Email Delivery Test');
  console.log('--------------------------------------------------');
  console.log(`Recipient Email: ${recipientEmail}`);
  console.log(`Template ID:     ${templateId || '(NOT SET)'}`);
  console.log(`AuthKey:         ${apiKey ? apiKey.substring(0, 4) + '...' + apiKey.slice(-4) : '(NOT SET)'}`);
  console.log(`From Email:      ${process.env.MSG91_FROM_EMAIL || 'info@chahfoundation.com'}`);
  console.log('--------------------------------------------------');

  if (!apiKey || !templateId) {
    console.error('❌ Error: MSG91_API_KEY and MSG91_80G_TEMPLATE_ID must be set in backend/.env');
    console.log('Please edit backend/.env and provide your approved credentials, then re-run.');
    process.exit(1);
  }

  const sampleAmount = 1;
  const sampleWords = amountInWordsIndian(sampleAmount);

  const variables = {
    date: '04-Jun-2026',
    donation_date: '04-Jun-2026',
    receipt_no: 'CHAH-17261',
    certificate_number: 'CHAH-17261',
    donation_number: 'DON-2026-004128',
    donor_name: 'Amit Pandey',
    donar_name: 'Amit Pandey',
    donor_email: recipientEmail,
    donar_email: recipientEmail,
    mobile_no: '9696717305',
    phone: '9696717305',
    pan: 'ABCDE1234F',
    pan_no: 'ABCDE1234F',
    dob: 'N/A',
    date_of_birth: 'N/A',
    donation_amount: sampleAmount.toString(),
    amount: sampleAmount.toString(),
    donation_amount_in_word: sampleWords,
    donation_amount_in_words: sampleWords,
    amount_in_words: sampleWords,
    transaction_id: 'pay_SxYODjF27PUYRq',
    payment_id: 'pay_SxYODjF27PUYRq',
    pay_mode: 'online',
    payment_mode: 'online',
    campaign_name: 'Children Education & Healthcare'
  };

  console.log('Dispatching test 80G certificate email via MSG91...');
  const provider = new Msg91Provider();
  const result = await provider.sendEmail({
    to: recipientEmail,
    recipientName: 'Amit Pandey',
    templateId,
    variables
  });

  if (result.success) {
    console.log('✅ Success! Email accepted by MSG91.');
    console.log(`Message ID: ${result.messageId}`);
    console.log('Please check your inbox at:', recipientEmail);
  } else {
    console.error('❌ Failed to send via MSG91:');
    console.error(`Error details: ${result.error}`);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
