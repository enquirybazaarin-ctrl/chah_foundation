import { NumberSequenceService } from '../../../src/services/number-sequence/number-sequence.service';
import { prisma } from '../../../src/config/database';
import { AppError } from '../../../src/utils/errors';

describe('NumberSequenceService', () => {
  beforeAll(async () => {
    // Ensure we are using test DB setup
  });

  beforeEach(async () => {
    // Clean up number sequences before each test
    await prisma.numberSequence.deleteMany({});
  });

  afterAll(async () => {
    // Clean up at the end
    await prisma.numberSequence.deleteMany({});
    await prisma.$disconnect();
  });

  describe('Basic Sequence Generation', () => {
    it('should generate the first donor number correctly', async () => {
      const number = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(number).toBe('DNR-2026-000001');
    });

    it('should generate the second donor number correctly', async () => {
      await prisma.$transaction(async (tx) => {
        await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      const number2 = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(number2).toBe('DNR-2026-000002');
    });

    it('should generate the first donation number correctly', async () => {
      const number = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONATION', 2026);
      });
      expect(number).toBe('DON-2026-000001');
    });
  });

  describe('Isolation and Validation', () => {
    it('should keep separate sequences for DONOR and DONATION', async () => {
      await prisma.$transaction(async (tx) => {
        await NumberSequenceService.next(tx, 'DONOR', 2026); // DNR 1
        await NumberSequenceService.next(tx, 'DONOR', 2026); // DNR 2
      });

      const donationNum = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONATION', 2026);
      });
      expect(donationNum).toBe('DON-2026-000001');
    });

    it('should isolate sequences by year', async () => {
      await prisma.$transaction(async (tx) => {
        await NumberSequenceService.next(tx, 'DONOR', 2026); // DNR 2026 - 1
      });

      const num2027 = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2027);
      });
      expect(num2027).toBe('DNR-2027-000001');
    });

    it('should format numbers with proper padding', async () => {
      await prisma.numberSequence.create({
        data: {
          name: 'DONOR_2026',
          current_value: 99n,
        },
      });

      const num100 = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(num100).toBe('DNR-2026-000100');

      await prisma.numberSequence.update({
        where: { name: 'DONOR_2026' },
        data: { current_value: 99999n },
      });

      const num100k = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(num100k).toBe('DNR-2026-100000');
    });

    it('should reject unsupported sequence types', async () => {
      await expect(
        prisma.$transaction(async (tx) => {
          // @ts-expect-error Testing invalid sequence type
          await NumberSequenceService.next(tx, 'RECEIPT', 2026);
        })
      ).rejects.toThrow(AppError);
    });

    it('should reject invalid year', async () => {
      await expect(
        prisma.$transaction(async (tx) => {
          await NumberSequenceService.next(tx, 'DONOR', 999);
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('Overflow', () => {
    it('should allow exactly 999999', async () => {
      await prisma.numberSequence.create({
        data: {
          name: 'DONOR_2026',
          current_value: 999998n,
        },
      });

      const maxVal = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(maxVal).toBe('DNR-2026-999999');
    });

    it('should safely fail on overflow past 999999', async () => {
      await prisma.numberSequence.create({
        data: {
          name: 'DONOR_2026',
          current_value: 999999n,
        },
      });

      await expect(
        prisma.$transaction(async (tx) => {
          await NumberSequenceService.next(tx, 'DONOR', 2026);
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('Transaction Safety', () => {
    it('should rollback sequence increment if the outer transaction rolls back', async () => {
      // Initialize with 1
      await prisma.$transaction(async (tx) => {
        await NumberSequenceService.next(tx, 'DONOR', 2026);
      });

      // Start transaction that fails
      try {
        await prisma.$transaction(async (tx) => {
          await NumberSequenceService.next(tx, 'DONOR', 2026);
          throw new Error('Forced rollback');
        });
      } catch {
        // Expected to throw
      }

      // Next successful transaction should return 2, not 3
      const num = await prisma.$transaction(async (tx) => {
        return await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      expect(num).toBe('DNR-2026-000002');
    });

    it('should persist sequence if transaction commits', async () => {
      await prisma.$transaction(async (tx) => {
        await NumberSequenceService.next(tx, 'DONOR', 2026);
      });
      
      const seq = await prisma.numberSequence.findUnique({
        where: { name: 'DONOR_2026' }
      });
      
      expect(seq?.current_value).toBe(1n);
    });
  });

  describe('Concurrency Safety', () => {
    it('FIRST-ROW CONCURRENCY: should handle multiple concurrent requests for non-existent row', async () => {
      const concurrencyLevel = 50;
      
      // Start 50 requests exactly at the same time
      const promises = Array.from({ length: concurrencyLevel }).map(() =>
        prisma.$transaction(async (tx) => {
          return await NumberSequenceService.next(tx, 'DONATION', 2027);
        })
      );

      const results = await Promise.all(promises);

      // Verify no duplicates
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(concurrencyLevel);

      // Verify format and that max is equal to concurrencyLevel
      const seq = await prisma.numberSequence.findUnique({
        where: { name: 'DONATION_2027' }
      });
      expect(seq?.current_value).toBe(BigInt(concurrencyLevel));
    });

    it('EXISTING-ROW CONCURRENCY: should handle multiple concurrent requests for existing row', async () => {
      // Pre-create the row
      await prisma.numberSequence.create({
        data: {
          name: 'DONOR_2028',
          current_value: 100n,
        },
      });

      const concurrencyLevel = 50;
      
      // Start 50 requests exactly at the same time
      const promises = Array.from({ length: concurrencyLevel }).map(() =>
        prisma.$transaction(async (tx) => {
          return await NumberSequenceService.next(tx, 'DONOR', 2028);
        })
      );

      const results = await Promise.all(promises);

      // Verify no duplicates
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(concurrencyLevel);

      // Verify that it went from 101 to 150
      const seq = await prisma.numberSequence.findUnique({
        where: { name: 'DONOR_2028' }
      });
      expect(seq?.current_value).toBe(150n);
    });
  });
});
