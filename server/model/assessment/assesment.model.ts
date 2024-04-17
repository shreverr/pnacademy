import { type UUID } from 'crypto'
import { type OptionData, type QuestionData, type AssementData } from '../../types/assessment.types'
import { AppError } from '../../lib/appError'
import logger from '../../config/logger'
import Assessment from '../../schema/assessment/assessment.schema'
import Question from '../../schema/assessment/question.schema'
import Option from '../../schema/assessment/options.schema'

export const createAssementInDB = async (assessment: {
  id: string
  name: string
  description: string
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: number
  created_by: UUID
}): Promise<AssementData | null> => {
  logger.info(`Creating assessment: ${assessment.name}`)

  try {
    // Create the assessment
    const createdAssessment = await Assessment.create(
      {
        id: assessment.id,
        name: assessment.name,
        description: assessment.description,
        is_active: assessment.is_active,
        start_at: assessment.start_at,
        end_at: assessment.end_at,
        duration: assessment.duration,
        created_by: assessment.created_by
      },
      {
        raw: true
      }
    )
    return createdAssessment
  } catch (error) {
    throw new AppError(
      'Error creating assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getAssessmentById = async (
  id: UUID
): Promise<AssementData | null> => {
  logger.info(`Getting assessment with id: ${id}`)

  try {
    // Find the assessment
    const assessment = await Assessment.findOne({
      where: {
        id
      },
      raw: true
    })
    return assessment
  } catch (error) {
    throw new AppError(
      'Error getting assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getQuestionById = async (
  id: UUID
): Promise<QuestionData | null> => {
  logger.info(`Getting question with id: ${id}`)
  try {
    // Find the question
    const question = await Question.findOne({
      where: {
        id
      },
      raw: true
    })
    return question
  } catch (error) {
    throw new AppError(
      'Error getting question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const createQuestionInDB = async (question: {
  id: string
  assessment_id: UUID
  description: string
  marks: number
}): Promise<QuestionData | null> => {
  logger.info(`Creating question for assessment: ${question.assessment_id}`)

  try {
    const createdQuestion = await Question.create(
      {
        id: question.id,
        assessment_id: question.assessment_id,
        description: question.description,
        marks: question.marks
      },
      {
        raw: true
      }
    )
    return createdQuestion
  } catch (error) {
    throw new AppError(
      'Error creating question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const createOptionInDB = async (option: {
  id: string
  question_id: UUID
  description: string
  is_correct: boolean
}): Promise<OptionData | null> => {
  logger.info(`Creating option for question: ${option.question_id}`)

  try {
    const createdOption = await Option.create(
      {
        id: option.id,
        question_id: option.question_id,
        description: option.description,
        is_correct: option.is_correct
      },
      {
        raw: true
      }
    )
    return createdOption
  } catch (error) {
    throw new AppError(
      'Error creating option',
      500,
      'Something went wrong',
      false
    )
  }
}
