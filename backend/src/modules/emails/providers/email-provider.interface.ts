import { SendEmailPayload, ProviderSendResult } from '../email.types';

export interface EmailProvider {
  sendEmail(payload: SendEmailPayload): Promise<ProviderSendResult>;
}
