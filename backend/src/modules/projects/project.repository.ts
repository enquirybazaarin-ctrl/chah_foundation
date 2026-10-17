import { prisma } from '../../config/database';
import { CreateProjectInput, UpdateProjectInput, CreateActivityInput, UpdateActivityInput, ProjectQueryOptions } from './project.types';

export class ProjectRepository {
  async create(data: CreateProjectInput & { slug: string, status: string }) {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        short_description: data.short_description,
        category: data.category,
        location: data.location,
        beneficiary_info: data.beneficiary_info,
        impact_summary: data.impact_summary,
        status: data.status,
        is_published: data.is_published ?? true,
        is_featured: data.is_featured ?? false,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined,
        featured_image_id: data.featured_image_id ? BigInt(data.featured_image_id) : undefined,
      },
      include: {
        featured_image: true,
      }
    });

    if (data.gallery_media_ids && data.gallery_media_ids.length > 0) {
      await prisma.projectGalleryImage.createMany({
        data: data.gallery_media_ids.map((media_id, idx) => ({
          project_id: project.id,
          media_id: BigInt(media_id),
          sort_order: idx,
        }))
      });
    }

    return this.findById(project.id);
  }

  async findAll(options: ProjectQueryOptions) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) {
      where.status = options.status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          featured_image: true,
        }
      }),
      prisma.project.count({ where })
    ]);

    return { projects, total };
  }

  async findById(id: bigint) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        featured_image: true,
        gallery_images: {
          include: { media: true },
          orderBy: { sort_order: 'asc' }
        },
        activities: {
          orderBy: { date: 'desc' }
        }
      }
    });
  }

  async findBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        featured_image: true,
        gallery_images: {
          include: { media: true },
          orderBy: { sort_order: 'asc' }
        },
        activities: {
          orderBy: { date: 'desc' }
        }
      }
    });
  }

  async update(id: bigint, data: UpdateProjectInput) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.short_description !== undefined) updateData.short_description = data.short_description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.beneficiary_info !== undefined) updateData.beneficiary_info = data.beneficiary_info;
    if (data.impact_summary !== undefined) updateData.impact_summary = data.impact_summary;
    if (data.is_published !== undefined) updateData.is_published = data.is_published;
    if (data.is_featured !== undefined) updateData.is_featured = data.is_featured;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
    if (data.featured_image_id !== undefined) updateData.featured_image_id = data.featured_image_id ? BigInt(data.featured_image_id) : null;

    await prisma.project.update({
      where: { id },
      data: updateData,
    });

    if (data.gallery_media_ids !== undefined) {
      await prisma.projectGalleryImage.deleteMany({
        where: { project_id: id }
      });
      if (Array.isArray(data.gallery_media_ids) && data.gallery_media_ids.length > 0) {
        await prisma.projectGalleryImage.createMany({
          data: data.gallery_media_ids.map((media_id, idx) => ({
            project_id: id,
            media_id: BigInt(media_id),
            sort_order: idx,
          }))
        });
      }
    }

    return this.findById(id);
  }

  async updateStatus(id: bigint, status: string) {
    return prisma.project.update({
      where: { id },
      data: { status }
    });
  }

  async createActivity(projectId: bigint, data: CreateActivityInput) {
    return prisma.activity.create({
      data: {
        project_id: projectId,
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
      }
    });
  }

  async findActivityById(id: bigint) {
    return prisma.activity.findUnique({
      where: { id }
    });
  }

  async updateActivity(id: bigint, data: UpdateActivityInput) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;

    return prisma.activity.update({
      where: { id },
      data: updateData
    });
  }

  async deleteActivity(id: bigint) {
    return prisma.activity.delete({
      where: { id }
    });
  }

  async delete(id: bigint) {
    return prisma.project.delete({
      where: { id }
    });
  }
}

export const projectRepository = new ProjectRepository();
