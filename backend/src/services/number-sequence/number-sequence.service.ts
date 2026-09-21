import { AppError } from '../../utils/errors';
import { PrismaTransactionClient, SequenceType } from './number-sequence.types';

export class NumberSequenceService {
  private static readonly MAX_SEQUENCE_VALUE = 999999n;

  /**
   * Generates the next concurrent-safe sequence number for a given type and year.
   * MUST be executed inside an existing Prisma transaction.
   * 
   * @param tx Existing Prisma transaction client
   * @param type SequenceType ("DONOR" | "DONATION")
   * @param year The year for the sequence (e.g., 2026)
   * @returns Formatted sequence string (e.g., DNR-2026-000001)
   */
  public static async next(tx: PrismaTransactionClient, type: SequenceType, year: number): Promise<string> {
    if (type !== 'DONOR' && type !== 'DONATION') {
      throw new AppError(`Unsupported sequence type: ${type}`, 400);
    }

    if (!Number.isInteger(year) || year < 1000 || year > 9999) {
      throw new AppError(`Invalid year: ${year}`, 400);
    }

    const sequenceName = `${type}_${year}`;
    const prefix = type === 'DONOR' ? 'DNR' : 'DON';

    // 1. Atomic increment or initialization using INSERT ... ON DUPLICATE KEY UPDATE.
    // This locks the specific row in MySQL until the transaction commits or rolls back,
    // ensuring concurrency safety and preventing race conditions during first-row creation.
    await tx.$executeRaw`
      INSERT INTO number_sequences (name, current_value, updated_at)
      VALUES (${sequenceName}, 1, NOW())
      ON DUPLICATE KEY UPDATE 
        current_value = current_value + 1,
        updated_at = NOW();
    `;

    // 2. Fetch the newly incremented value within the same transaction.
    // Since the row is locked by the above statement, no other transaction can modify it.
    const result = await tx.$queryRaw<{ current_value: bigint }[]>`
      SELECT current_value FROM number_sequences WHERE name = ${sequenceName};
    `;

    if (!result || result.length === 0) {
      throw new AppError('Failed to retrieve sequence value after atomic increment.', 500);
    }

    const currentValue = result[0].current_value;

    // 3. Overflow check
    if (currentValue > NumberSequenceService.MAX_SEQUENCE_VALUE) {
      throw new AppError(`Sequence overflow for ${sequenceName}. Maximum value reached.`, 400);
    }

    // 4. Formatting
    const numericPart = currentValue.toString().padStart(6, '0');
    return `${prefix}-${year}-${numericPart}`;
  }
}
