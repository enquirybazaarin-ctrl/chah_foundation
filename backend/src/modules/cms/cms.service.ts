import { cmsRepository } from './cms.repository';
import { CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateTagInput, UpdateTagInput, CreateBlogInput, UpdateBlogInput, BlogQueryOptions } from './cms.types';
import { AppError } from '../../utils/errors';
import slugify from 'slugify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class CmsService {
  private generateSlug(text: string): string {
    return slugify(text, { lower: true, strict: true, trim: true });
  }

  // Categories
  async createCategory(data: CreateBlogCategoryInput) {
    const baseSlug = this.generateSlug(data.name);
    let candidateSlug = baseSlug;
    let attempt = 0;

    while (attempt < 10) {
      try {
        return await cmsRepository.createCategory({ ...data, slug: candidateSlug });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          attempt++;
          candidateSlug = `${baseSlug}-${attempt}`;
        } else {
          throw error;
        }
      }
    }
    throw new AppError('Could not generate a unique slug for category', 500);
  }

  async getCategories() {
    return cmsRepository.findAllCategories();
  }

  async getCategoryById(id: bigint) {
    const category = await cmsRepository.findCategoryById(id);
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }

  async updateCategory(id: bigint, data: UpdateBlogCategoryInput) {
    await this.getCategoryById(id);
    return cmsRepository.updateCategory(id, data as { name: string });
  }

  async deleteCategory(id: bigint) {
    await this.getCategoryById(id);
    try {
      await cmsRepository.deleteCategory(id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new AppError('Cannot delete category because it is linked to existing blogs', 400);
      }
      throw error;
    }
  }

  // Tags
  async createTag(data: CreateTagInput) {
    const baseSlug = this.generateSlug(data.name);
    let candidateSlug = baseSlug;
    let attempt = 0;

    while (attempt < 10) {
      try {
        return await cmsRepository.createTag({ ...data, slug: candidateSlug });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          attempt++;
          candidateSlug = `${baseSlug}-${attempt}`;
        } else {
          throw error;
        }
      }
    }
    throw new AppError('Could not generate a unique slug for tag', 500);
  }

  async getTags() {
    return cmsRepository.findAllTags();
  }

  async getTagById(id: bigint) {
    const tag = await cmsRepository.findTagById(id);
    if (!tag) throw new AppError('Tag not found', 404);
    return tag;
  }

  async updateTag(id: bigint, data: UpdateTagInput) {
    await this.getTagById(id);
    return cmsRepository.updateTag(id, data as { name: string });
  }

  async deleteTag(id: bigint) {
    await this.getTagById(id);
    try {
      await cmsRepository.deleteTag(id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new AppError('Cannot delete tag because it is linked to existing blogs', 400);
      }
      throw error;
    }
  }

  // Blogs
  async createBlog(authorId: bigint, data: CreateBlogInput) {
    const baseSlug = this.generateSlug(data.title);
    let candidateSlug = baseSlug;
    let attempt = 0;
    const status = data.status || 'DRAFT';
    const tagIds = data.tag_ids || [];

    while (attempt < 10) {
      try {
        return await cmsRepository.createBlog({
          ...data,
          slug: candidateSlug,
          status,
          author_id: authorId
        }, tagIds);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          attempt++;
          candidateSlug = `${baseSlug}-${attempt}`;
        } else {
          throw error;
        }
      }
    }
    throw new AppError('Could not generate a unique slug for the blog', 500);
  }

  async getBlogs(options: BlogQueryOptions) {
    return cmsRepository.findAllBlogs(options);
  }

  async getBlogById(id: bigint) {
    const blog = await cmsRepository.findBlogById(id);
    if (!blog) throw new AppError('Blog not found', 404);
    return blog;
  }

  async getBlogBySlug(slug: string) {
    const blog = await cmsRepository.findBlogBySlug(slug);
    if (!blog) throw new AppError('Blog not found', 404);
    return blog;
  }

  async updateBlog(id: bigint, data: UpdateBlogInput) {
    await this.getBlogById(id);
    const tagIds = data.tag_ids;
    delete data.tag_ids; // Prevent passing array directly to simple update
    return cmsRepository.updateBlog(id, data, tagIds);
  }

  async archiveBlog(id: bigint) {
    await this.getBlogById(id);
    return cmsRepository.updateBlogStatus(id, 'ARCHIVED');
  }
}

export const cmsService = new CmsService();
