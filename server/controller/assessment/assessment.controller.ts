import { NextFunction, Response, Request } from "express";
import { RequestHandler } from "express";
import { createAssessment, getAssessments } from "../../service/assessment/assessment.service";
import { permission } from "process";
import { AssessmentAttributes } from "../../schema/assessment/assessment.schema";
import logger from "../../config/logger";

export const createAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await createAssessment({
      name: req.body.name,
      imagePath: req.file?.path,
      description: req.body.description,
      isActive: req.body.isActive,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      duration: req.body.duration,
      isPublished: req.body.isPublished,
    });
    return res.status(201).json({
      status: "success",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
}

export const getAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Prepare query arguments with clear type casting and defaults
    const queryArgs = {
      includes: (Array.isArray(req.query.include) 
        ? req.query.include 
        : [req.query.include]) as  ('allowedDevices')[],
      search: req.query.search as string,
      sort: req.query.sort as string,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      filters: req.query.filters 
        ? JSON.parse(req.query.filters as string) as Omit<AssessmentAttributes, 'search_vector' | 'imageKey'> 
        : undefined,
      userId: req.user.userId
    };

    // Check if user has management permission
    const isRestrictedUser = !req.user.permissions.includes('canManageAssessment');

    const queryResults = await getAssessments(queryArgs, isRestrictedUser);

    // Return 404 if no results, otherwise return success with data
    return queryResults.data.length === 0 
      ? res.status(404).send()
      : res.status(200).json({
          status: "success",
          data: queryResults.data,
          totalPages: queryResults.totalPages
        });
  } catch (error) {
    next(error);
  }
};
