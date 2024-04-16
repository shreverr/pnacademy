import { createAssessment } from "../../service/assessment/assessment.service";
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";

export const CreateAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await createAssessment({
      name: req.body.name,
      description: req.body.description,
      is_active: req.body.is_active,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      duration: req.body.duration,
      created_by: req.body.created_by,
    });

    return res.status(201).json({
      message: "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};
