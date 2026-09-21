import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { NumberSequenceService } from '../../services/number-sequence/number-sequence.service';
import { donorRepository } from './donor.repository';
import { AuditContext, CreateDonorDTO, DonorSearchQuery, UpdateDonorDTO } from './donor.types';
import { Donor } from '@prisma/client';

export class DonorService {
  /**
   * Helper to normalize email
   */
  private normalizeEmail(email?: string): string | undefined {
    if (!email || email.trim() === '') return undefined;
    return email.trim().toLowerCase();
  }

  /**
   * Helper to normalize phone
   */
  private normalizePhone(phone?: string): string | undefined {
    if (!phone || phone.trim() === '') return undefined;
    return phone.trim().replace(/\s+/g, '');
  }

  /**
   * Helper to mask PAN
   */
  private maskPan(pan?: string | null): string | null {
    if (!pan) return null;
    return pan.substring(0, 5) + '****' + pan.substring(9, 10);
  }

  /**
   * Safe mapping for external response
   */
  private mapDonorResponse(donor: Donor) {
    return {
      ...donor,
      id: donor.id.toString(),
      pan_number: this.maskPan(donor.pan_number)
    };
  }

  /**
   * Clean payload for audit, omitting raw PAN
   */
  private sanitizeForAudit(data: any): any {
    if (!data) return data;
    const sanitized = { ...data };
    if ('pan_number' in sanitized && sanitized.pan_number) {
      sanitized.pan_number = this.maskPan(sanitized.pan_number);
    }
    return sanitized;
  }

  /**
   * Create or Reuse a Donor
   */
  /**
   * Internal method used for atomic transaction composition with Donation Service
   */
  public async resolveOrCreateWithTransaction(tx: any, data: CreateDonorDTO, auditContext: AuditContext) {
    const {
      first_name, last_name, email, phone, pan_number,
      address, city, state, country, pincode, status
    } = data as any;

    const normalizedEmail = this.normalizeEmail(email);
    const normalizedPhone = this.normalizePhone(phone);

    const dto: any = {
      first_name, last_name, pan_number,
      address, city, state, country, pincode, status,
      email: normalizedEmail,
      phone: normalizedPhone
    };
    
    // Remove undefined
    Object.keys(dto).forEach(key => dto[key] === undefined && delete dto[key]);

    // 1. Independent Lookups
    let emailMatch: Donor | null = null;
    let phoneMatch: Donor | null = null;

    if (email) {
      emailMatch = await donorRepository.findByEmail(email, tx);
    }
    if (phone) {
      phoneMatch = await donorRepository.findByPhone(phone, tx);
    }

    // 2. Evaluate matches
    let targetDonorId: bigint | undefined;

    if (emailMatch && phoneMatch) {
      if (emailMatch.id === phoneMatch.id) {
        // Both identify the SAME donor
        targetDonorId = emailMatch.id;
      } else {
        // DIFFERENT donors -> Create a NEW donor to avoid silent merge
        targetDonorId = undefined;
      }
    } else if (emailMatch) {
      // Only email matched
      targetDonorId = emailMatch.id;
    } else if (phoneMatch) {
      // Only phone matched
      targetDonorId = phoneMatch.id;
    }

    if (targetDonorId) {
      // REUSE DONOR
      const existing = await tx.donor.findUnique({ where: { id: targetDonorId } });
      if (!existing) throw new AppError('Donor not found during reuse', 500);

      const updateData = { ...dto };
      const donor = await tx.donor.update({
        where: { id: targetDonorId },
        data: updateData
      });

      // Audit
      await tx.auditLog.create({
        data: {
          action: 'DONOR_UPDATED',
          entity_type: 'DONOR',
          entity_id: donor.id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
          old_values: this.sanitizeForAudit(existing) as any,
          new_values: this.sanitizeForAudit(updateData) as any
        }
      });

      return {
        donor: this.mapDonorResponse(donor),
        isNew: false
      };
    }

    // CREATE NEW DONOR
    const year = new Date().getFullYear();
    const donorNumber = await NumberSequenceService.next(tx, 'DONOR', year);

    const donor = await donorRepository.create(tx, {
      ...dto,
      donor_number: donorNumber
    });

    // Audit
    await tx.auditLog.create({
      data: {
        action: 'DONOR_CREATED',
        entity_type: 'DONOR',
        entity_id: donor.id,
        user_id: auditContext.actorUserId || null,
        ip_address: auditContext.ipAddress,
        user_agent: auditContext.userAgent,
        new_values: this.sanitizeForAudit(donor) as any
      }
    });

    return {
      donor: this.mapDonorResponse(donor),
      isNew: true
    };
  }

  /**
   * Create or Reuse a Donor
   */
  public async createDonor(data: CreateDonorDTO, auditContext: AuditContext) {
    return prisma.$transaction(async (tx) => {
      return this.resolveOrCreateWithTransaction(tx, data, auditContext);
    });
  }

  public async getDonors(query: DonorSearchQuery) {
    const result = await donorRepository.search(query);
    return {
      data: result.data.map(d => this.mapDonorResponse(d)),
      meta: {
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
        total_pages: Math.ceil(result.total / (query.limit || 10))
      }
    };
  }

  public async getDonorById(id: bigint) {
    const donor = await donorRepository.findById(id);
    if (!donor) {
      throw new AppError('Donor not found', 404);
    }
    return this.mapDonorResponse(donor);
  }

  public async updateDonor(id: bigint, data: UpdateDonorDTO, auditContext: AuditContext) {
    const donor = await donorRepository.findById(id);
    if (!donor) {
      throw new AppError('Donor not found', 404);
    }

    const {
      first_name, last_name, email, phone, pan_number,
      address, city, state, country, pincode, status
    } = data as any;

    const dto: any = {
      first_name, last_name, email, phone, pan_number,
      address, city, state, country, pincode, status
    };

    // Remove undefined
    Object.keys(dto).forEach(key => dto[key] === undefined && delete dto[key]);

    if (dto.email !== undefined) dto.email = this.normalizeEmail(dto.email);
    if (dto.phone !== undefined) dto.phone = this.normalizePhone(dto.phone);

    const updatedDonor = await prisma.$transaction(async (tx) => {
      const updated = await tx.donor.update({
        where: { id },
        data: dto
      });

      await tx.auditLog.create({
        data: {
          action: 'DONOR_UPDATED',
          entity_type: 'DONOR',
          entity_id: updated.id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
          old_values: this.sanitizeForAudit(donor) as any,
          new_values: this.sanitizeForAudit(dto) as any
        }
      });

      return updated;
    });

    return this.mapDonorResponse(updatedDonor);
  }

  public async getDonorDonations(id: bigint, page = 1, limit = 10) {
    // Verify donor exists
    const donor = await donorRepository.findById(id);
    if (!donor) {
      throw new AppError('Donor not found', 404);
    }

    const result = await donorRepository.findDonations(id, page, limit);
    return {
      data: result.data.map(d => ({
        ...d,
        id: d.id.toString(),
        donor_id: d.donor_id.toString(),
        campaign_id: d.campaign_id?.toString() || null,
        created_by_id: d.created_by_id?.toString() || null,
        amount: d.amount.toString() // Decimal to string
      })),
      meta: {
        total: result.total,
        page,
        limit,
        total_pages: Math.ceil(result.total / limit)
      }
    };
  }
}

export const donorService = new DonorService();
