'use client';

import { useState, useEffect } from 'react';
import { getDuplicateSuggestions, resolveDuplicateSuggestion } from '@/lib/donors.api';
import { Users, AlertTriangle, Check, X, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DuplicateDonorsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      const res = await getDuplicateSuggestions(1, 50);
      setSuggestions(res.data);
    } catch (err: any) {
      console.error('Failed to load duplicate suggestions', err);
      setError(err.response?.data?.message || 'Failed to load duplicates');
    } finally {
      setLoading(false);
    }
  }

  const handleResolve = async (id: string, action: 'merge' | 'ignore') => {
    setResolvingId(id);
    try {
      await resolveDuplicateSuggestion(id, action);
      // Remove from list
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${action} suggestion.`);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Duplicate Donor Detection</h1>
          <p className="mt-1 text-sm text-gray-500">
            The system automatically scans for identical emails or phone numbers. Review and merge records to maintain a clean CRM.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Pending Merge Suggestions
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Scanning for duplicates...</div>
        ) : suggestions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm border-t border-gray-100 flex flex-col items-center">
            <div className="bg-green-50 text-green-600 rounded-full p-3 mb-3">
              <Check className="w-6 h-6" />
            </div>
            Your CRM is clean! No duplicate donors found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {suggestions.map((s) => (
              <li key={s.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Primary Donor */}
                  <div className="flex-1 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <span className="text-xs font-bold uppercase text-blue-600 mb-2 block">Primary Record</span>
                    <Link href={`/dashboard/donors/${s.primary_donor.id}`} className="text-sm font-semibold text-gray-900 hover:underline">
                      {s.primary_donor.first_name} {s.primary_donor.last_name || ''}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>ID: {s.primary_donor.donor_number}</p>
                      <p>Email: {s.primary_donor.email || 'N/A'}</p>
                      <p>Phone: {s.primary_donor.phone || 'N/A'}</p>
                      <p>Joined: {formatDate(s.primary_donor.created_at)}</p>
                    </div>
                  </div>

                  {/* Match Reason */}
                  <div className="flex flex-col items-center justify-center shrink-0 text-gray-400">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">{s.reason}</span>
                  </div>

                  {/* Duplicate Donor */}
                  <div className="flex-1 bg-red-50/50 p-4 rounded-lg border border-red-100">
                    <span className="text-xs font-bold uppercase text-red-600 mb-2 block">Duplicate Record</span>
                    <Link href={`/dashboard/donors/${s.duplicate_donor.id}`} className="text-sm font-semibold text-gray-900 hover:underline">
                      {s.duplicate_donor.first_name} {s.duplicate_donor.last_name || ''}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>ID: {s.duplicate_donor.donor_number}</p>
                      <p>Email: {s.duplicate_donor.email || 'N/A'}</p>
                      <p>Phone: {s.duplicate_donor.phone || 'N/A'}</p>
                      <p>Joined: {formatDate(s.duplicate_donor.created_at)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 w-32">
                    <button
                      onClick={() => handleResolve(s.id, 'merge')}
                      disabled={resolvingId === s.id}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors disabled:opacity-50"
                    >
                      {resolvingId === s.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Merge
                    </button>
                    <button
                      onClick={() => handleResolve(s.id, 'ignore')}
                      disabled={resolvingId === s.id}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                      Ignore
                    </button>
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
