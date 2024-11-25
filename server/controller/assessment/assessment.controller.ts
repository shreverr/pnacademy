import { type UUID } from "crypto";
import {
  addGroupToAssessment,
  addTag,
  attemptQustion,
  attemptQustionDelete,
  computeResults,
  createAssessment,
  createOption,
  createQuestion,
  createTag,
  deleteAssessment,
  deleteOption,
  deleteQuestion,
  deleteTag,
  endAssessment,
  endSection,
  exportAssessments,
  generateAiQuestionsService,
  getQuestionExplanation,
  getUserAssessmentResponses,
  publishResult,
  removeGroupFromAssessment,
  removeSectionFromAssessment,
  removeTagFromQuestion,
  saveGeneratedAiQuestions,
  searchAssesments,
  searchAssignedAssesments,
  startAssessment,
  startSection,
  totalAssessmentCount,
  totalAssessmentMarks,
  totalDraftAssessmentCount,
  totalOngoingAssessmentCount,
  totalPastAssessmentCount,
  totalScheduledAssessmentCount,
  updateAssessment,
  updateOption,
  updateQuestion,
  updateTag,
  viewAllAssessmentsGroupsList,
  viewAllTags,
  viewAssessmentAnalytics,
  viewAssessmentAnalyticsChart,
  viewAssessmentBulk,
  viewAssessmentDetails,
  viewAssessmentGroupDetails,
  viewAssessmentResults,
  viewAssessmentResultsList,
  viewAssessmentSections,
  viewAssessmentTime,
  viewAssignedAssessments,
  viewGroupAssessmentAnalytics,
  viewGroupAssessmentResults,
  viewQuestionDetails,
  viewTag,
  viewUserAssessmentResultsList,
} from "../../service/assessment/assessment.service";
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import {
  AssessmentResultAnalyticsMetric,
  AssessmentResultListAttributes,
  UserAssessmentResultListAttributes,
  UserResultAttributes,
  type AssessmentAttribute,
  type TagAttribute,
} from "../../types/assessment.types";
import { deleteFileFromDisk } from "../../lib/file";
import { GroupAssessmentResultAttributes } from "../../schema/assessment/groupAssessmentResult.schema";

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
export const totalAssessmentMarksController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalMarks = await totalAssessmentMarks(req.query.id as UUID);

    return res.status(200).json({
      status: "success",
      totalMarks: totalMarks,
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

export const viewAssessmentBulkController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessments = await viewAssessmentBulk(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as AssessmentAttribute,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
      data: assessments,
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
};

export const addTagController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addTag(req.body.questionId, req.body.tagId);

    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const viewAssesmentGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessment = await viewAssessmentDetails(req.query.id as UUID);

    return res.status(201).json;
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
    await removeTagFromQuestion(req.body.tagId, req.body.questionId);

    return res.status(200).json({
      status: "success",
      message: "Tag removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addGroupToAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addGroupToAssessment(req.body.assessmentId, req.body.groupId);

    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const viewAllAssignedGroupsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupDetails = await viewAssessmentGroupDetails(req.query.id as UUID);

    return res.status(200).json({
      status: "success",
      data: groupDetails,
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
    await removeGroupFromAssessment(req.body.assessmentId, req.body.groupId);

    return res.status(200).json({
      status: "success",
      message: "Group removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const viewAssignedAssessmentsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignedAssessments = await viewAssignedAssessments(
      req.user.userId as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as Exclude<AssessmentAttribute, "created_by">,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      message: "success",
      data: assignedAssessments,
    });
  } catch (error) {
    next(error);
  }
};

export const generateAiQuestionsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Questions = await generateAiQuestionsService(
      req.body.topic as string,
      req.body.numberOfQuestions as number,
      req.body.difficulty as string
    );

    return res.status(201).json({
      message: "Questions generated successfully",
      data: Questions,
    });
  } catch (error) {
    next(error);
  }
};

export const saveGeneratedAiQuestionsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const savedAssessmentId = await saveGeneratedAiQuestions({
      name: req.body.name,
      description: req.body.description,
      is_active: req.body.is_active,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      duration: req.body.duration,
      created_by: req.user.userId,
      questions: req.body.questions,
    });

    return res.status(201).json({
      message: "Generated assessment saved successfully",
      data: {
        assessmentId: savedAssessmentId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSectionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await removeSectionFromAssessment(
      req.body.assessmentId,
      req.body.section
    );
    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Section removed successfully",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Section not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const startAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await startAssessment(req.body.assessmentId, req.user.userId);

    return res.status(200).json({
      status: "success",
      message: "Assessment Started",
      sections: sections,
    });
  } catch (error) {
    next(error);
  }
};

export const endAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await endAssessment(req.body.assessmentId, req.user.userId);

    return res.status(200).json({
      status: "success",
      message: "Assessment Ended",
    });
  } catch (error) {
    next(error);
  }
};

export const startSectionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await startSection(
      req.body.assessmentId,
      req.user.userId,
      req.body.section
    );

    return res.status(200).json({
      status: "success",
      message: "Section Started",
      questions: questions,
    });
  } catch (error) {
    next(error);
  }
};

export const attemptQuestionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await attemptQustion(
      req.body.assessmentId,
      req.user.userId,
      req.body.questionId,
      req.body.selectedOptionId
    );

    return res.status(201).json({
      status: "success",
      message: "Question attempted",
    });
  } catch (error) {
    next(error);
  }
};

