import { type UUID } from "crypto";
import {
  addGroupToAssessmentById,
  addTagToQuestion,
  attemptQuestionById,
  attemptQuestionDeleteById,
  getAssessmentDetailsById,
  checkQuestionExists,
  createAssementInDB,
  createOptionInDB,
  createQuestionInDB,
  createTagInDB,
  deleteAssessmentInDB,
  deleteOptionInDB,
  deleteQuestionInDB,
  deleteTagInDB,
  endAssessmentById,
  endSectionById,
  generateAiQuestions,
  getAllAssessments,
  getAllTags,
  getAssessmentById,
  getAssessmentStatusById,
  getOptionById,
  getQuestionAndOptionsById,
  getQuestionById,
  getQuestionsBySection,
  getSectionStatusesById,
  getTagById,
  removeGroupFromAssessmentById,
  removeSectionFromAssessmentById,
  removeTagFromQuestionById,
  startAssessmentById,
  startSectionById,
  updateAssessmentInDB,
  updateOptionInDB,
  updateQuestionInDB,
  updateTagInDB,
  viewAssignedAssessmentsByUserId,
  getAssessmentAssignedGroups,
  computeUserResultsByAssessment,
  computeAssessmentAnalytics,
  publishAssessmentResultsByAssessmentId,
  getResultsByAssessmentId,
  getAssessmentResultList,
  getAssessmentAnalyticsByAssessmentId,
  getAssessmentResultAnalyticsByMetric,
  getAssessmentTimeData,
  getAssessmentSections,
  createQuestionsInBulk,
  exportAssessmentById,
  getUserAssessmentResponsesById,
  getUserAssessmentResultList,
  getAssessmentStatusesByUserId,
  getAssessmentCountByType,
  searchAssesmentsByQuery,
  searchAssignedAssesmentsByQuery,
} from "../../model/assessment/assesment.model";
import {
  type OptionData,
  type QuestionData,
  type AssementData,
  type TagData,
  type AssementDetailedData,
  type QuestionDetailedData,
  TagAttribute,
  AssessmentAttribute,
  AiQuestions,
  AssessmentAssigendGroupData,
  AssessmentDataBySection,
  UserResult,
  UserResultAttributes,
  AssessmentResultListAttributes,
  AssessmentResultAnalyticsMetric,
  ChartData,
  AssessmentTime,
  SectionDetailedStatus,
  UserAssessmentResultListAttributes,
  QuestionType,
  ProgrammingLanguage,
} from "../../types/assessment.types";
import { v4 as uuid } from "uuid";
import { getUserById } from "../../model/user/user.model";
import { AppError } from "../../lib/appError";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import { TagAttributes } from "../../schema/assessment/tag.schema";
import Assessment, { AssessmentAttributes } from "../../schema/assessment/assessment.schema";
import Question, { QuestionAttributes } from "../../schema/assessment/question.schema";
import {
  validateAssessment,
  validateAssessmentEnd,
  validateAssessmentStatus,
  validateSectionStatus,
} from "../../lib/assessment/validator";
import {
  deleteEventRule,
  scheduleAssessmentEndEvent,
  updateAssessmentEndEventSchedule,
} from "../../lib/assessment/event";
import logger from "../../config/logger";
import Group from "../../schema/group/group.schema";
import { GroupData } from "../../types/group.types";
import AssessmentResult, { AssessmentResultAttributes } from "../../schema/assessment/assessmentResult.schema";
import { createArchive, deleteFileFromDisk, deleteFileFromS3, saveDataToDisk, uploadFileToS3 } from "../../lib/file";
import { nanoid } from "nanoid";
import consistentRandomizer from "../../utils/shuffel";
import UserAssessmentResult from "../../schema/assessment/userAssessmentResult.schema";
import path from "path";
import { generatePresignedUrl } from "../../utils/s3";

