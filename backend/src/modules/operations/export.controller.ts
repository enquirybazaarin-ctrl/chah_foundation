import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { format } from 'date-fns';

const escapeCsv = (str: string | null | undefined) => {
  if (str === null || str === undefined) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const sendCsv = (res: Response, filename: string, csvContent: string) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
  res.status(200).send(csvContent);
};

export const exportDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { created_at: 'desc' },
      include: { donor: true, campaign: true }
    });

    const headers = ['Donation ID', 'Date', 'Amount', 'Currency', 'Status', 'Payment Type', 'Donor Name', 'Donor Email', 'Campaign'];
    const rows = donations.map(d => [
      d.donation_number,
      format(d.created_at, 'yyyy-MM-dd HH:mm:ss'),
      d.amount.toString(),
      d.currency,
      d.status,
      d.payment_type,
      `${d.donor.first_name} ${d.donor.last_name || ''}`.trim(),
      d.donor.email || '',
      d.campaign?.title || 'General'
    ]);

    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
    sendCsv(res, `donations_export_${format(new Date(), 'yyyyMMdd')}`, csv);
  } catch (err) {
    next(err);
  }
};

export const exportDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const donors = await prisma.donor.findMany({
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { donations: { where: { status: 'SUCCESS' } } } } }
    });

    const headers = ['Donor ID', 'First Name', 'Last Name', 'Email', 'Phone', 'PAN', 'Joined Date', 'Successful Donations'];
    const rows = donors.map(d => [
      d.donor_number,
      d.first_name,
      d.last_name || '',
      d.email || '',
      d.phone || '',
      d.pan_number || '',
      format(d.created_at, 'yyyy-MM-dd'),
      d._count.donations.toString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
    sendCsv(res, `donors_export_${format(new Date(), 'yyyyMMdd')}`, csv);
  } catch (err) {
    next(err);
  }
};

export const exportCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { created_at: 'desc' },
      include: { category: true }
    });

    const headers = ['Title', 'Category', 'Status', 'Target Amount', 'Raised Amount', 'Created Date'];
    const rows = campaigns.map(c => [
      c.title,
      c.category.name,
      c.status,
      c.target_amount ? c.target_amount.toString() : 'No Target',
      c.raised_amount.toString(),
      format(c.created_at, 'yyyy-MM-dd')
    ]);

    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
    sendCsv(res, `campaigns_export_${format(new Date(), 'yyyyMMdd')}`, csv);
  } catch (err) {
    next(err);
  }
};

export const exportCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { created_at: 'desc' },
      include: { donation: { include: { donor: true } } }
    });

    const headers = ['Certificate Number', 'Status', 'Date Generated', 'Donation ID', 'Donor Name', 'Amount'];
    const rows = certificates.map(c => [
      c.certificate_number,
      c.status,
      c.generated_at ? format(c.generated_at, 'yyyy-MM-dd HH:mm:ss') : 'Pending',
      c.donation.donation_number,
      `${c.donation.donor.first_name} ${c.donation.donor.last_name || ''}`.trim(),
      c.donation.amount.toString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
    sendCsv(res, `certificates_export_${format(new Date(), 'yyyyMMdd')}`, csv);
  } catch (err) {
    next(err);
  }
};