export const attemptQuestionDeleteController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await attemptQustionDelete(
      req.body.assessmentId,
      req.user.userId,
      req.body.questionId,
      req.body.selectedOptionId
    );

    return res.status(200).json({
      status: "success",
      message: "Question deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const endSectionController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await endSection(req.body.assessmentId, req.user.userId, req.body.section);

    return res.status(200).json({
      status: "success",
      message: "Section ended",
    });
  } catch (error) {
    next(error);
  }
};

export const computeResultsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await computeResults(req.body.assessmentId);

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const publishResultController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await publishResult(req.body.assessmentId, req.body.publish);

    return res.status(200).json({
      status: "success"
    });
  } catch (error) {
    next(error);
  }
};

export const getResultController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentResults = await viewAssessmentResults(
      req.params.assessmentId,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as UserResultAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: assessmentResults
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupAssessmentResultsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupAssessmentResults = await viewGroupAssessmentResults(
      req.params.assessmentId,
      req.params.groupId,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as UserResultAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: groupAssessmentResults
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAssessmentResultController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentResults = await viewAssessmentResultsList(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as AssessmentResultListAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: assessmentResults
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAssessmentsGroupsListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentResults = await viewAllAssessmentsGroupsList(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as keyof GroupAssessmentResultAttributes | "name",
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: assessmentResults
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAssessmentsResultListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentResults = await viewUserAssessmentResultsList(
      req.user.userId as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as UserAssessmentResultListAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: assessmentResults
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentAnalytics: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentAnalytics = await viewAssessmentAnalytics(
      req.params.assessmentId,
    );

    return res.status(200).json({
      status: "success",
      data: assessmentAnalytics
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupAssessmentAnalyticsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupAssessmentAnalytics = await viewGroupAssessmentAnalytics(
      req.params.assessmentId,
      req.params.groupId
    );

    return res.status(200).json({
      status: "success",
      data: groupAssessmentAnalytics
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentAnalyticsChart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentAnalyticsChartData = await viewAssessmentAnalyticsChart(
      req.query.metric as AssessmentResultAnalyticsMetric,
      req.query.start_date as string,
      req.query.end_date as string
    );

    return res.status(200).json({
      status: "success",
      data: assessmentAnalyticsChartData
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentTimeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const assessmentTime = await viewAssessmentTime(req.query.id as UUID, req.user.userId as UUID);

    return res.status(200).json({
      status: "success",
      data: assessmentTime
    });
  } catch (error) {
    next(error);
  }
}

export const getAssessmentSectionsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assessmentSections = await viewAssessmentSections(req.query.Id as UUID, req.user.userId as UUID);

    return res.status(200).json({
      status: "success",
      sections: assessmentSections
    });
  } catch (error) {
    next(error);
  }
}

export const exportAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exportedFilePath = await exportAssessments(
      req.body.assessmentIds
    );

    return res.status(200).sendFile(exportedFilePath, (err) => {
      if (err) {
        next(err);
      } else {
        deleteFileFromDisk(exportedFilePath);
      }
    });
  } catch (error) {
    next(error);
  }
};
export const getAssessmentTotalController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalAssessments = await totalAssessmentCount();

    return res.status(200).json({
      status: "success",
      totalAssessments : totalAssessments ,
    });
  } catch (error) {
    next(error);
  }
}

export const getOngoingAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ongoingAssessment = await totalOngoingAssessmentCount();

    return res.status(200).json({
      status: "success",
      totalAssessments: ongoingAssessment,
    });
  } catch (error) {
    next(error);
  }
}
export const getScheduledAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduledAssessment = await totalScheduledAssessmentCount();

    return res.status(200).json({
      status: "success",
      totalAssessments: scheduledAssessment,
    });
  } catch (error) {
    next(error);
  }
}
export const getPastAssessmentController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pastAssessment = await totalPastAssessmentCount();

    return res.status(200).json({
      status: "success",
      totalAssessments: pastAssessment,
    });
  } catch (error) {
    next(error);
  }
}
export const getDraftAssessmentCountController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const draftAssessment = await totalDraftAssessmentCount();

    return res.status(200).json({
      status: "success",
      totalAssessments: draftAssessment,
    });
  } catch (error) {
    next(error);
  }
}

export const searchAssesmentsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchResults = await searchAssesments(
      req.query.query as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.order as 'ASC' | 'DESC'
    )
    return res.status(200).json({
      message: 'success',
      data: searchResults
    })
  } catch (error) {
    next(error)
  }
}

export const searchAssignedAssesmentsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchResults = await searchAssignedAssesments(
      req.user.userId as string,
      req.query.query as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.order as 'ASC' | 'DESC'
    )
    return res.status(200).json({
      message: 'success',
      data: searchResults
    })
  } catch (error) {
    next(error)
  }
}

export const getUserAssessmentResponsesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAssessmentResponses = await getUserAssessmentResponses(
      req.params.assessmentId,
      req.params.userId,
      false,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: userAssessmentResponses
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAssessmentResponsesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myAssessmentResponses = await getUserAssessmentResponses(
      req.params.assessmentId,
      req.user.userId,
      true,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: myAssessmentResponses
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionExplanationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionExplanation = await getQuestionExplanation(
      req.params.questionId,
    );

    return res.status(200).json({
      status: "success",
      data: questionExplanation
    });
  } catch (error) {
    next(error);
  }
};