export const createAssessment = async (assement: {
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
}): Promise<AssementData | null> => {
  if (assement.created_by) {
    const existingUser = await getUserById(assement.created_by);
    if (!existingUser) {
      throw new AppError(
        "User not found",
        404,
        "User with this id does not exist so Can't create assessment",
        false
      );
    }
  }
  const assesmentId = uuid();
  const assementData = await createAssementInDB({
    id: assesmentId,
    name: assement.name,
    description: assement.description,
    is_active: assement.is_active,
    start_at: assement.start_at,
    end_at: assement.end_at,
    duration: assement.duration,
    created_by: assement.created_by,
  });

  if (assementData)
    try {
      await scheduleAssessmentEndEvent(assesmentId, assementData.end_at);
    } catch (error) {
      try {
        await deleteAssessmentInDB({ id: assesmentId as UUID });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        } else {
          throw new AppError(
            "Internal server error",
            500,
            "Error scheduling assessment end event and deleting assessment",
            false
          );
        }
      }

      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "Internal server error",
          500,
          "Error scheduling assessment end event",
          false
        );
      }
    }

  return assementData;
};

export const createQuestion = async (question: {
  assessment_id: UUID;
  description: string;
  marks: number;
  section: number;
  type: QuestionType
  time_limit: number
  allowed_languages: ProgrammingLanguage[]
  image?: Express.Multer.File;
}): Promise<QuestionData | null> => {
  let questionImageKey: string | null = null;

  try {
    if (question.image) {
      questionImageKey = `question-images/${uuid()}${path.extname(
        question.image.path
      )}`;

      await uploadFileToS3(
        question.image.path,
        questionImageKey,
        "image"
      );

      deleteFileFromDisk(question.image.path);
    }

    const questionDataInDB = await createQuestionInDB({
      id: uuid(),
      assessment_id: question.assessment_id,
      description: question.description,
      marks: question.marks,
      section: question.section,
      type: question.type,
      time_limit: question.time_limit,
      allowed_languages: question.allowed_languages,
      image_key: questionImageKey
    });

    let questionData: any = questionDataInDB;
    delete questionData.image_key;

    logger.debug(questionData);
    logger.debug(questionImageKey);

    if (questionImageKey) {
      questionData.image_url = await generatePresignedUrl(
        questionImageKey,
        60 * 60
      );
    }

    return questionData;
  } catch (error: any) {
    try {
      await deleteFileFromS3(questionImageKey as string);
    } catch (error) {
      throw error;
    }

    throw error;
  }
};

export const createOption = async (option: {
  question_id: UUID;
  description: string;
  is_correct: boolean;
}): Promise<OptionData | null> => {
  const existingQuestion = await checkQuestionExists(option.question_id);

  if (!existingQuestion) {
    throw new AppError(
      "Question not found",
      404,
      "Question with this id does not exist so Can't create option",
      false
    );
  } else if (existingQuestion.type === "CODE") {
    throw new AppError(
      "Invalid Question Type",
      400,
      "Can't create options for a code question",
      false
    );
  }

  const optionData = await createOptionInDB({
    id: uuid(),
    question_id: option.question_id,
    description: option.description,
    is_correct: option.is_correct,
  });
  return optionData;
};

export const createTag = async (tag: {
  name: string;
}): Promise<TagData | null> => {
  const TagData = await createTagInDB({
    id: uuid(),
    name: tag.name,
  });
  return TagData;
};

export const updateAssessment = async (assessment: {
  id: UUID;
  name: string | null;
  description: string | null;
  is_active: boolean | null;
  start_at: Date | null;
  end_at: Date | null;
  duration: number | null;
}): Promise<AssementData | null> => {
  const existingAssessment = await getAssessmentDetailsById(assessment.id);
  if (!existingAssessment) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist so Can't update assessment",
      false
    );
  }

  const updatedAssessment = await updateAssessmentInDB({
    id: assessment.id,
    name: assessment.name,
    description: assessment.description,
    is_active: assessment.is_active,
    start_at: assessment.start_at,
    end_at: assessment.end_at,
    duration: assessment.duration,
  });

  if (
    updatedAssessment &&
    assessment.end_at &&
    existingAssessment.end_at.toUTCString() !==
    updatedAssessment.end_at.toUTCString()
  ) {
    try {
      await updateAssessmentEndEventSchedule(
        updatedAssessment.id,
        updatedAssessment.end_at
      );
    } catch (eventError) {
      // Rollback the assessment update if event scheduling fails
      try {
        await updateAssessmentInDB({
          id: existingAssessment.id as UUID,
          name: existingAssessment.name,
          description: existingAssessment.description,
          is_active: existingAssessment.is_active,
          start_at: existingAssessment.start_at,
          end_at: existingAssessment.end_at,
          duration: existingAssessment.duration,
        });
      } catch (rollbackError) {
        // If rollback fails, log the rollback error and throw the original event error
        throw new AppError(
          "Internal server error",
          500,
          "Error rolling back assessment update after failing to update event schedule",
          false
        );
      }

      // Throw the original event scheduling error
      throw new AppError(
        "Internal server error",
        500,
        "Error updating assessment end event schedule",
        false
      );
    }
  }

  return updatedAssessment;
};

