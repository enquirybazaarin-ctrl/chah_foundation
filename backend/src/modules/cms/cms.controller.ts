import { Request, Response, NextFunction } from 'express';
import { cmsService } from './cms.service';

// Categories
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await cmsService.createCategory(req.body);
    res.status(201).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await cmsService.getCategories();
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const category = await cmsService.updateCategory(id, req.body);
    res.status(200).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await cmsService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Tags
export const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await cmsService.createTag(req.body);
    res.status(201).json({ status: 'success', data: { tag } });
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await cmsService.getTags();
    res.status(200).json({ status: 'success', data: { tags } });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const tag = await cmsService.updateTag(id, req.body);
    res.status(200).json({ status: 'success', data: { tag } });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    await cmsService.deleteTag(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Blogs
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = BigInt((req as any).user.id);
    const blog = await cmsService.createBlog(authorId, req.body);
    res.status(201).json({ status: 'success', data: { blog } });
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
    // Admins see all, public sees published
    const isAdmin = (req as any).user && ['ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN'].includes((req as any).user.role?.name);
    const status = isAdmin ? (req.query.status as string) : 'PUBLISHED';

    const category_id = req.query.category_id ? parseInt(req.query.category_id as string, 10) : undefined;
    const tag_id = req.query.tag_id ? parseInt(req.query.tag_id as string, 10) : undefined;

    const result = await cmsService.getBlogs({ page, limit, status, category_id, tag_id });
    res.status(200).json({
      status: 'success',
      data: {
        blogs: result.blogs,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const blog = await cmsService.getBlogById(id);
    res.status(200).json({ status: 'success', data: { blog } });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await cmsService.getBlogBySlug(req.params.slug as string);
    res.status(200).json({ status: 'success', data: { blog } });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const blog = await cmsService.updateBlog(id, req.body);
    res.status(200).json({ status: 'success', data: { blog } });
  } catch (error) {
    next(error);
  }
};

export const archiveBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const blog = await cmsService.archiveBlog(id);
    res.status(200).json({ status: 'success', data: { blog } });
  } catch (error) {
    next(error);
  }
};
