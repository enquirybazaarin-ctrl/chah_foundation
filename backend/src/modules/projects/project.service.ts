import { projectRepository } from './project.repository';
import { CreateProjectInput, UpdateProjectInput, CreateActivityInput, UpdateActivityInput, ProjectQueryOptions } from './project.types';
import { AppError } from '../../utils/errors';
import slugify from 'slugify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../lib/prisma';

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

  async getImpactSectionData() {
    const setting = await prisma.setting.findUnique({
      where: { setting_key: 'impact_section_settings' }
    });

    let section = {
      badge: "OUR IMPACT",
      heading: "Real work. Real communities. Real change.",
      subheading: "Explore some of the initiatives we have carried out with communities and the people we serve."
    };

    if (setting) {
      section = JSON.parse(setting.setting_value);
    }

    const projects = await prisma.project.findMany({
      where: { status: 'ACTIVE', is_published: true },
      orderBy: { sort_order: 'asc' },
      take: 4,
      include: {
        featured_image: true
      }
    });

    // Format the projects properly for the frontend
    const formattedProjects = projects.map(p => ({
      ...p,
      id: p.id.toString(),
      featured_image_url: p.featured_image?.url || p.featured_image_url
    }));

    const featured = formattedProjects.find(p => p.is_featured) || formattedProjects[0] || null;
    const supporting = featured 
      ? formattedProjects.filter(p => p.id !== featured.id).slice(0, 2)
      : formattedProjects.slice(1, 3);

    return {
      section,
      featured,
      supporting
    };
  }

  async updateImpactSectionSettings(data: any) {
    const setting = await prisma.setting.upsert({
      where: { setting_key: 'impact_section_settings' },
      update: { setting_value: JSON.stringify(data) },
      create: { setting_key: 'impact_section_settings', setting_value: JSON.stringify(data) }
    });
    return JSON.parse(setting.setting_value);
  }
}

export const projectService = new ProjectService();