export const updateQuestion = async (question: {
  id: UUID;
  description: string | null;
  marks: number | null;
  section: number | null;
}): Promise<QuestionData | null> => {
  const existingQuestion = await checkQuestionExists(question.id);
  if (!existingQuestion) {
    throw new AppError(
      "Question not found",
      404,
      "Question with this id does not exist so Can't update question",
      false
    );
  }
  const updatedQuestion = await updateQuestionInDB({
    id: question.id,
    description: question.description,
    marks: question.marks,
    section: question.section,
  });
  return updatedQuestion;
};

export const updateOption = async (option: {
  id: UUID;
  description: string | null;
  is_correct: boolean | null;
}): Promise<OptionData | null> => {
  const existingOption = await checkQuestionExists(option.id);
  if (!existingOption) {
    throw new AppError(
      "Option not found",
      404,
      "Option with this id does not exist so Can't update option",
      false
    );
  }
  const updatedOption = await updateOptionInDB({
    id: option.id,
    description: option.description,
    is_correct: option.is_correct,
  });
  return updatedOption;
};

export const updateTag = async (option: {
  id: UUID;
  name: string | null;
}): Promise<TagData | null> => {
  const existingTag = await getTagById(option.id);
  if (existingTag == null) {
    throw new AppError(
      "Tag not found",
      404,
      "Tag with this id does not exist so Can't update tag",
      false
    );
  }
  const updatedTag = await updateTagInDB({
    id: option.id,
    name: option.name,
  });
  return updatedTag;
};

export const totalAssessmentMarks = async (
  assessmentId: UUID
): Promise<number> => {
  const assessmentData = await getAssessmentById(assessmentId);
  if (!assessmentData) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    );
  }
  let totalMarks = 0;
  assessmentData.questions.forEach((question) => {
    totalMarks += question.marks;
  });
  return totalMarks;
};

export const deleteAssessment = async (Assessment: {
  id: UUID;
}): Promise<boolean> => {
  const existingAssessment = await getAssessmentDetailsById(Assessment.id);
  if (!existingAssessment) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist so Can't delete assessment",
      false
    );
  }
  const deletedAssessment = await deleteAssessmentInDB({
    id: Assessment.id,
  });

  if (deletedAssessment) {
    try {
      await deleteEventRule(Assessment.id);
    } catch (error: any) {
      createAssementInDB({
        ...existingAssessment,
        created_by: existingAssessment.created_by as UUID,
      });

      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError("Internal server error", 500, error, false);
      }
    }
  }

  return deletedAssessment;
};

export const deleteQuestion = async (question: {
  id: UUID;
}): Promise<boolean> => {
  const existingQuestion = await checkQuestionExists(question.id);
  if (!existingQuestion) {
    throw new AppError(
      "Question not found",
      404,
      "Question with this id does not exist so Can't delete question",
      false
    );
  }
  const deletedQuestion = await deleteQuestionInDB({
    id: question.id,
  });
  return deletedQuestion;
};

export const deleteOption = async (option: { id: UUID }): Promise<boolean> => {
  const existingOption = await getOptionById(option.id);
  if (existingOption == null) {
    throw new AppError(
      "Option not found",
      404,
      "Option with this id does not exist so Can't delete option",
      false
    );
  }
  const deletedOption = await deleteOptionInDB({
    id: option.id,
  });
  return deletedOption;
};

