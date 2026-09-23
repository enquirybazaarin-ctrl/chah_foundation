export interface SendEmailPayload {
  to: string;
  templateId: string;
  variables: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: bigint;
}

export interface ProviderSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
