/* eslint-disable @typescript-eslint/no-namespace */

export interface AuthenticatedUser {
  id: bigint;
  email: string;
  first_name: string;
  last_name: string | null;
  status: string;
  role: {
    id: bigint;
    name: string;
  };
  permissions: Array<{
    action: string;
    resource: string;
  }>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