export const deleteTag = async (tag: { id: UUID }): Promise<boolean> => {
  const existingTag = await getTagById(tag.id);
  if (existingTag == null) {
    throw new AppError(
      "Tag not found",
      404,
      "Tag with this id does not exist so Can't delete tag",
      false
    );
  }
  const deletedTag = await deleteTagInDB({
    id: tag.id,
  });
  return deletedTag;
};

export const viewAssessmentDetails = async (
  userId: UUID
): Promise<AssessmentDataBySection | null> => {
  const assessmentData = await getAssessmentById(userId);
  if (!assessmentData) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    );
  }

  const sections: QuestionDetailedData[][] = [];

  assessmentData.questions.forEach((question) => {
    const sectionIndex = question.section - 1; // section number (1-based) to array index (0-based)
    if (!sections[sectionIndex]) {
      sections[sectionIndex] = [];
    }
    sections[sectionIndex].push(question);
  });

  return {
    id: assessmentData.id,
    name: assessmentData.name,
    description: assessmentData.description,
    is_active: assessmentData.is_active,
    start_at: assessmentData.start_at,
    end_at: assessmentData.end_at,
    duration: assessmentData.duration,
    created_by: assessmentData.created_by,
    sections: sections,
  };
};
export const viewAssessmentBulk = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: AssessmentAttribute,
  order?: "ASC" | "DESC"
): Promise<{
  assesments: AssessmentAttributes[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;
  const { rows: allAssesmentsData, count: allAssesmentsCount } =
    await getAllAssessments(offset, pageSize, sortBy, order);

  if (!allAssesmentsData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }
  const totalPages = Math.ceil(allAssesmentsCount / pageSize);
  return {
    assesments: allAssesmentsData,
    totalPages: totalPages,
  };
};

export const viewQuestionDetails = async (
  userId: UUID
): Promise<QuestionDetailedData | null> => {
  const questionData = await getQuestionAndOptionsById(userId);
  if (questionData === null) {
    throw new AppError(
      "Question not found",
      404,
      "Question with this id does not exist",
      false
    );
  }
  return questionData;
};

export const viewTag = async (tagId: UUID): Promise<TagAttributes | null> => {
  const tagData = await getTagById(tagId);
  if (!tagData) {
    throw new AppError(
      "Tag not found",
      404,
      "Tag with this id does not exist",
      false
    );
  }

  return tagData;
};

export const viewAllTags = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: TagAttribute,
  order?: "ASC" | "DESC"
): Promise<{
  tags: TagData[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: allTagsData, count: allTagsCount } = await getAllTags(
    offset,
    pageSize,
    sortBy,
    order
  );

  if (!allTagsData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const totalPages = Math.ceil(allTagsCount / pageSize);

  return {
    tags: allTagsData,
    totalPages: totalPages,
  };
};

export const addTag = async (
  tagId: UUID,
  questionId: UUID
): Promise<boolean> => {
  const isTagAdded = await addTagToQuestion(questionId, tagId);

  return isTagAdded;
};

export const removeTagFromQuestion = async (
  tagId: string,
  questionId: string
): Promise<boolean> => {
  const result = await removeTagFromQuestionById(tagId, questionId);

  return result;
};

export const addGroupToAssessment = async (
  assessmentId: string,
  groupId: string
): Promise<boolean> => {
  const isGroupAddedToAssessment = await addGroupToAssessmentById(
    assessmentId,
    groupId
  );

  return isGroupAddedToAssessment;
};

export const removeGroupFromAssessment = async (
  assessmentId: string,
  groupId: string
): Promise<boolean> => {
  const result = await removeGroupFromAssessmentById(assessmentId, groupId);

  return result;
};

export const viewAssessmentGroupDetails = async (
  assessmentId: UUID
): Promise<AssessmentAssigendGroupData[]> => {
  const assessmentGroupData = await getAssessmentAssignedGroups(assessmentId);

  if (!assessmentGroupData) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    );
  }

  return assessmentGroupData;
};

