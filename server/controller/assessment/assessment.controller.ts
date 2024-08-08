import { UUID } from "crypto";
import {
  addGroupToAssessment,
  addTag,
  createAssessment,
  createOption,
  createQuestion,
  createTag,
  deleteAssessment,
  deleteOption,
  deleteQuestion,
  deleteTag,
  removeGroupFromAssessment,
  removeTagFromQuestion,
  updateAssessment,
  updateOption,
  updateQuestion,
  updateTag,
  viewAllTags,
  viewAssessmentDetails,
  viewQuestionDetails,
  viewTag,
} from "../../service/assessment/assessment.service";
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { TagAttribute } from "../../types/assessment.types";

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

export const CreateQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await createQuestion({
      assessment_id: req.body.assessment_id,
      description: req.body.description,
      marks: req.body.marks,
      section: req.body.section,
    });

    return res.status(201).json({
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const CreateOptionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const option = await createOption({
      question_id: req.body.question_id,
      description: req.body.description,
      is_correct: req.body.is_correct,
    });

    return res.status(201).json({
      message: "Option created successfully",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

export const CreateTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Tag = await createTag({
      name: req.body.name,
    });
    return res.status(201).json({
      message: "Tag created successfully",
      data: Tag,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await updateAssessment({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      is_active: req.body.is_active,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      duration: req.body.duration,
    });

    return res.status(201).json({
      message: "Assessment updated successfully",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await updateQuestion({
      id: req.body.id,
      description: req.body.description,
      marks: req.body.marks,
      section: req.body.section,
    });

    return res.status(201).json({
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateOptionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const option = await updateOption({
      id: req.body.id,
      description: req.body.description,
      is_correct: req.body.is_correct,
    });

    return res.status(201).json({
      message: "Option updated successfully",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Tag = await updateTag({
      id: req.body.id,
      name: req.body.name,
    });
    return res.status(201).json({
      message: "Tag updated successfully",
      data: Tag,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await deleteAssessment({
      id: req.body.id,
    });

    return res.status(201).json({
      message: "Assessment deleted successfully",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await deleteQuestion({
      id: req.body.id,
    });

    return res.status(201).json({
      message: "Question deleted successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteOptionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const option = await deleteOption({
      id: req.body.id,
    });

    return res.status(201).json({
      message: "Option deleted successfully",
      data: option,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Tag = await deleteTag({
      id: req.body.id,
    });

    return res.status(201).json({
      message: "Tag deleted successfully",
      data: Tag,
    });
  } catch (error) {
    next(error);
  }
};

export const viewAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await viewAssessmentDetails(req.query.id as UUID);

    return res.status(201).json({
      message: "Assessment fetched successfully",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

export const viewQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await viewQuestionDetails(req.query.id as UUID);
    return res.status(201).json({
      message: "Question fetched successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const viewTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagData = await viewTag(req.query.id as UUID);

    return res.status(200).json({
      status: "success",
      data: tagData,
    });
  } catch (error) {
    next(error);
  }
};

export const viewAllTagsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagsData = await viewAllTags(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as TagAttribute,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
      data: tagsData,
    });
  } catch (error) {
    next(error);
  }
}

export const addTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addTag(
      req.body.questionId,
      req.body.tagId,
    );

    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const removeTagFromQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeTagFromQuestion(
      req.body.tagId,
      req.body.questionId
    );

    return res.status(200).json({
      status: "success",
      message: "Tag removed successfully"
    });
  } catch (error) {
    next(error);
  }
}

export const addGroupToAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addGroupToAssessment(
      req.body.assessmentId,
      req.body.groupId,
    );

    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const removeGroupFromAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeGroupFromAssessment(
      req.body.assessmentId,
      req.body.groupId,
    );

    return res.status(200).json({
      status: "success",
      message: "Group removed successfully"
    });
  } catch (error) {
    next(error);
  }
}