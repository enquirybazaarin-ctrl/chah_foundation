import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';

async function testRazorpay() {
  console.log('Testing Razorpay order creation...');
  console.log('Key ID:', process.env.RAZORPAY_KEY_ID);

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  });

  try {
    const order = await instance.orders.create({
      amount: 100, // 1 INR in paise
      currency: 'INR',
      receipt: `test_rcpt_${Date.now()}`
    });

    console.log('✅ Razorpay Connected Successfully!');
    console.log('Test Order ID:', order.id);
    console.log('Amount (paise):', order.amount);
    console.log('Status:', order.status);
  } catch (error: any) {
    console.error('❌ Razorpay Error:', error);
  }
}

testRazorpay();