export const viewAssignedAssessments = async (
  userId: string,
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: Exclude<AssessmentAttribute, "created_by">,
  order?: "ASC" | "DESC"
): Promise<{
  assessments: Omit<AssessmentAttributes, "created_by">[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: assignedAssessments, count: assignedAssessmentsCount } =
    await viewAssignedAssessmentsByUserId(
      userId,
      offset,
      pageSize,
      sortBy,
      order
    );

  if (!assignedAssessments) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const assessmentStatuses = await getAssessmentStatusesByUserId(userId);

  logger.debug(assignedAssessments);
  logger.debug(assessmentStatuses);

  let assignedAssessmentsWithStatus: any[] = []

  assignedAssessments.forEach((assessment) => {
    const status = assessmentStatuses.find(
      (status) => status.assessment_id === assessment.id
    );

    if (status && status.submitted_at) {
      assignedAssessmentsWithStatus.push({
        ...assessment,
        isSubmitted: true,
      })
    } else if (status && assessment.end_at < new Date()) {
      assignedAssessmentsWithStatus.push({
        ...assessment,
        isSubmitted: true,
      })
    } else {
      assignedAssessmentsWithStatus.push({
        ...assessment,
        isSubmitted: false,
      })
    }
  });

  const totalPages = Math.ceil(assignedAssessmentsCount / pageSize);

  return {
    assessments: assignedAssessmentsWithStatus,
    totalPages: totalPages,
  };
};

export const generateAiQuestionsService = async (
  topic: string,
  numberOfQuestions: number,
  difficulty: string
): Promise<AiQuestions | null> => {
  const questions = await generateAiQuestions(
    topic,
    numberOfQuestions,
    difficulty
  );
  if (questions === null) {
    throw new AppError(
      "Questions Generation Failed",
      404,
      "Questions with this topic and difficulty failed to generate",
      false
    );
  }
  return questions;
};

export const saveGeneratedAiQuestions = async (assessment: {
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
  questions: [
    {
      description: string,
      marks: number,
      section: number
      options: [
        {
          description: string,
          isCorrect: boolean
        },
      ]
    },
  ]
}): Promise<string | undefined> => {
  const createdAssessment = await createAssessment({
    name: assessment.name,
    description: assessment.description,
    is_active: assessment.is_active,
    start_at: assessment.start_at,
    end_at: assessment.end_at,
    duration: assessment.duration,
    created_by: assessment.created_by,
  })

  if (!createdAssessment) {
    throw new AppError(
      "Assessment Creation Failed",
      500,
      "Assessment with this name failed to create",
      false
    );
  }

  createQuestionsInBulk(createdAssessment?.id as UUID, assessment.questions)
  return createdAssessment?.id;
};

export const removeSectionFromAssessment = async (
  assessmentId: string,
  section: number
): Promise<boolean> => {
  const result = await removeSectionFromAssessmentById(assessmentId, section);

  return result;
};

export const startAssessment = async (
  assessmentId: string,
  userId: string
): Promise<SectionDetailedStatus[]> => {
  await validateAssessment(assessmentId);

  const isAssessmentStarted = await startAssessmentById(assessmentId, userId);
  const sections = await getAssessmentSections(assessmentId as UUID);
  const sectionStatuses = (await getSectionStatusesById(assessmentId, userId)).rows;


  let sectionDetails: SectionDetailedStatus[] = []

  sections.forEach((section, index) => {
    const sectionStatus = sectionStatuses.find((sectionStatus) => sectionStatus.section === section)

    if (sectionStatus) {
      if (sectionStatus.is_submited) {
        sectionDetails.push({
          section: section,
          status: "submitted"
        })
      } else {
        sectionDetails.push({
          section: section,
          status: "started"
        })
      }
    } else {
      sectionDetails.push({
        section: section,
        status: "not-started"
      })
    }
  });
  logger.debug(sectionDetails)

  return sectionDetails;
};

export const endAssessment = async (
  assessmentId: string,
  userId: string
): Promise<boolean> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);

  const result = await endAssessmentById(assessmentId, userId);

  return result;
};

