'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getSettings, upsertSetting, deleteSetting } from '@/lib/settings.api';
import type { Setting } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New setting state
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Edit state map: key -> string value
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
      
      const edits: Record<string, string> = {};
      data.forEach(s => {
        edits[s.setting_key] = s.setting_value;
      });
      setEditValues(edits);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveSetting = async (key: string) => {
    const val = editValues[key];
    if (val === undefined) return;

    setSavingKeys(prev => ({ ...prev, [key]: true }));
    setError(null);
    setSuccess(null);

    try {
      await upsertSetting({ setting_key: key, setting_value: val });
      setSuccess(`Setting "${key}" updated successfully.`);
      await loadSettings();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update ${key}.`);
    } finally {
      setSavingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the setting "${key}"?`)) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      await deleteSetting(key);
      setSuccess(`Setting "${key}" deleted successfully.`);
      await loadSettings();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to delete ${key}.`);
    }
  };

  const handleCreateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      setError('Both Key and Value are required.');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await upsertSetting({ setting_key: newKey.trim(), setting_value: newValue.trim() });
      setSuccess(`Setting "${newKey}" created successfully.`);
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
      await loadSettings();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to create setting.`);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Global Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage key-value configuration for the platform (e.g. contact email, social links, API keys).
          </p>
          <div className="mt-2 text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Common Automation Keys:</span> NGO_CONTACT_EMAIL (Receives daily digest & alerts)
          </div>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Setting
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200 flex justify-between">
          <p className="text-sm text-green-700">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">&times;</button>
        </div>
      )}

      {/* Add New Setting Form */}
      {isAdding && (
        <form onSubmit={handleCreateSetting} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Setting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new_key" className="block text-sm font-medium text-gray-700">Setting Key</label>
              <input
                id="new_key"
                type="text"
                placeholder="e.g. CONTACT_EMAIL"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border font-mono"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              />
            </div>
            <div>
              <label htmlFor="new_value" className="block text-sm font-medium text-gray-700">Value</label>
              <textarea
                id="new_value"
                rows={3}
                placeholder="Value..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border font-mono"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              Save Setting
            </button>
          </div>
        </form>
      )}

      {/* List Settings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : settings.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No settings found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {settings.map((setting) => (
              <li key={setting.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-900 font-mono break-all">
                      {setting.setting_key}
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Updated: {new Date(setting.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-2/3 flex flex-col gap-3">
                    <textarea
                      rows={Math.max(2, (editValues[setting.setting_key]?.match(/\n/g)||[]).length + 1)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border font-mono"
                      value={editValues[setting.setting_key] ?? ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, [setting.setting_key]: e.target.value }))}
                    />
                    
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleDeleteSetting(setting.setting_key)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      <button
                        onClick={() => handleSaveSetting(setting.setting_key)}
                        disabled={savingKeys[setting.setting_key] || editValues[setting.setting_key] === setting.setting_value}
                        className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingKeys[setting.setting_key] ? (
                           <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]" />
                        ) : (
                          <Save className="h-4 w-4 text-blue-600" />
                        )}
                        Save Update
                      </button>
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
