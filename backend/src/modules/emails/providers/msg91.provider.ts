import { EmailProvider } from './email-provider.interface';
import { SendEmailPayload, ProviderSendResult } from '../email.types';

export class Msg91Provider implements EmailProvider {
  public async sendEmail(payload: SendEmailPayload): Promise<ProviderSendResult> {
    try {
      const apiKey = process.env.MSG91_API_KEY;
      if (!apiKey) {
        throw new Error('MSG91_API_KEY is not configured');
      }

      const url = 'https://control.msg91.com/api/v5/email/send';

      const fromEmail = process.env.MSG91_FROM_EMAIL || 'info@chahfoundation.com';
      const fromName = process.env.MSG91_FROM_NAME || 'CHILDREN\'S HELP & HELPAGE FOUNDATION';

      const requestBody: Record<string, any> = {
        template_id: payload.templateId,
        recipients: [
          {
            to: [
              {
                name: payload.recipientName || 'Valued Donor',
                email: payload.to
              }
            ],
            variables: payload.variables
          }
        ],
        from: {
          name: fromName,
          email: fromEmail
        }
      };

      if (process.env.MSG91_DOMAIN) {
        requestBody.domain = process.env.MSG91_DOMAIN;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'authkey': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData: any = await response.json().catch(() => null);

      if (response.ok) {
        // MSG91 returns status: "success" or type: "success" or message on valid submission
        if (
          !responseData ||
          responseData.status === 'success' ||
          responseData.type === 'success' ||
          responseData.status === 200 ||
          responseData.status === '200' ||
          (responseData.message && !responseData.hasError)
        ) {
          return {
            success: true,
            messageId: responseData?.data?.id || responseData?.message_id || `msg91_${Date.now()}`
          };
        }

        return {
          success: false,
          error: responseData?.message || responseData?.error || 'MSG91 returned an unsuccessful response status'
        };
      } else {
        const errorMsg =
          responseData?.message ||
          responseData?.errors?.[0]?.message ||
          `MSG91 HTTP Error: ${response.status} ${response.statusText}`;
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (error: any) {
      // Do not log payload here to avoid leaking donor PII or financial details
      return {
        success: false,
        error: error.message || 'Network error communicating with MSG91'
      };
    }
  }
}
