import cron from 'node-cron';
import { prisma } from '../../config/database';
import { donationService } from '../donations/donation.service';
import { emailService } from '../emails/email.service';

export const initCronJobs = () => {
  // 1. Subscription Retry Job (Runs daily at 8 AM)
  cron.schedule('0 8 * * *', async () => {
    console.log('Running Subscription Retry Job');
    try {
      const pendingRetries = await prisma.subscriptionRetryPolicy.findMany({
        where: {
          status: 'ACTIVE',
          next_retry_at: {
            lte: new Date(),
          },
        },
      });

      for (const retry of pendingRetries) {
        // Logic to retry Razorpay subscription charge would go here
        // Since Razorpay handles retries internally in most cases, 
        // this is useful if the NGO wants to prompt the donor to update their card via SMS/Email.

        // Increment retry count
        const newCount = retry.retry_count + 1;
        const nextRetry = new Date();
        nextRetry.setDate(nextRetry.getDate() + 2); // Wait 2 days between retries

        await prisma.subscriptionRetryPolicy.update({
          where: { id: retry.id },
          data: {
            retry_count: newCount,
            next_retry_at: newCount >= retry.max_retries ? null : nextRetry,
            status: newCount >= retry.max_retries ? 'EXHAUSTED' : 'ACTIVE',
          },
        });

        // Add to audit logs
        await prisma.auditLog.create({
          data: {
            action: 'SUBSCRIPTION_RETRY_TRIGGERED',
            entity_type: 'SUBSCRIPTION_RETRY_POLICY',
            entity_id: retry.id,
            new_values: { retry_count: newCount },
            ip_address: 'system-cron',
            user_agent: 'node-cron',
          },
        });
      }
    } catch (error) {
      console.error('Subscription Retry Job failed:', error);
    }
  });

  // 2. Certificate Retry Job (Runs every hour)
  cron.schedule('0 * * * *', async () => {
    console.log('Running Certificate Retry Job');
    try {
      // Find failed email logs for certificates
      const failedEmails = await prisma.emailLog.findMany({
        where: {
          related_entity_type: 'CERTIFICATE',
          delivery_status: 'FAILED',
        },
      });

      for (const log of failedEmails) {
        if (log.related_entity_id) {
          try {
            // Re-fetch certificate info
            const certificate = await prisma.certificate.findUnique({
              where: { id: log.related_entity_id },
              include: { donation: true }
            });
            
            if (certificate && certificate.certificate_number) {
              await emailService.sendDonationReceipt(certificate.donation_id, certificate.certificate_number);
              
              // Mark old log as resolved or create new one
              await prisma.emailLog.update({
                where: { id: log.id },
                data: { delivery_status: 'DELIVERED', updated_at: new Date() } // Simplified
              });
              
              await prisma.auditLog.create({
                data: {
                  action: 'CERTIFICATE_RETRY_SUCCESS',
                  entity_type: 'CERTIFICATE',
                  entity_id: certificate.id,
                  ip_address: 'system-cron',
                  user_agent: 'node-cron',
                }
              });
            }
          } catch (emailErr) {
            console.error(`Failed to retry email for certificate ${log.related_entity_id}:`, emailErr);
          }
        }
      }
    } catch (error) {
      console.error('Certificate Retry Job failed:', error);
    }
  });

  // 3. Donor Auto-Tagging Job (Runs daily at 2:00 AM)
  cron.schedule('0 2 * * *', async () => {
    console.log('Running Donor Auto-Tagging Job');
    try {
      // 1. Tag "Lapsed" donors (no successful donations in last 365 days)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const lapsedDonors = await prisma.donor.findMany({
        where: {
          donations: {
            none: {
              status: 'SUCCESS',
              created_at: { gte: oneYearAgo }
            }
          }
        },
        select: { id: true }
      });

      for (const donor of lapsedDonors) {
        await prisma.donorTag.upsert({
          where: { donor_id_tag_name: { donor_id: donor.id, tag_name: 'Lapsed' } },
          update: {},
          create: { donor_id: donor.id, tag_name: 'Lapsed' }
        });
      }
      
      // 2. Tag "Major Donor" (total donations > 100,000)
      const majorDonors = await prisma.donation.groupBy({
        by: ['donor_id'],
        where: { status: 'SUCCESS' },
        having: { amount: { _sum: { gt: 100000 } } }
      });
      
      for (const donor of majorDonors) {
        await prisma.donorTag.upsert({
          where: { donor_id_tag_name: { donor_id: donor.donor_id, tag_name: 'Major Donor' } },
          update: {},
          create: { donor_id: donor.donor_id, tag_name: 'Major Donor' }
        });
      }
      
    } catch (error) {
      console.error('Donor Auto-Tagging Job failed:', error);
    }
  });

  // 4. Duplicate Donor Detection (Runs daily at 3:00 AM)
  cron.schedule('0 3 * * *', async () => {
    console.log('Running Duplicate Donor Detection Job');
    try {
      // This is a naive implementation for demo purposes. 
      // In production, we'd use raw SQL or specialized grouping to find duplicates efficiently.
      
      // Find emails with multiple donors
      const duplicateEmails = await prisma.donor.groupBy({
        by: ['email'],
        having: { email: { _count: { gt: 1 } } }
      });
      
      for (const { email } of duplicateEmails) {
        if (!email) continue;
        const donors = await prisma.donor.findMany({ where: { email }, orderBy: { created_at: 'asc' } });
        const primary = donors[0];
        
        for (let i = 1; i < donors.length; i++) {
          await prisma.duplicateDonorSuggestion.upsert({
            where: { primary_donor_id_duplicate_id: { primary_donor_id: primary.id, duplicate_id: donors[i].id } },
            update: {},
            create: {
              primary_donor_id: primary.id,
              duplicate_id: donors[i].id,
              reason: 'MATCHING_EMAIL'
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Duplicate Donor Detection Job failed:', error);
    }
  });

  // 5. Impact Metric Sync (Runs daily at 1:00 AM)
  cron.schedule('0 1 * * *', async () => {
    console.log('Running Impact Metric Sync Job');
    try {
      // Calculate total amount raised
      const totalDonations = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      });
      
      const amount = totalDonations._sum.amount || 0;
      const formattedAmount = `₹${(Number(amount) / 100000).toFixed(2)}L+`; // e.g. ₹5.50L+

      await prisma.impactMetric.upsert({
        where: { id: 1 }, // Assuming ID 1 is "Funds Raised"
        update: { metric_value: formattedAmount },
        create: {
          id: 1,
          metric_name: 'Funds Raised',
          metric_value: formattedAmount,
          icon: 'Heart'
        }
      });
      
      // We can also sync "Total Donors" etc.
      const totalDonors = await prisma.donor.count({ where: { status: 'ACTIVE' } });
      await prisma.impactMetric.upsert({
        where: { id: 2 },
        update: { metric_value: `${totalDonors}+` },
        create: {
          id: 2,
          metric_name: 'Active Donors',
          metric_value: `${totalDonors}+`,
          icon: 'Users'
        }
      });
      
    } catch (error) {
      console.error('Impact Metric Sync Job failed:', error);
    }
  });

  // 6. Admin Daily Digest (Runs daily at 8:00 AM)
  cron.schedule('0 8 * * *', async () => {
    console.log('Running Admin Daily Digest Job');
    try {
      // Get the admin email from settings
      const adminEmailSetting = await prisma.setting.findUnique({
        where: { setting_key: 'NGO_CONTACT_EMAIL' }
      });
      
      const adminEmail = adminEmailSetting?.setting_value || process.env.ADMIN_EMAIL;
      if (!adminEmail) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const donations = await prisma.donation.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where: {
          status: 'SUCCESS',
          created_at: { gte: yesterday, lt: today }
        }
      });

      const newDonorsCount = await prisma.donor.count({
        where: {
          created_at: { gte: yesterday, lt: today }
        }
      });

      if (donations._count.id > 0 || newDonorsCount > 0) {
        await emailService.sendAdminDigest({
          date: yesterday.toISOString().split('T')[0],
          totalAmount: donations._sum.amount?.toString() || '0',
          donationCount: donations._count.id,
          newDonors: newDonorsCount,
          adminEmail
        });
      }

    } catch (error) {
      console.error('Admin Daily Digest Job failed:', error);
    }
  });
};
