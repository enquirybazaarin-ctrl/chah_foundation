import { EmailProvider } from './email-provider.interface';
import { SendEmailPayload, ProviderSendResult } from '../email.types';
import axios from 'axios';

export class Msg91Provider implements EmailProvider {
  public async sendEmail(payload: SendEmailPayload): Promise<ProviderSendResult> {
    try {
      const apiKey = process.env.MSG91_API_KEY;
      if (!apiKey) {
        throw new Error('MSG91_API_KEY is not configured');
      }

      // MSG91 email API URL (example, verify with actual MSG91 docs)
      const url = 'https://control.msg91.com/api/v5/email/send';

      const requestBody = {
        to: [
          {
            email: payload.to
          }
        ],
        from: {
          email: process.env.MSG91_FROM_EMAIL || 'no-reply@chahfoundation.org'
        },
        template_id: payload.templateId,
        variables: payload.variables
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'AuthKey': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Based on MSG91 response structure
      if (response.data && response.data.type === 'success') {
        return {
          success: true,
          messageId: response.data.message_id || `msg91_${Date.now()}`
        };
      } else {
        return {
          success: false,
          error: response.data?.message || 'Unknown MSG91 error'
        };
      }
    } catch (error: any) {
      // Do not log payload here to avoid leaking PAN/donor details
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Network error communicating with MSG91'
      };
    }
  }
}
