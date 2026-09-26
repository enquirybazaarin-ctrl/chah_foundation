import { projectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput, CreateActivityInput, UpdateActivityInput, ProjectQueryOptions } from './project.types';
import { AppError } from '../../utils/errors';
import slugify from 'slugify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class ProjectService {
  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, trim: true });
  }

  async createProject(data: CreateProjectInput) {
    const baseSlug = this.generateSlug(data.title);
    let candidateSlug = baseSlug;
    let attempt = 0;
    const maxAttempts = 10;
    const status = data.status || 'DRAFT';

    while (attempt < maxAttempts) {
      try {
        const project = await projectRepository.create({
          ...data,
          slug: candidateSlug,
          status,
        });
        return project;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          // Unique constraint failed on slug
          attempt++;
          candidateSlug = `${baseSlug}-${attempt}`;
        } else {
          throw error;
        }
      }
    }

    throw new AppError('Could not generate a unique slug for the project', 500);
  }

  async getProjects(options: ProjectQueryOptions) {
    return projectRepository.findAll(options);
  }

  async getProjectById(id: bigint) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    return project;
  }

  async getProjectBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) throw new AppError('Project not found', 404);
    return project;
  }

  async updateProject(id: bigint, data: UpdateProjectInput) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new AppError('Project not found', 404);

    return projectRepository.update(id, data);
  }

  async archiveProject(id: bigint) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new AppError('Project not found', 404);

    return projectRepository.updateStatus(id, 'ARCHIVED');
  }

  async createActivity(projectId: bigint, data: CreateActivityInput) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    return projectRepository.createActivity(projectId, data);
  }

  async updateActivity(projectId: bigint, activityId: bigint, data: UpdateActivityInput) {
    const activity = await projectRepository.findActivityById(activityId);
    if (!activity || activity.project_id !== projectId) {
      throw new AppError('Activity not found in this project', 404);
    }

    return projectRepository.updateActivity(activityId, data);
  }

  async deleteActivity(projectId: bigint, activityId: bigint) {
    const activity = await projectRepository.findActivityById(activityId);
    if (!activity || activity.project_id !== projectId) {
      throw new AppError('Activity not found in this project', 404);
    }

    await projectRepository.deleteActivity(activityId);
  }
}

export const projectService = new ProjectService();
