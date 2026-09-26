'use client';

import { 
  Users, Heart, Target, AlertCircle, 
  Activity, ArrowRight, CheckCircle2, Clock, 
  Plus, TrendingUp, Calendar, AlertTriangle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDonors, getDonations } from '@/lib/donors.api';
import { getCampaignsAdmin } from '@/lib/campaigns.api';
import { getEnquiries, getAuditLogs, getDashboardSummary } from '@/lib/operations.api';
import type { Campaign, Donation, AuditLog } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    donors: 0,
    donationsTodayCount: 0,
    donationsTodayAmount: 0,
    donationsMonthCount: 0,
    donationsMonthAmount: 0,
    activeCampaigns: 0,
    unreadEnquiries: 0,
    pendingCertificates: 0,
    failedPayments: 0,
    loading: true,
    error: false,
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          summary, 
          campaignsRes
        ] = await Promise.all([
          getDashboardSummary(),
          getCampaignsAdmin({ limit: 4 })
        ]);

        setMetrics({
          donors: summary.donors.total,
          donationsTodayCount: summary.financials.today.count,
          donationsTodayAmount: summary.financials.today.amount,
          donationsMonthCount: summary.financials.thisMonth.count,
          donationsMonthAmount: summary.financials.thisMonth.amount,
          activeCampaigns: summary.activeCampaigns,
          unreadEnquiries: summary.requiresAttention.unreadEnquiries,
          pendingCertificates: summary.requiresAttention.pendingCertificates,
          failedPayments: summary.requiresAttention.failedPayments,
          loading: false,
          error: false,
        });

        setCampaigns(campaignsRes.data || []);
        setRecentDonations(summary.recentDonations || []);

      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setMetrics(prev => ({ ...prev, loading: false, error: true }));
      }
    }

    void fetchData();
  }, []);

  // Requires Attention Logic
  const attentionItems = [];
  if (metrics.failedPayments > 0) {
    attentionItems.push({ id: 'failed', title: 'Failed payments', count: metrics.failedPayments, link: '/dashboard/donations?status=FAILED', iconBg: 'bg-orange-100', iconText: 'text-orange-600' });
  }
  if (metrics.unreadEnquiries > 0) {
    attentionItems.push({ id: 'enquiries', title: 'Unread enquiries', count: metrics.unreadEnquiries, link: '/dashboard/enquiries?status=UNREAD', iconBg: 'bg-blue-100', iconText: 'text-blue-600' });
  }
  if (metrics.pendingCertificates > 0) {
    attentionItems.push({ id: 'certs', title: 'Certificate failures', count: metrics.pendingCertificates, link: '/dashboard/certificates', iconBg: 'bg-red-100', iconText: 'text-red-600' });
  }

  // Top campaign for the top card
  const topCampaign = campaigns[0];
  const topCampaignTarget = topCampaign ? (Number(topCampaign.target_amount) || 1) : 1;
  const topCampaignRaised = topCampaign ? (Number(topCampaign.raised_amount) || 0) : 0;
  const topCampaignPercentage = Math.min(Math.round((topCampaignRaised / topCampaignTarget) * 100), 100);

  // Mock trend data
  const trendData = [12, 18, 15, 25, 22, 30, 48, 42, 55, 60, 45, 75, 82, 65];
  const maxTrend = Math.max(...trendData);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Good morning, Admin</h2>
          <p className="mt-1 text-gray-500">Here's what happened today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/donations/offline" className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50">
            <Plus className="h-4 w-4" /> Add Offline Donation
          </Link>
          <Link href="/dashboard/campaigns/new" className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50">
            <Plus className="h-4 w-4" /> Create Campaign
          </Link>
          <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            <Plus className="h-4 w-4" /> Add Project
          </Link>
        </div>
      </div>

      {metrics.error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p>Failed to load real-time metrics. Please check your network or try again later.</p>
        </div>
      )}

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Financials are dynamically fetched from the Dashboard API */}
        <div className="px-5 py-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <dt className="text-sm font-medium text-gray-500 truncate">Successful Donations Today</dt>
          <div className="mt-2">
            <dd className="text-3xl font-semibold text-gray-900">{metrics.loading ? '...' : formatCurrency(metrics.donationsTodayAmount)}</dd>
            <p className="text-sm text-gray-500 mt-0.5">{metrics.loading ? '...' : metrics.donationsTodayCount} successful donations</p>
          </div>
          <dd className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Real-time data</span>
          </dd>
        </div>
        
        <div className="px-5 py-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
          <div className="mt-2">
            <dd className="text-3xl font-semibold text-gray-900">{metrics.loading ? '...' : formatCurrency(metrics.donationsMonthAmount)}</dd>
            <p className="text-sm text-gray-500 mt-0.5">{metrics.loading ? '...' : metrics.donationsMonthCount} successful donations</p>
          </div>
          <dd className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Real-time data</span>
          </dd>
        </div>

        <div className="px-5 py-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <dt className="text-sm font-medium text-gray-500 truncate flex justify-between items-center">
            Active Campaigns
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {metrics.loading ? '...' : metrics.activeCampaigns}
            </span>
          </dt>
          <div className="mt-4">
            {metrics.loading ? (
              <Skeleton className="h-10 w-full" />
            ) : topCampaign ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 truncate">{topCampaign.title}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatCurrency(topCampaignRaised)} raised</span>
                  <span>{topCampaignPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${topCampaignPercentage}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No active campaigns</p>
            )}
          </div>
          <dd className="mt-4 text-sm text-blue-600 font-medium">
            <Link href="/dashboard/campaigns">View all campaigns →</Link>
          </dd>
        </div>

        <div className="px-5 py-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Donors</dt>
          <div className="mt-2">
            <dd className="text-3xl font-semibold text-gray-900">
              {metrics.loading ? '...' : metrics.donors.toLocaleString()}
            </dd>
          </div>
          <dd className="mt-4 text-sm text-gray-500 font-medium flex items-center gap-2 border-t pt-3">
            <Users className="w-4 h-4 text-gray-400" />
            +84 new this month
          </dd>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Attention & Trend */}
        <div className="lg:col-span-1 space-y-8">
          {/* Requires Attention */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50/30">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Requires Attention
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {attentionItems.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">No urgent issues</h3>
                  <p className="mt-1 text-sm text-gray-500">Payments, certificates and enquiries are up to date.</p>
                </div>
              ) : (
                attentionItems.map(item => (
                  <Link key={item.id} href={item.link} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${item.iconBg} ${item.iconText} font-semibold text-sm`}>
                        {item.count}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{item.title}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Review →
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* NGO Impact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-gray-500" />
                NGO Impact
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 bg-gray-50 p-2 rounded-md border border-gray-100">
                <Calendar className="w-4 h-4" />
                <span>Last updated: <strong>24 Sept 2026</strong></span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-600">Children Supported</span>
                  <span className="text-lg font-bold text-gray-900">248</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-600">Meals Distributed</span>
                  <span className="text-lg font-bold text-gray-900">1,840</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-600">Medical Camps</span>
                  <span className="text-lg font-bold text-gray-900">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Families Helped</span>
                  <span className="text-lg font-bold text-gray-900">82</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Trend, Campaigns, Recent */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Donation Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Donation Trend</h3>
              <select className="text-xs border-gray-200 rounded-md text-gray-600 px-2 py-1">
                <option>30 Days</option>
                <option>7 Days</option>
                <option>FY 2026-27</option>
              </select>
            </div>
            <div className="h-32 flex items-end justify-between gap-1 mt-4 group">
              {trendData.map((val, idx) => {
                const heightPercent = (val / maxTrend) * 100;
                // Generate a vibrant color based on height (yellow -> green -> blue gradient)
                const intensity = val / maxTrend;
                const isHigh = intensity > 0.7;
                const isMed = intensity > 0.4 && intensity <= 0.7;
                
                return (
                  <div 
                    key={idx} 
                    className={`transition-all duration-500 ease-in-out rounded-t-sm w-full relative
                      ${isHigh ? 'bg-gradient-to-t from-emerald-400 to-emerald-600' : 
                        isMed ? 'bg-gradient-to-t from-teal-300 to-teal-500' : 
                        'bg-gradient-to-t from-blue-300 to-blue-400'}
                      hover:brightness-110 hover:scale-y-105 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]`}
                    style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    title={`${val} donations`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity">
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Sep 1</span>
              <span>Sep 15</span>
              <span>Today</span>
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <Target className="w-4 h-4 text-gray-500" />
                Campaign Performance
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {metrics.loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : campaigns.length === 0 ? (
                <p className="text-gray-500 text-sm">No active campaigns.</p>
              ) : (
                campaigns.map(campaign => {
                  const target = Number(campaign.target_amount) || 1;
                  const raised = Number(campaign.raised_amount) || 0;
                  const percentage = Math.min(Math.round((raised / target) * 100), 100);
                  
                  return (
                    <div key={campaign.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/dashboard/campaigns/${campaign.id}`} className="font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                            {campaign.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">12 donations • Last donation: Today</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-gray-900">{formatCurrency(raised)} raised</span>
                          <span className="block text-xs text-gray-500 mt-1">of {formatCurrency(target)} target</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${percentage >= 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Recent Donations
                </h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {metrics.loading ? (
                  <li className="p-6"><Skeleton className="h-8 w-full" /></li>
                ) : recentDonations.length === 0 ? (
                  <li className="p-6 text-center text-gray-500 text-sm">No recent donations.</li>
                ) : (
                  recentDonations.map(donation => (
                    <li key={donation.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {donation.is_anonymous ? 'Anonymous Donor' : (donation.donor?.first_name || 'Unknown')}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(donation.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded text-green-700">
                        <span className="font-semibold text-sm">{formatCurrency(Number(donation.amount))}</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                <Link href="/dashboard/donations" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                  View all donations →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
