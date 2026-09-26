import { Prisma } from '@prisma/client';

export type SequenceType = 'DONOR' | 'DONATION' | 'CERTIFICATE' | 'SUBSCRIPTION';

/**
 * PrismaTransactionClient defines the shape of a valid Prisma transaction client
 * created via `prisma.$transaction(async (tx) => { ... })`.
 * This ensures the service only operates within an existing transaction.
 */
export type PrismaTransactionClient = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
