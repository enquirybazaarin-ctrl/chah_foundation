'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOfflineDonation } from '@/lib/donors.api';
import { getCampaignsAdmin } from '@/lib/campaigns.api';
import type { Campaign } from '@/lib/types';
import { ArrowLeft, Save, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function AddOfflineDonationPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [formData, setFormData] = useState({
    amount: '',
    payment_type: 'CASH',
    campaign_id: '',
    is_anonymous: false,
    notes: '',
    donor: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      pan_number: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    }
  });

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await getCampaignsAdmin({ limit: 100 });
        const active = res.data.filter(c => c.status === 'ACTIVE');
        setCampaigns(active);
      } catch (err) {
        console.error('Failed to load campaigns for dropdown', err);
      }
    }
    loadCampaigns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.startsWith('donor.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        donor: { ...prev.donor, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? isChecked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      const payload = {
        amount,
        payment_type: formData.payment_type,
        campaign_id: formData.campaign_id || undefined,
        is_anonymous: formData.is_anonymous,
        notes: formData.notes || undefined,
        donor: {
          ...formData.donor,
          email: formData.donor.email || undefined,
          phone: formData.donor.phone || undefined,
          pan_number: formData.donor.pan_number || undefined,
          last_name: formData.donor.last_name || undefined,
        }
      };

      await createOfflineDonation(payload);
      router.push('/dashboard/donations');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to record donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Offline Donation</h1>
          <p className="mt-1 text-sm text-gray-500">Record a donation received via cash, cheque, or direct bank transfer.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Donation Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Donation Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  required 
                  min="1"
                  className="pl-9 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
              <select 
                name="payment_type" 
                value={formData.payment_type} 
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign (Optional)</label>
              <select 
                name="campaign_id" 
                value={formData.campaign_id} 
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="">General Fund (No Campaign)</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Notes (Optional)</label>
              <input 
                type="text" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                placeholder="Cheque number, bank reference, etc."
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mt-2">
                <input 
                  type="checkbox" 
                  id="is_anonymous" 
                  name="is_anonymous" 
                  checked={formData.is_anonymous} 
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-900">
                  Mark as Anonymous Donation (Donor name will be hidden from public)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Donor Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Donor Details</h3>
            <span className="text-xs text-gray-500">Used for 80G Receipts</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input 
                type="text" 
                name="donor.first_name" 
                value={formData.donor.first_name} 
                onChange={handleChange} 
                required 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                name="donor.last_name" 
                value={formData.donor.last_name} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="donor.email" 
                value={formData.donor.email} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text" 
                name="donor.phone" 
                value={formData.donor.phone} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input 
                type="text" 
                name="donor.pan_number" 
                value={formData.donor.pan_number} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                type="text" 
                name="donor.address" 
                value={formData.donor.address} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                name="donor.city" 
                value={formData.donor.city} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input 
                type="text" 
                name="donor.state" 
                value={formData.donor.state} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input 
                type="text" 
                name="donor.pincode" 
                value={formData.donor.pincode} 
                onChange={handleChange} 
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 gap-4">
          <Link 
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Record Offline Donation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
