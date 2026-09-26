'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Clock } from 'lucide-react';
import { getProjectById, updateProject, createProjectActivity, deleteProjectActivity } from '@/lib/projects.api';
import type { Project, ProjectStatus, UpdateProjectPayload, CreateProjectActivityPayload, ProjectActivity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateProjectPayload>({});
  
  // Timeline Activity State
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityForm, setActivityForm] = useState<CreateProjectActivityPayload>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadProject();
  }, [params.id]);

  async function loadProject() {
    try {
      const data = await getProjectById(params.id);
      setProject(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        status: data.status,
        start_date: data.start_date?.split('T')[0] || '',
        end_date: data.end_date?.split('T')[0] || '',
      });
    } catch (err: any) {
      setError('Failed to load project details.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        description: formData.description || null,
      };

      const updatedProject = await updateProject(params.id, payload);
      setProject(updatedProject);
      setSuccessMsg('Project updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await createProjectActivity(params.id, {
        ...activityForm,
        date: activityForm.date ? new Date(activityForm.date).toISOString() : undefined,
      });
      setIsAddingActivity(false);
      setActivityForm({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
      await loadProject(); // Reload to get fresh activities
      setSuccessMsg('Activity added successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add activity.');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    setError(null);
    try {
      await deleteProjectActivity(params.id, activityId);
      await loadProject();
      setSuccessMsg('Activity deleted successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete activity.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Project Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">The project you are looking for does not exist or was deleted.</p>
        <Link href="/dashboard/projects" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Back to projects"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
          <p className="mt-1 text-sm text-gray-500 font-mono">
            ID: {project.id}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200 flex justify-between items-center">
          <p className="text-sm text-green-700">{successMsg}</p>
          <button onClick={() => setSuccessMsg(null)} className="text-green-700 hover:text-green-900">&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Project Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3"
                  value={formData.title || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3"
                  value={formData.status || 'PLANNED'}
                  onChange={handleChange}
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                URL Slug
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3 font-mono text-sm"
                  value={formData.slug || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="start_date" className="block text-sm font-medium leading-6 text-gray-900">
                Start Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="end_date" className="block text-sm font-medium leading-6 text-gray-900">
                End Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50 rounded-b-xl">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>

      {/* Activities Timeline Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold leading-6 text-gray-900">Project Timeline & Activities</h2>
            <p className="mt-1 text-sm text-gray-500">Track milestones, updates, and progress for this project.</p>
          </div>
          {!isAddingActivity && (
            <button
              type="button"
              onClick={() => setIsAddingActivity(true)}
              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </button>
          )}
        </div>

        {isAddingActivity && (
          <form onSubmit={handleAddActivity} className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">New Activity Update</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="activityTitle" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="activityTitle"
                    name="title"
                    required
                    value={activityForm.title}
                    onChange={handleActivityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g. Survey Completed"
                  />
                </div>
                <div>
                  <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="activityDate"
                    name="date"
                    value={activityForm.date || ''}
                    onChange={handleActivityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="activityDesc" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="activityDesc"
                  name="description"
                  rows={2}
                  value={activityForm.description || ''}
                  onChange={handleActivityChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="Details about this update..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingActivity(false)}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Post Update
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          {(!project.activities || project.activities.length === 0) ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              No timeline activities have been posted yet.
            </div>
          ) : (
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {project.activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== project.activities!.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                            <Clock className="h-4 w-4 text-blue-600" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                            {activity.description && (
                              <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="whitespace-nowrap text-right text-xs text-gray-500">
                              {activity.date ? formatDate(activity.date) : formatDate(activity.created_at)}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete activity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
