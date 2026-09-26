'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { createCampaign } from '@/lib/campaigns.api';
import type { CreateCampaignPayload, UpdateCampaignPayload } from '@/lib/types';

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateCampaignPayload | UpdateCampaignPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const campaign = await createCampaign(payload as CreateCampaignPayload);
      // Navigate to the campaign detail/edit page on success
      router.push(`/dashboard/campaigns/${campaign.id}?created=1`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        axiosErr?.response?.data?.message ?? 'Failed to create campaign. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back Navigation */}
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Back to campaigns list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Create New Campaign</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to launch a new fundraising campaign.
          </p>
        </div>
        <div className="px-6 py-6">
          <CampaignForm
            onSubmit={handleSubmit}
            submitLabel="Create Campaign"
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      </div>
    </div>
  );
}
