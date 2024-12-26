import { NextFunction, Response, Request } from "express";
import { RequestHandler } from "express";
import { createAssessment } from "../../service/assessment/assessment.service";

export const createAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await createAssessment({
      name: req.body.name,
      imagePath: req.file!.path,
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