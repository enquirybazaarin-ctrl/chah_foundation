import { EmailProvider } from './email-provider.interface';
import { SendEmailPayload, ProviderSendResult } from '../email.types';

export class MockEmailProvider implements EmailProvider {
  public async sendEmail(_payload: SendEmailPayload): Promise<ProviderSendResult> {
    // In local/test environment, simulate sending email and returning success.
    // Ensure we do NOT log sensitive info like PAN, but we can log that an email was sent.
    
    // Simulating MSG91 latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }
}
