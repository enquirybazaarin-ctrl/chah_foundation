import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Project,
  ProjectQueryParams,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectActivity,
  CreateProjectActivityPayload,
} from './types';

export async function getProjectsAdmin(
  params: ProjectQueryParams = {}
): Promise<PaginatedResponse<Project>> {
  const res = await api.get<{ status: string; data: { projects: Project[]; meta: any } }>(
    '/api/v1/projects',
    { params }
  );
  const { projects, meta } = res.data.data;
  return {
    data: projects,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

export async function getProjectById(id: string): Promise<Project> {
  const res = await api.get<{ status: string; data: { project: Project } }>(`/api/v1/projects/${id}`);
  return res.data.data.project;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const res = await api.post<{ status: string; data: { project: Project } }>('/api/v1/projects', payload);
  return res.data.data.project;
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  const res = await api.patch<{ status: string; data: { project: Project } }>(`/api/v1/projects/${id}`, payload);
  return res.data.data.project;
}

export async function createProjectActivity(projectId: string, payload: CreateProjectActivityPayload): Promise<ProjectActivity> {
  const res = await api.post<{ status: string; data: { activity: ProjectActivity } }>(`/api/v1/projects/${projectId}/activities`, payload);
  return res.data.data.activity;
}

export async function deleteProjectActivity(projectId: string, activityId: string): Promise<void> {
  await api.delete(`/api/v1/projects/${projectId}/activities/${activityId}`);
}
