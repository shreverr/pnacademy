import { type UUID } from 'crypto'
import {
  type OptionData,
  type QuestionData,
  type AssementData,
  type TagData,
  type AssementDetailedData,
  type QuestionDetailedData,
  TagAttribute
} from '../../types/assessment.types'
import { AppError } from '../../lib/appError'
import logger from '../../config/logger'
import Assessment from '../../schema/assessment/assessment.schema'
import Question from '../../schema/assessment/question.schema'
import Option from '../../schema/assessment/options.schema'
import Tag from '../../schema/assessment/tag.schema'
import { FindAndCountOptions } from 'sequelize'
import QuestionTag from '../../schema/junction/questionTag.schema'
import { sequelize } from '../../config/database'

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

export const getOptionById = async (id: UUID): Promise<OptionData | null> => {
  logger.info(`Getting Option with id: ${id}`)

  try {
    const option = await Option.findOne({
      where: {
        id
      },
      raw: true
    })
    return option
  } catch (error) {
    throw new AppError(
      'Error getting assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const checkAssessmentExists = async (id: UUID): Promise<boolean | null> => {
  logger.info(`Checking if assessment exists with id: ${id}`)

  try {
    const assessment = await Assessment.findOne({
      where: {
        id
      },
      raw: true
    })

    return assessment !== null
  } catch (error) {
    throw new AppError(
      'Error getting assessment',
      500,
      'Something went wrong',
      false
    )
  }
}


export const getAssessmentById = async (
  id: UUID
): Promise<AssementDetailedData | null> => {
  logger.info(`Getting assessment with id: ${id}`)

  try {
    const assessment = await Assessment.findOne({
      where: {
        id
      },
      include: [
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: Option,
              as: 'options'
            }
          ]
        }
      ]
    })

    if (!assessment) {
      return null
    }

    return assessment.dataValues as AssementDetailedData
  } catch (error) {
    throw new AppError(
      'Error getting assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const checkQuestionExists = async (id: UUID): Promise<boolean | null> => {
  logger.info(`Checking if question exists with id: ${id}`)

  try {
    const question = await Question.findOne({
      where: {
        id
      }
    })

    return question !== null
  } catch (error) {
    throw new AppError(
      'Error getting question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getQuestionById = async (
  id: UUID
): Promise<QuestionDetailedData | null> => {
  logger.info(`Getting question with id: ${id}`)
  try {
    // Find the question
    const question = await Question.findOne({
      where: {
        id
      },
      include: [
        {
          model: Option,
          as: 'options'
        }
      ],

    })
    if (!question) {
      return null
    }
    return question.dataValues as QuestionDetailedData
  } catch (error) {
    throw new AppError(
      'Error getting question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getTagById = async (id: UUID): Promise<TagData | null> => {
  logger.info(`Getting tag with id: ${id}`)

  try {
    const tag = await Tag.findOne({
      where: {
        id
      },
      raw: true
    })
    return tag
  } catch (error) {
    throw new AppError('Error getting tag', 500, 'Something went wrong', false)
  }
}

export const createQuestionInDB = async (question: {
  id: string
  assessment_id: UUID
  description: string
  marks: number
  section: number
}): Promise<QuestionData | null> => {
  logger.info(`Creating question for assessment: ${question.assessment_id}`)

  try {
    const createdQuestion = await Question.create(
      {
        id: question.id,
        assessment_id: question.assessment_id,
        description: question.description,
        marks: question.marks,
        section: question.section
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

export const createTagInDB = async (tag: {
  id: string
  name: string
}): Promise<TagData | null> => {
  logger.info(`Creating tag: ${tag.name}`)

  try {
    const createdTag = await Tag.create(
      {
        id: tag.id,
        name: tag.name
      },
      {
        raw: true
      }
    )
    return createdTag
  } catch (error) {
    throw new AppError(
      'Error creating tag',
      500,
      'Something went wrong',
      false
    )
  }
}

export const updateAssessmentInDB = async (assessment: {
  id: UUID
  name: string | null
  description: string | null
  is_active: boolean | null
  start_at: Date | null
  end_at: Date | null
  duration: number | null
}): Promise<AssementData | null> => {
  logger.info(`Updating assessment with id: ${assessment.id}`)

  try {
    // Find the assessment
    const updatedAssessmentDate: any = {
      name: assessment.name ?? undefined,
      description: assessment.description ?? undefined,
      is_active: assessment.is_active ?? undefined,
      start_at: assessment.start_at ?? undefined,
      end_at: assessment.end_at ?? undefined,
      duration: assessment.duration ?? undefined
    }
    Object.keys(updatedAssessmentDate).forEach(
      (key) =>
        updatedAssessmentDate[key] === undefined &&
        delete updatedAssessmentDate[key]
    )
    if (Object.keys(updatedAssessmentDate).length === 0) {
      return null
    }

    const [_, [updatedAssessment]] = await Assessment.update(
      updatedAssessmentDate,
      {
        where: {
          id: assessment.id
        },
        returning: true
      }
    )

    return updatedAssessment.dataValues as AssementData
  } catch (error) {
    throw new AppError(
      'Error updating assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const updateQuestionInDB = async (question: {
  id: UUID
  description: string | null
  marks: number | null
  section: number | null
}): Promise<QuestionData | null> => {
  logger.info(`Updating question with id: ${question.id}`)

  try {
    const updatedQuestionDate: any = {
      description: question.description ?? undefined,
      marks: question.marks ?? undefined,
      section: question.section ?? undefined
    }
    Object.keys(updatedQuestionDate).forEach(
      (key) =>
        updatedQuestionDate[key] === undefined &&
        delete updatedQuestionDate[key]
    )
    if (Object.keys(updatedQuestionDate).length === 0) {
      return null
    }

    const [_, [updatedQuestion]] = await Question.update(updatedQuestionDate, {
      where: {
        id: question.id
      },
      returning: true
    })
    return updatedQuestion.dataValues as QuestionData
  } catch (error) {
    throw new AppError(
      'Error updating question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const updateOptionInDB = async (option: {
  id: UUID
  description: string | null
  is_correct: boolean | null
}): Promise<OptionData | null> => {
  logger.info(`Updating option with id: ${option.id}`)

  try {
    const updatedOptionDate: any = {
      description: option.description ?? undefined,
      is_correct: option.is_correct ?? undefined
    }
    Object.keys(updatedOptionDate).forEach(
      (key) =>
        updatedOptionDate[key] === undefined && delete updatedOptionDate[key]
    )
    if (Object.keys(updatedOptionDate).length === 0) {
      return null
    }

    const [_, [updatedOption]] = await Option.update(updatedOptionDate, {
      where: {
        id: option.id
      },
      returning: true
    })
    return updatedOption.dataValues as OptionData
  } catch (error) {
    throw new AppError(
      'Error updating option',
      500,
      'Something went wrong',
      false
    )
  }
}

export const updateTagInDB = async (tag: {
  id: UUID
  name: string | null
}): Promise<TagData | null> => {
  logger.info(`Updating tag with id: ${tag.id}`)

  try {
    const updatedTagDate: any = {
      name: tag.name ?? undefined
    }
    Object.keys(updatedTagDate).forEach(
      (key) => updatedTagDate[key] === undefined && delete updatedTagDate[key]
    )
    if (Object.keys(updatedTagDate).length === 0) {
      return null
    }

    const [_, [updatedTag]] = await Tag.update(updatedTagDate, {
      where: {
        id: tag.id
      },
      returning: true
    })
    return updatedTag.dataValues as TagData
  } catch (error) {
    throw new AppError(
      'Error updating tag',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteAssessmentInDB = async (assessment: {
  id: UUID
}): Promise<boolean> => {
  logger.info(`Deleting assessment with id: ${assessment.id}`)

  try {
    // Find the assessment
    const deletedAssessment = await Assessment.destroy({
      where: {
        id: assessment.id
      }
    })

    return deletedAssessment === 1
  } catch (error) {
    throw new AppError(
      'Error deleting assessment',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteQuestionInDB = async (question: {
  id: UUID
}): Promise<boolean> => {
  logger.info(`Deleting question with id: ${question.id}`)

  try {
    // Find the question
    const deletedQuestion = await Question.destroy({
      where: {
        id: question.id
      }
    })

    return deletedQuestion === 1
  } catch (error) {
    throw new AppError(
      'Error deleting question',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteOptionInDB = async (option: {
  id: UUID
}): Promise<boolean> => {
  logger.info(`Deleting option with id: ${option.id}`)

  try {
    // Find the option
    const deletedOption = await Option.destroy({
      where: {
        id: option.id
      }
    })

    return deletedOption === 1
  } catch (error) {
    throw new AppError(
      'Error deleting option',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteTagInDB = async (tag: { id: UUID }): Promise<boolean> => {
  logger.info(`Deleting tag with id: ${tag.id}`)

  try {
    // Find the tag
    const deletedTag = await Tag.destroy({
      where: {
        id: tag.id
      }
    })

    return deletedTag === 1
  } catch (error) {
    throw new AppError(
      'Error deleting tag',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getAllTags = async (
  offset?: number,
  pageSize?: number,
  sortBy?: TagAttribute,
  order?: "ASC" | "DESC",
): Promise<{
  rows: TagData[],
  count: number
}> => {
  try {
    const findOptions: FindAndCountOptions = offset && pageSize && sortBy && order ? {
      limit: pageSize,
      offset: offset,
      order: [[sortBy, order]]
    } : {}

    const allTagsData = await Tag.findAndCountAll(findOptions);

    // Convert the data to plain object
    let plainData: {
      rows: TagData[]
      count: number
    } = {
      rows: allTagsData.rows.map((tag) => tag.get({ plain: true })),
      count: allTagsData.count
    }

    return plainData;
  } catch (error) {
    throw new AppError(
      "error getting all tags",
      500,
      "Something went wrong",
      true
    );
  }
};

export const addTagToQuestion = async (
  tagId: string,
  questionId: string
): Promise<boolean> => {
  logger.info(`Adding tag to question`)
  const transaction = await sequelize.transaction();
  try {
    const questionExists = await Question.findOne({ where: { id: questionId }, transaction });
    const tagExists = await Tag.findOne({ where: { id: tagId }, transaction });

    if (questionExists && tagExists) {
      const questionTag = await QuestionTag.create({
        question_id: questionId,
        tag_id: tagId
      }, {
        transaction
      });
      await transaction.commit();

      return !!questionTag;
    } else {
      await transaction.rollback();
      throw new AppError(
        "question or tag not found",
        500,
        'Either question or tag does not exist',
        false
      );
    }
  } catch (error:any) {
    throw new AppError(
      'Error adding tag to question',
      500,
      error,
      true
    )
  }
}