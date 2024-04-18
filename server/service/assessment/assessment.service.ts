import { type UUID } from "crypto";
import {
  createAssementInDB,
  createOptionInDB,
  createQuestionInDB,
  createTagInDB,
  getAssessmentById,
  getOptionById,
  getQuestionById,
  getTagById,
  updateAssessmentInDB,
  updateOptionInDB,
  updateQuestionInDB,
  updateTagInDB,
} from "../../model/assessment/assesment.model";
import {
  type OptionData,
  type QuestionData,
  type AssementData,
  TagData,
} from "../../types/assessment.types";
import { v4 as uuid } from "uuid";
import { getUserById } from "../../model/user/user.model";
import { AppError } from "../../lib/appError";

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
  const assementData = await createAssementInDB({
    id: uuid(),
    name: assement.name,
    description: assement.description,
    is_active: assement.is_active,
    start_at: assement.start_at,
    end_at: assement.end_at,
    duration: assement.duration,
    created_by: assement.created_by,
  });
  return assementData;
};

export const createQuestion = async (question: {
  assessment_id: UUID;
  description: string;
  marks: number;
}): Promise<QuestionData | null> => {
  const existingAssessment = await getAssessmentById(question.assessment_id);
  if (existingAssessment == null) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist so Can't create question",
      false
    );
  }
  const questionData = await createQuestionInDB({
    id: uuid(),
    assessment_id: question.assessment_id,
    description: question.description,
    marks: question.marks,
  });
  return questionData;
};
export const createOption = async (option: {
  question_id: UUID;
  description: string;
  is_correct: boolean;
}): Promise<OptionData | null> => {
  const existingQuestion = await getQuestionById(option.question_id);
  if (existingQuestion == null) {
    throw new AppError(
      "Question not found",
      404,
      "Question with this id does not exist so Can't create option",
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
  const existingAssessment = await getAssessmentById(assessment.id);
  if (existingAssessment == null) {
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
  return updatedAssessment;
};

export const updateQuestion = async (question: {
  id: UUID;
  description: string | null;
  marks: number | null;
}): Promise<QuestionData | null> => {
  const existingQuestion = await getQuestionById(question.id);
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
  });
  return updatedQuestion;
};

export const updateOption = async (option: {
  id: UUID;
  description: string | null;
  is_correct: boolean | null;
}): Promise<OptionData | null> => {
  const existingOption = await getOptionById(option.id);
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
  name : string | null;
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
}