export const startSection = async (
  assessmentId: string,
  userId: string,
  section: number
): Promise<{
  selectedOptionId: string | null;
  id: string;
  assessment_id: string;
  description: string;
  marks: number;
  section: number;
}[] | null> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  await validateSectionStatus(assessmentId, userId, section);

  const isSectionStarted = await startSectionById(
    assessmentId,
    userId,
    section
  );

  if (isSectionStarted) {
    const questionsBySection = await getQuestionsBySection(assessmentId, section);
    const userResponses = await getUserAssessmentResponsesById(assessmentId as UUID, userId as UUID)

    const enrichedQuestions = questionsBySection.map((question) => {
      const userResponse = userResponses.find((response) => response.question_id === question.id);
      return {
        ...question.get({ plain: true }),
        selectedOptionId: userResponse ? userResponse.selected_option_id : null
      };
    });

    return await consistentRandomizer(userId, assessmentId, enrichedQuestions);
  }

  return null;
};

export const attemptQustion = async (
  assessmentId: string,
  userId: string,
  questionId: string,
  selectedOptionId: string
): Promise<boolean> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  const questionSection = (await getQuestionById(assessmentId, questionId))!
    .section;
  await validateSectionStatus(assessmentId, userId, questionSection);

  const [attemptedQuestion, isCreated] = await attemptQuestionById(
    assessmentId,
    userId,
    questionId,
    selectedOptionId
  );

  return !!attemptedQuestion;
};

export const attemptQustionDelete = async (
  assessmentId: string,
  userId: string,
  questionId: string,
  selectedOptionId: string
): Promise<boolean> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  const questionSection = (await getQuestionById(assessmentId, questionId))!
    .section;
  await validateSectionStatus(assessmentId, userId, questionSection);

  const isDeleted = await attemptQuestionDeleteById(
    assessmentId,
    userId,
    questionId,
    selectedOptionId
  );

  return isDeleted;
};

export const endSection = async (
  assessmentId: string,
  userId: string,
  section: number
): Promise<boolean> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  await validateSectionStatus(assessmentId, userId, section);

  const isSectionEnded = await endSectionById(assessmentId, userId, section);

  return isSectionEnded;
};

export const computeResults = async (
  assessmentId: string,
): Promise<boolean> => {
  await validateAssessmentEnd(assessmentId)

  const { transaction } = await computeUserResultsByAssessment(assessmentId, false)
  await computeAssessmentAnalytics(assessmentId, true, transaction)

  return true
};

export const publishResult = async (
  assessmentId: string,
  pubilsh: boolean
): Promise<boolean> => {
  await publishAssessmentResultsByAssessmentId(assessmentId, pubilsh)

  return true
};

export const viewAssessmentResults = async (
  assessmentId: string,
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: UserResultAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  results: UserResult[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "first_name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: results, count: allTagsCount } = await getResultsByAssessmentId(
    assessmentId,
    offset,
    pageSize,
    sortBy,
    order
  );

  const totalPages = Math.ceil(allTagsCount / pageSize);

  return {
    results: results,
    totalPages: totalPages,
  };
};

export const viewAssessmentResultsList = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: AssessmentResultListAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  results: AssessmentResult[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: assessmentResultList, count: allTagsCount } = await getAssessmentResultList(
    offset,
    pageSize,
    sortBy,
    order
  );

  const totalPages = Math.ceil(allTagsCount / pageSize);

  return {
    results: assessmentResultList,
    totalPages: totalPages,
  };
};

export const viewUserAssessmentResultsList = async (
  userId: string,
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: UserAssessmentResultListAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  results: UserAssessmentResult[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "createdAt";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: assessmentResultList, total: allTagsCount } = await getUserAssessmentResultList(
    userId,
    offset,
    pageSize,
    sortBy,
    order
  );

  const totalPages = Math.ceil(allTagsCount / pageSize);

  return {
    results: assessmentResultList,
    totalPages: totalPages,
  };
};

export const viewAssessmentAnalytics = async (
  assessmentId: string
): Promise<AssessmentResultAttributes> => {
  const assessmentAnalytics = await getAssessmentAnalyticsByAssessmentId(assessmentId);

  return assessmentAnalytics;
};

