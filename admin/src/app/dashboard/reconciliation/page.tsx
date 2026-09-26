'use client';

import { useState, useEffect } from 'react';
import { getReconciliationJobs, uploadReconciliationFile } from '@/lib/operations.api';
import { formatDate } from '@/lib/utils';
import { FileUp, Search, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BankReconciliationPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [csvContent, setCsvContent] = useState('');
  const [filename, setFilename] = useState('');

  useEffect(() => {
    loadJobs();
    const interval = setInterval(() => {
      setJobs(current => {
        if (current.some(j => j.status === 'PROCESSING')) {
          loadJobs();
        }
        return current;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadJobs() {
    try {
      const data = await getReconciliationJobs();
      setJobs(data);
    } catch (err: any) {
      console.error('Failed to load reconciliation jobs', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent || !filename) return;
    
    setUploading(true);
    setError(null);
    try {
      await uploadReconciliationFile(csvContent, filename);
      setCsvContent('');
      setFilename('');
      await loadJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bank Statement Reconciliation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your offline bank statement to automatically match and clear PENDING NEFT/RTGS pledges.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select CSV Statement</label>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={uploading || !csvContent}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          Start Reconciliation
        </button>
      </form>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            Recent Jobs
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading history...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm border-t border-gray-100">
            No reconciliation jobs have been run yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-xs md:max-w-md" title={job.filename}>
                      {job.filename}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded on: {formatDate(job.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {job.status === 'COMPLETED' && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Processed: <span className="font-semibold text-gray-900">{job.total_records}</span></span>
                        <span className="text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                          {job.matched_records} Matches Found
                        </span>
                      </div>
                    )}
                    
                    <div>
                      {job.status === 'PROCESSING' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Processing
                        </span>
                      )}
                      {job.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                      {job.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </div>
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
