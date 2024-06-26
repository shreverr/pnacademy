import { type UUID } from 'crypto'
import {
  checkAssessmentExists,
  checkQuestionExists,
  createAssementInDB,
  createOptionInDB,
  createQuestionInDB,
  createTagInDB,
  deleteAssessmentInDB,
  deleteOptionInDB,
  deleteQuestionInDB,
  deleteTagInDB,
  getAssessmentById,
  getOptionById,
  getQuestionById,
  getTagById,
  updateAssessmentInDB,
  updateOptionInDB,
  updateQuestionInDB,
  updateTagInDB
} from '../../model/assessment/assesment.model'
import {
  type OptionData,
  type QuestionData,
  type AssementData,
  type TagData,
  type AssementDetailedData,
  type QuestionDetailedData
} from '../../types/assessment.types'
import { v4 as uuid } from 'uuid'
import { getUserById } from '../../model/user/user.model'
import { AppError } from '../../lib/appError'

export const createAssessment = async (assement: {
  name: string
  description: string
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: number
  created_by: UUID
}): Promise<AssementData | null> => {
  const existingUser = await getUserById(assement.created_by)
  if (existingUser == null) {
    throw new AppError(
      'User not found',
      404,
      "User with this id does not exist so Can't create assessment",
      false
    )
  }
  const assementData = await createAssementInDB({
    id: uuid(),
    name: assement.name,
    description: assement.description,
    is_active: assement.is_active,
    start_at: assement.start_at,
    end_at: assement.end_at,
    duration: assement.duration,
    created_by: assement.created_by
  })
  return assementData
}

export const createQuestion = async (question: {
  assessment_id: UUID
  description: string
  marks: number
  section: number
}): Promise<QuestionData | null> => {
  const existingAssessment = await checkAssessmentExists(question.assessment_id)
  if (existingAssessment == null) {
    throw new AppError(
      'Assessment not found',
      404,
      "Assessment with this id does not exist so Can't create question",
      false
    )
  }
  const questionData = await createQuestionInDB({
    id: uuid(),
    assessment_id: question.assessment_id,
    description: question.description,
    marks: question.marks,
    section: question.section
  })
  return questionData
}

export const createOption = async (option: {
  question_id: UUID
  description: string
  is_correct: boolean
}): Promise<OptionData | null> => {
  const existingQuestion = await checkQuestionExists(option.question_id)
  if (existingQuestion == null) {
    throw new AppError(
      'Question not found',
      404,
      "Question with this id does not exist so Can't create option",
      false
    )
  }
  const optionData = await createOptionInDB({
    id: uuid(),
    question_id: option.question_id,
    description: option.description,
    is_correct: option.is_correct
  })
  return optionData
}
export const createTag = async (tag: {
  name: string
}): Promise<TagData | null> => {
  const TagData = await createTagInDB({
    id: uuid(),
    name: tag.name
  })
  return TagData
}

export const updateAssessment = async (assessment: {
  id: UUID
  name: string | null
  description: string | null
  is_active: boolean | null
  start_at: Date | null
  end_at: Date | null
  duration: number | null
}): Promise<AssementData | null> => {
  const existingAssessment = await checkAssessmentExists(assessment.id)
  if (existingAssessment == null) {
    throw new AppError(
      'Assessment not found',
      404,
      "Assessment with this id does not exist so Can't update assessment",
      false
    )
  }
  const updatedAssessment = await updateAssessmentInDB({
    id: assessment.id,
    name: assessment.name,
    description: assessment.description,
    is_active: assessment.is_active,
    start_at: assessment.start_at,
    end_at: assessment.end_at,
    duration: assessment.duration
  })
  return updatedAssessment
}

export const updateQuestion = async (question: {
  id: UUID
  description: string | null
  marks: number | null
  section: number | null
}): Promise<QuestionData | null> => {
  const existingQuestion = await checkQuestionExists(question.id)
  if (existingQuestion == null) {
    throw new AppError(
      'Question not found',
      404,
      "Question with this id does not exist so Can't update question",
      false
    )
  }
  const updatedQuestion = await updateQuestionInDB({
    id: question.id,
    description: question.description,
    marks: question.marks,
    section: question.section
  })
  return updatedQuestion
}

export const updateOption = async (option: {
  id: UUID
  description: string | null
  is_correct: boolean | null
}): Promise<OptionData | null> => {
  const existingOption = await checkQuestionExists(option.id)
  if (existingOption == null) {
    throw new AppError(
      'Option not found',
      404,
      "Option with this id does not exist so Can't update option",
      false
    )
  }
  const updatedOption = await updateOptionInDB({
    id: option.id,
    description: option.description,
    is_correct: option.is_correct
  })
  return updatedOption
}

export const updateTag = async (option: {
  id: UUID
  name: string | null
}): Promise<TagData | null> => {
  const existingTag = await getTagById(option.id)
  if (existingTag == null) {
    throw new AppError(
      'Tag not found',
      404,
      "Tag with this id does not exist so Can't update tag",
      false
    )
  }
  const updatedTag = await updateTagInDB({
    id: option.id,
    name: option.name
  })
  return updatedTag
}

export const deleteAssessment = async (Assessment: {
  id: UUID
}): Promise<boolean> => {
  const existingAssessment = await checkAssessmentExists(Assessment.id)
  if (existingAssessment == null) {
    throw new AppError(
      'Assessment not found',
      404,
      "Assessment with this id does not exist so Can't delete assessment",
      false
    )
  }
  const deletedAssessment = await deleteAssessmentInDB({
    id: Assessment.id
  })

  return deletedAssessment
}

export const deleteQuestion = async (question: {
  id: UUID
}): Promise<boolean> => {
  const existingQuestion = await checkQuestionExists(question.id)
  if (existingQuestion == null) {
    throw new AppError(
      'Question not found',
      404,
      "Question with this id does not exist so Can't delete question",
      false
    )
  }
  const deletedQuestion = await deleteQuestionInDB({
    id: question.id
  })
  return deletedQuestion
}

export const deleteOption = async (option: { id: UUID }): Promise<boolean> => {
  const existingOption = await getOptionById(option.id)
  if (existingOption == null) {
    throw new AppError(
      'Option not found',
      404,
      "Option with this id does not exist so Can't delete option",
      false
    )
  }
  const deletedOption = await deleteOptionInDB({
    id: option.id
  })
  return deletedOption
}

export const deleteTag = async (tag: { id: UUID }): Promise<boolean> => {
  const existingTag = await getTagById(tag.id)
  if (existingTag == null) {
    throw new AppError(
      'Tag not found',
      404,
      "Tag with this id does not exist so Can't delete tag",
      false
    )
  }
  const deletedTag = await deleteTagInDB({
    id: tag.id
  })
  return deletedTag
}

export const viewAssessmentDetails = async (
  userId: UUID
): Promise<AssementDetailedData | null> => {
  const assementData = await getAssessmentById(userId)
  if (assementData == null) {
    throw new AppError(
      'Assessment not found',
      404,
      'Assessment with this id does not exist',
      false
    )
  }
  return assementData
}

export const viewQuestionDetails = async (
  userId: UUID
): Promise<QuestionDetailedData | null> => {
  const questionData = await getQuestionById(userId)
  if (questionData === null) {
    throw new AppError(
      'Question not found',
      404,
      'Question with this id does not exist',
      false
    )
  }
  return questionData
}
