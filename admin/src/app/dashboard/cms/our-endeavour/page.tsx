'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Loader2,
  Utensils, Users, School, Hospital, Heart, Shield, Activity, GraduationCap,
  Save
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  getOurEndeavourAdmin, 
  createMetric, 
  updateMetric, 
  deleteMetric,
  updateOurEndeavourSettings
} from '@/lib/our-endeavour.api';
import type { MetricItem, OurEndeavourSectionSettings } from '@/lib/our-endeavour.api';

const ICON_OPTIONS = [
  { value: 'Utensils', label: 'Food/Meals', icon: Utensils, color: '#1e88e5' },
  { value: 'Users', label: 'People', icon: Users, color: '#e91e63' },
  { value: 'School', label: 'Education', icon: School, color: '#ff9800' },
  { value: 'Hospital', label: 'Health', icon: Hospital, color: '#4caf50' },
  { value: 'Heart', label: 'Care/Love', icon: Heart, color: '#e91e63' },
  { value: 'Shield', label: 'Protection', icon: Shield, color: '#1e88e5' },
  { value: 'Activity', label: 'Progress', icon: Activity, color: '#4caf50' },
  { value: 'GraduationCap', label: 'Graduation', icon: GraduationCap, color: '#ff9800' },
];

export default function OurEndeavourCMSPage() {
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [sectionSettings, setSectionSettings] = useState<OurEndeavourSectionSettings>({
    badge: 'OUR IMPACT',
    heading: 'Our Endeavour As NGO',
    description: '',
    cta_text: 'Join Our Cause',
    cta_link: '/donate',
    updated_as_on: '04/10/2026'
  });
  
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingMetric, setCurrentEditingMetric] = useState<MetricItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    metric_name: '',
    metric_value: '',
    icon: 'Heart',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOurEndeavourAdmin();
      setMetrics(data.metrics || []);
      if (data.section) {
        setSectionSettings(data.section);
      }
    } catch {
      toast.error('Failed to load Our Endeavour content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleSaveSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateOurEndeavourSettings(sectionSettings);
      setSectionSettings(updated);
      toast.success('Section settings saved successfully');
    } catch {
      toast.error('Failed to update section settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const openAddModal = () => {
    setCurrentEditingMetric(null);
    setFormData({
      metric_name: '',
      metric_value: '',
      icon: 'Heart',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (metric: MetricItem) => {
    setCurrentEditingMetric(metric);
    setFormData({
      metric_name: metric.metric_name,
      metric_value: metric.metric_value,
      icon: metric.icon || 'Heart',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEditingMetric(null);
  };

  const handleSaveMetric = async () => {
    if (!formData.metric_name || !formData.metric_value) {
      toast.error('Please fill in required fields');
      return;
    }

    setActionLoading('save');
    try {
      if (currentEditingMetric) {
        await updateMetric(currentEditingMetric.id, formData);
        toast.success('Metric updated successfully');
      } else {
        await createMetric(formData);
        toast.success('Metric added successfully');
      }
      closeModal();
      fetchData();
    } catch {
      toast.error('Failed to save metric');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMetric = async (id: string) => {
    if (!confirm('Are you sure you want to delete this metric?')) return;
    setActionLoading(`delete-${id}`);
    try {
      await deleteMetric(id);
      toast.success('Metric deleted successfully');
      fetchData();
    } catch {
      toast.error('Failed to delete metric');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Our Endeavour</h1>
          <p className="text-gray-500 mt-1">Manage the impact metrics and section details on the homepage.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 py-2 px-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Metric
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Section Settings */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSaveSectionSettings} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-lime-500" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-lime-50 flex items-center justify-center">
                <Save className="w-4 h-4 text-lime-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Section Text</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Badge Text</label>
                <Input
                  value={sectionSettings.badge}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, badge: e.target.value })}
                  placeholder="e.g. OUR IMPACT"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Heading</label>
                <Input
                  value={sectionSettings.heading}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, heading: e.target.value })}
                  placeholder="e.g. Our Endeavour As NGO"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description (HTML allowed)</label>
                <textarea
                  value={sectionSettings.description}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, description: e.target.value })}
                  placeholder="Section paragraph text..."
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date Updated</label>
                <Input
                  value={sectionSettings.updated_as_on}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, updated_as_on: e.target.value })}
                  placeholder="e.g. 04/10/2026"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">CTA Text</label>
                  <Input
                    value={sectionSettings.cta_text}
                    onChange={(e) => setSectionSettings({ ...sectionSettings, cta_text: e.target.value })}
                    placeholder="e.g. Join Our Cause"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">CTA Link</label>
                  <Input
                    value={sectionSettings.cta_link}
                    onChange={(e) => setSectionSettings({ ...sectionSettings, cta_link: e.target.value })}
                    placeholder="e.g. /donate"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="mt-6 w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 py-2 px-4"
            >
              {savingSettings ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Save Settings
            </button>
          </form>
        </div>

        {/* Right Column - Cards List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Metrics Cards</h2>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {metrics.length} total
              </span>
            </div>

            {metrics.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No metrics found. Click "Add Metric" to create one.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {metrics.map((metric) => {
                  const IconMeta = ICON_OPTIONS.find(opt => opt.value === metric.icon) || ICON_OPTIONS[0];
                  const Icon = IconMeta.icon;

                  return (
                    <div key={metric.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${IconMeta.color}15` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: IconMeta.color }} />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {metric.metric_value} <span className="text-sm font-normal text-gray-500 ml-2">{metric.metric_name}</span>
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(metric)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMetric(metric.id)}
                          disabled={actionLoading === `delete-${metric.id}`}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {actionLoading === `delete-${metric.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {currentEditingMetric ? 'Edit Metric' : 'Add New Metric'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Metric Value</label>
                  <Input
                    value={formData.metric_value}
                    onChange={(e) => setFormData({ ...formData, metric_value: e.target.value })}
                    placeholder="e.g. 24.5M"
                  />
                  <p className="text-xs text-gray-500 mt-1">Includes numbers and suffixes (e.g. "172" or "6.9M")</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Metric Label</label>
                  <Input
                    value={formData.metric_name}
                    onChange={(e) => setFormData({ ...formData, metric_name: e.target.value })}
                    placeholder="e.g. Meals Served"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">Select Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = formData.icon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: opt.value })}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          isSelected 
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : ''}`} style={!isSelected ? { color: opt.color } : undefined} />
                        <span className="text-[10px] font-medium text-center leading-tight">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetric}
                disabled={actionLoading === 'save'}
                className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors flex items-center"
              >
                {actionLoading === 'save' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {currentEditingMetric ? 'Update Metric' : 'Add Metric'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
