export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateEnquiryStatusInput {
  status: 'UNREAD' | 'READ' | 'RESOLVED';
}

export interface NewsletterSignupInput {
  email: string;
}

export interface UpdateNewsletterStatusInput {
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
}

export interface UpsertSettingInput {
  setting_key: string;
  setting_value: string;
}

export interface CreateAuditLogInput {
  user_id?: bigint | null;
  action: string;
  entity_type: string;
  entity_id: bigint;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
}

export interface OperationsQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
}
