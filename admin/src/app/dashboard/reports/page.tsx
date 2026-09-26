'use client';

import { 
  Download, FileSpreadsheet, Users, Target, 
  CreditCard, FileBadge, FileText, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { triggerExport } from '@/lib/operations.api';

export default function ReportsPage() {
  const handleExport = (reportEndpoint: string) => {
    triggerExport(reportEndpoint);
  };

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Exports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Export financial and operational data for accounting, compliance, and management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Donations Ledger */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Donations Ledger</h3>
            <p className="mt-2 text-sm text-gray-500">
              Export donation transactions for accounting and compliance.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl hover:bg-gray-100 transition-colors">
            <button 
              onClick={() => handleExport('donations')}
              className="flex w-full items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Donations CSV
            </button>
          </div>
        </div>

        {/* Donor Database */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4 text-green-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Donor Database</h3>
            <p className="mt-2 text-sm text-gray-500">
              Export donor records and contribution summaries for authorized use.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl hover:bg-gray-100 transition-colors">
            <button 
              onClick={() => handleExport('donors')}
              className="flex w-full items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Donors CSV
            </button>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
            <p className="mt-2 text-sm text-gray-500">
              Export fundraising performance by campaign.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl hover:bg-gray-100 transition-colors">
            <button 
              onClick={() => handleExport('campaigns')}
              className="flex w-full items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Campaign Report
            </button>
          </div>
        </div>

        {/* Payment Reconciliation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-4 text-yellow-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Reconciliation</h3>
            <p className="mt-2 text-sm text-gray-500">
              Export payment transactions for reconciliation and financial review.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl hover:bg-gray-100 transition-colors">
            <button 
              onClick={() => handleExport('payments')}
              className="flex w-full items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Payments CSV
            </button>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
              <FileBadge className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Certificates</h3>
            <p className="mt-2 text-sm text-gray-500">
              Export certificate generation and email status.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl hover:bg-gray-100 transition-colors">
            <button 
              onClick={() => handleExport('certificates')}
              className="flex w-full items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Certificate Report
            </button>
          </div>
        </div>

        {/* 80G / Tax Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">80G / Tax Data</h3>
            <p className="mt-2 text-sm text-gray-500">
              Review and export donation tax information.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-between">
            <Link 
              href="/dashboard/compliance"
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Review <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <button 
              onClick={() => handleExport('Tax Data')}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
