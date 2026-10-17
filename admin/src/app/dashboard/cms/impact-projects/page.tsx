'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2,
  Save,
  Target,
  ExternalLink,
  ImageIcon,
  Info
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  getImpactSectionAdmin, 
  updateImpactSectionSettings
} from '@/lib/impact-projects.api';
import type { ImpactSectionSettings } from '@/lib/impact-projects.api';
import Link from 'next/link';

export default function ImpactProjectsCMSPage() {
  const [sectionSettings, setSectionSettings] = useState<ImpactSectionSettings>({
    badge: 'OUR IMPACT',
    heading: 'Real work. Real communities. Real change.',
    subheading: 'Explore some of the initiatives we have carried out with communities and the people we serve.',
  });
  
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getImpactSectionAdmin();
      if (data.section) {
        setSectionSettings(data.section);
      }
    } catch {
      toast.error('Failed to load Impact Projects content');
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
      const updated = await updateImpactSectionSettings(sectionSettings);
      setSectionSettings(updated);
      toast.success('Section settings saved successfully');
    } catch {
      toast.error('Failed to update section settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-4">
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Impact Projects Section</h1>
          <p className="text-gray-500 mt-1">Manage the heading and text for the past projects section.</p>
        </div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-zinc-100 text-zinc-900 hover:bg-zinc-200 h-10 py-2 px-4"
        >
          <Target className="mr-2 h-4 w-4" /> Manage Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Section Settings */}
        <div className="lg:col-span-5 space-y-6">
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
                  placeholder="e.g. Real work. Real communities."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Subheading</label>
                <textarea
                  value={sectionSettings.subheading}
                  onChange={(e) => setSectionSettings({ ...sectionSettings, subheading: e.target.value })}
                  placeholder="Section paragraph text..."
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
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

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-inner p-8 flex flex-col items-center justify-center text-center">
             <Target className="w-12 h-12 text-gray-400 mb-4" />
             <h3 className="text-lg font-bold text-gray-900 mb-2">Projects Content</h3>
             <p className="text-gray-500 mb-6 max-w-md">The project cards displayed in this section are pulled automatically from your active and featured Projects.</p>
             <Link 
               href="/dashboard/projects"
               className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
             >
               Go to Projects Manager <ExternalLink className="w-4 h-4 ml-1" />
             </Link>
          </div>

          {/* Recommended Image Size Guide for Our Impact Section */}
          <div className="bg-lime-50/80 border border-lime-200/90 rounded-2xl p-5 text-xs text-lime-950 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-lime-100 text-lime-800 border border-lime-200 shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-lime-900 text-sm">Recommended Image Sizes for Our Impact Section</h4>
                <p className="text-lime-700 text-[11px]">Use these dimensions when uploading project media to prevent cropping on desktop and mobile:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/90 border border-lime-200/80 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lime-950 text-xs">Card Cover Photo</span>
                  <span className="font-mono font-bold text-lime-900 bg-lime-100/70 px-2 py-0.5 rounded text-[11px]">
                    800 × 600 px
                  </span>
                </div>
                <p className="text-lime-800 text-[11px] leading-relaxed">
                  Exact <strong>4:3 aspect ratio</strong>. Guarantees the card cover photograph displays edge-to-edge with <strong>zero crop</strong> across phones, tablets, and desktops.
                </p>
              </div>

              <div className="bg-white/90 border border-lime-200/80 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lime-950 text-xs">Program Hero Banner</span>
                  <span className="font-mono font-bold text-lime-900 bg-lime-100/70 px-2 py-0.5 rounded text-[11px]">
                    1920 × 820 px
                  </span>
                </div>
                <p className="text-lime-800 text-[11px] leading-relaxed">
                  Wide <strong>21:9 or 16:9 ratio</strong>. Ideal for the top header hero banner on the public project detail page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
