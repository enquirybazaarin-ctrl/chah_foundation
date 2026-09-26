'use client';

import { useState, useEffect } from 'react';
import { getForm10BEReports, generateForm10BE } from '@/lib/operations.api';
import { formatDate } from '@/lib/utils';
import { FileText, Download, Play, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Form10BEPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // E.g., generate for previous FY automatically by default
  const [selectedFY, setSelectedFY] = useState('2023-2024');

  useEffect(() => {
    loadReports();
    // Poll every 10 seconds if any report is PENDING
    const interval = setInterval(() => {
      setReports(current => {
        if (current.some(r => r.status === 'PENDING')) {
          loadReports();
        }
        return current;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadReports() {
    try {
      const data = await getForm10BEReports();
      setReports(data);
    } catch (err: any) {
      console.error('Failed to load 10BE reports', err);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = async () => {
    if (!selectedFY) return;
    setGenerating(true);
    setError(null);
    try {
      await generateForm10BE(selectedFY);
      await loadReports();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to trigger generation.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Form 10BE Bulk Generation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Automatically compile and export the consolidated 80G donor list for Income Tax e-Filing.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
          <select 
            value={selectedFY} 
            onChange={(e) => setSelectedFY(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Generate Report
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Generated Reports
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading history...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm border-t border-gray-100">
            No Form 10BE reports have been generated yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      FY {report.financial_year}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Triggered on: {formatDate(report.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {report.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Processing...
                      </span>
                    )}
                    {report.status === 'COMPLETED' && (
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready
                        </span>
                        <a 
                          href={report.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4 text-blue-600" />
                          Download CSV
                        </a>
                      </>
                    )}
                    {report.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
