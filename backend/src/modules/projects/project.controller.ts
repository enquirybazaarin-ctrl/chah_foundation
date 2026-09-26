import { Request, Response, NextFunction } from 'express';
import { projectService } from './project.service';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const status = req.query.status as string | undefined;

    const result = await projectService.getProjects({ page, limit, status });
    res.status(200).json({
      status: 'success',
      data: {
        projects: result.projects,
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

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const project = await projectService.getProjectById(id);
    res.status(200).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectBySlug(req.params.slug as string);
    res.status(200).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const project = await projectService.updateProject(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const archiveProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(req.params.id as string);
    const project = await projectService.archiveProject(id);
    res.status(200).json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = BigInt(req.params.id as string);
    const activity = await projectService.createActivity(projectId, req.body);
    res.status(201).json({
      status: 'success',
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = BigInt(req.params.id as string);
    const activityId = BigInt(req.params.activityId as string);
    const activity = await projectService.updateActivity(projectId, activityId, req.body);
    res.status(200).json({
      status: 'success',
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = BigInt(req.params.id as string);
    const activityId = BigInt(req.params.activityId as string);
    await projectService.deleteActivity(projectId, activityId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
