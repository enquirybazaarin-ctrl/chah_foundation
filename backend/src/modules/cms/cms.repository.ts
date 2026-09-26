import { prisma } from '../../config/database';
import { BlogQueryOptions } from './cms.types';
import { BlogStatus } from '@prisma/client';

export class CmsRepository {
  // Category Queries
  async createCategory(data: { name: string, slug: string }) {
    return prisma.blogCategory.create({ data });
  }

  async findAllCategories() {
    return prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async findCategoryById(id: bigint) {
    return prisma.blogCategory.findUnique({ where: { id } });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.blogCategory.findUnique({ where: { slug } });
  }

  async updateCategory(id: bigint, data: { name: string }) {
    return prisma.blogCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: bigint) {
    return prisma.blogCategory.delete({ where: { id } });
  }

  // Tag Queries
  async createTag(data: { name: string, slug: string }) {
    return prisma.tag.create({ data });
  }

  async findAllTags() {
    return prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findTagById(id: bigint) {
    return prisma.tag.findUnique({ where: { id } });
  }

  async findTagBySlug(slug: string) {
    return prisma.tag.findUnique({ where: { slug } });
  }

  async updateTag(id: bigint, data: { name: string }) {
    return prisma.tag.update({ where: { id }, data });
  }

  async deleteTag(id: bigint) {
    return prisma.tag.delete({ where: { id } });
  }

  // Blog Queries
  async createBlog(data: any, tagIds: number[]) {
    return prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        published_at: data.status === 'PUBLISHED' ? new Date() : null,
        category: { connect: { id: BigInt(data.category_id) } },
        author: { connect: { id: BigInt(data.author_id) } },
        featured_image: data.featured_image_id ? { connect: { id: BigInt(data.featured_image_id) } } : undefined,
        blog_tags: {
          create: tagIds.map(tagId => ({
            tag: { connect: { id: BigInt(tagId) } }
          }))
        }
      },
      include: {
        category: true,
        author: { select: { id: true, first_name: true, last_name: true } },
        featured_image: true,
        blog_tags: {include: { tag: true } }
      }
    });
  }

  async findAllBlogs(options: BlogQueryOptions) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) where.status = options.status;
    if (options.category_id) where.category_id = BigInt(options.category_id);
    if (options.tag_id) {
      where.tags = {
        some: { tag_id: BigInt(options.tag_id) }
      };
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          author: { select: { id: true, first_name: true, last_name: true } },
          featured_image: true,
          blog_tags: {include: { tag: true } }
        }
      }),
      prisma.blog.count({ where })
    ]);

    return { blogs, total };
  }

  async findBlogById(id: bigint) {
    return prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, first_name: true, last_name: true } },
        featured_image: true,
        blog_tags: {include: { tag: true } }
      }
    });
  }

  async findBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { id: true, first_name: true, last_name: true } },
        featured_image: true,
        blog_tags: {include: { tag: true } }
      }
    });
  }

  async updateBlog(id: bigint, data: any, tagIds?: number[]) {
    // Basic fields update
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.status !== undefined) {
      updateData.status = data.status as any;
      if (data.status === 'PUBLISHED') updateData.published_at = new Date();
    }
    if (data.category_id !== undefined) updateData.category_id = BigInt(data.category_id);
    if (data.featured_image_id !== undefined) {
      updateData.featured_image_id = data.featured_image_id ? BigInt(data.featured_image_id) : null;
    }

    // Handle tags update if provided
    if (tagIds !== undefined) {
      // First delete all existing relations
      await prisma.blogTag.deleteMany({
        where: { blog_id: id }
      });
      // Then recreate the new ones
      updateData.tags = {
        create: tagIds.map(tagId => ({
          tag: { connect: { id: BigInt(tagId) } }
        }))
      };
    }

    return prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: { select: { id: true, first_name: true, last_name: true } },
        featured_image: true,
        blog_tags: {include: { tag: true } }
      }
    });
  }

  async updateBlogStatus(id: bigint, status: BlogStatus) {
    return prisma.blog.update({
      where: { id },
      data: { status }
    });
  }
}

export const cmsRepository = new CmsRepository();
