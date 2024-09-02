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
} from "../../types/assessment.types";
import { v4 as uuid } from "uuid";
import { getUserById } from "../../model/user/user.model";
import { AppError } from "../../lib/appError";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import { TagAttributes } from "../../schema/assessment/tag.schema";
import { AssessmentAttributes } from "../../schema/assessment/assessment.schema";
import Question from "../../schema/assessment/question.schema";
import {
  validateAssessment,
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

export const createAssessment = async (assement: {
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
}): Promise<AssementData | null> => {
  const existingUser = await getUserById(assement.created_by);
  if (existingUser == null) {
    throw new AppError(
      "User not found",
      404,
      "User with this id does not exist so Can't create assessment",
      false
    );
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
}): Promise<QuestionData | null> => {
  // const existingAssessment = await getAssessmentDetailsById(
  //   question.assessment_id
  // );
  // if (existingAssessment == null) {
  //   throw new AppError(
  //     "Assessment not found",
  //     404,
  //     "Assessment with this id does not exist so Can't create question",
  //     false
  //   );
  // }
  const questionData = await createQuestionInDB({
    id: uuid(),
    assessment_id: question.assessment_id,
    description: question.description,
    marks: question.marks,
    section: question.section,
  });
  return questionData;
};

export const createOption = async (option: {
  question_id: UUID;
  description: string;
  is_correct: boolean;
}): Promise<OptionData | null> => {
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
  if (existingQuestion == null) {
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
  if (existingOption == null) {
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
  if (existingQuestion == null) {
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

  const totalPages = Math.ceil(assignedAssessmentsCount / pageSize);

  return {
    assessments: assignedAssessments,
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
): Promise<boolean> => {
  await validateAssessment(assessmentId);
  const result = await startAssessmentById(assessmentId, userId);

  return result;
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
): Promise<Question[] | null> => {
  await validateAssessment(assessmentId);
  await validateAssessmentStatus(assessmentId, userId);
  await validateSectionStatus(assessmentId, userId, section);

  const isSectionStarted = await startSectionById(
    assessmentId,
    userId,
    section
  );
  if (isSectionStarted) {
    const questionsBySection = getQuestionsBySection(assessmentId, section);
    return questionsBySection;
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