export const viewAssessmentAnalyticsChart = async (
  metric: AssessmentResultAnalyticsMetric,
  start_at?: string,
  end_at?: string
): Promise<ChartData[]> => {
  let startDate
  let endDate

  if (start_at) {
    startDate = new Date(start_at)
  } else {
    startDate = new Date(0) // set to oldest date
  }

  if (end_at) {
    endDate = new Date(end_at)
  } else {
    endDate = new Date() // set to newest date 
  }

  if (startDate > endDate) {
    throw new AppError(
      "Invalid Date Range",
      400,
      "Start date should be less than end date",
      false
    );
  }

  const assessmentAnalytics = await getAssessmentResultAnalyticsByMetric(metric, startDate, endDate);

  return assessmentAnalytics;
};

export const viewAssessmentTime = async (
  assessmentId: UUID,
  userId: string,
): Promise<AssessmentTime | null> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  const assessmentTime = await getAssessmentTimeData(assessmentId, userId);
  return assessmentTime;
}

export const viewAssessmentSections = async (
  assessmentId: UUID,
  userId: UUID
): Promise<number[]> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  const sectionStatuses = await getAssessmentSections(assessmentId);

  return sectionStatuses;
}

export const exportAssessments = async (
  assessmentIds: string[] | '*'
): Promise<string> => {
  const assessmentData = await exportAssessmentById(assessmentIds)

  if (!assessmentData) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    )
  }
  let savedFilesPath: string[] = []

  await Promise.all(assessmentData.map(async (assessment) => {
    const savedFilePath = await saveDataToDisk(JSON.stringify(assessment), `${assessment.name}-${nanoid(4)}.json`)
    savedFilesPath.push(savedFilePath)
  }));

  const archivePath = await createArchive(savedFilesPath, `exported-assessments-${nanoid(4)}`)

  await Promise.all(savedFilesPath.map(async (filePath) => {
    await deleteFileFromDisk(filePath)
  }));

  return archivePath
};

export const totalAssessmentCount = async (): Promise<number> => {

  const assessmentCount = await getAssessmentCountByType({ type: 'total', });
  return assessmentCount;
}
export const totalOngoingAssessmentCount = async (): Promise<number> => {

  const assessmentCount = await getAssessmentCountByType({ type: 'ongoing', });
  return assessmentCount;
}

export const totalScheduledAssessmentCount = async (): Promise<number> => {

  const assessmentCount = await getAssessmentCountByType({ type: 'scheduled', });
  return assessmentCount;
}

export const totalPastAssessmentCount = async (): Promise<number> => {

  const assessmentCount = await getAssessmentCountByType({ type: 'past', });
  return assessmentCount;
}
export const totalDraftAssessmentCount = async (): Promise<number> => {

  const assessmentCount = await getAssessmentCountByType({ type: 'draft' });
  return assessmentCount;
}

export const searchAssesments = async (
  query: string,
  pageStr?: string,
  pageSizeStr?: string,
  order?: "ASC" | "DESC"
): Promise<{
  searchResults: (Assessment & { searchRank: number })[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  order = order ?? "DESC";
  const offset = (page - 1) * pageSize;
  const { rows: searchResults, count: searchResultsCount } =
    await searchAssesmentsByQuery(
      query,
      offset,
      pageSize,
      order
    );
  if (!searchResults) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "someting went wrong",
      false
    );
  }
  const totalPages = Math.ceil(searchResultsCount / pageSize);
  return {
    searchResults: searchResults,
    totalPages: totalPages,
  };
};

export const searchAssignedAssesments = async (
  userId: string,
  query: string,
  pageStr?: string,
  pageSizeStr?: string,
  order?: "ASC" | "DESC"
): Promise<{
  searchResults: (Assessment & { searchRank: number })[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  order = order ?? "DESC";
  const offset = (page - 1) * pageSize;
  const { rows: searchResults, count: searchResultsCount } =
    await searchAssignedAssesmentsByQuery(
      userId,
      query,
      offset,
      pageSize,
      order
    );
  if (!searchResults) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "someting went wrong",
      false
    );
  }
  const totalPages = Math.ceil(searchResultsCount / pageSize);
  return {
    searchResults: searchResults,
    totalPages: totalPages,
  };
};