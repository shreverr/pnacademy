import { type UUID } from "crypto";
import { v4 as uuid } from "uuid";
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
  AiQuestionData,
  AssessmentAssigendGroupData,
  UserResult,
  UserResultAttributes,
  AssessmentResultListAttributes,
  AssessmentResultAnalyticsMetric,
  ChartData,
  AssessmentTime,
  UserAssessmentResultListAttributes,
  AssessmentCountParams,
} from "../../types/assessment.types";
import { AppError } from "../../lib/appError";
import logger from "../../config/logger";
import Assessment, {
  AssessmentAttributes,
} from "../../schema/assessment/assessment.schema";

import Question from "../../schema/assessment/question.schema";
import Option from "../../schema/assessment/options.schema";
import Tag from "../../schema/assessment/tag.schema";
import {
  col,
  FindAndCountOptions,
  fn,
  ForeignKeyConstraintError,
  QueryTypes,
  Transaction,
  Op,
  UniqueConstraintError,
  Sequelize,
  FindOptions,
  WhereOptions,
  literal,
} from "sequelize";
import QuestionTag from "../../schema/junction/questionTag.schema";
import { sequelize } from "../../config/database";
import AssessmentGroup from "../../schema/junction/assessmentGroup.schema";
import Group from "../../schema/group/group.schema";
import User from "../../schema/user/user.schema";
import { model } from "../../config/gemini";
import Section from "../../schema/assessment/section.schema";
import AssessmentStatus, {
  AssessmentStatusAttributes,
} from "../../schema/assessment/assessmentStatus.schema";
import SectionStatus from "../../schema/assessment/sectionStatus.schema";
import AssessmentResponse from "../../schema/assessment/assessmentResponse.schema";
import { GroupData } from "../../types/group.types";
import UserAssessmentResult from "../../schema/assessment/userAssessmentResult.schema";
import { log } from "console";
import AssessmentResult, { AssessmentResultAttributes } from "../../schema/assessment/assessmentResult.schema";
import { serve } from "swagger-ui-express";
import { isValidUUID } from "../../utils/validator";
import GroupAssessmentResult, { GroupAssessmentResultAttributes } from "../../schema/assessment/groupAssessmentResult.schema";
import UserGroup from "../../schema/junction/userGroup.schema";

export const createAssementInDB = async (assessment: {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
}): Promise<AssementData | null> => {
  logger.info(`Creating assessment: ${assessment.name}`);

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
        created_by: assessment.created_by,
      },
      {
        raw: true,
      }
    );
    return createdAssessment;
  } catch (error: any) {
    throw new AppError(
      "Error creating assessment",
      500,
      error,
      false
    );
  }
};

export const getOptionById = async (id: UUID): Promise<OptionData | null> => {
  logger.info(`Getting Option with id: ${id}`);

  try {
    const option = await Option.findOne({
      where: {
        id,
      },
      raw: true,
    });
    return option;
  } catch (error) {
    throw new AppError(
      "Error getting assessment",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getAssessmentDetailsById = async (
  id: UUID
): Promise<Assessment | null> => {
  logger.info(`Getting assessment details`);

  try {
    const assessment = await Assessment.findOne({
      where: {
        id,
      },
      raw: true,
    });

    return assessment;
  } catch (error) {
    throw new AppError(
      "Error getting assessment",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getAssessmentById = async (
  id: UUID
): Promise<AssementDetailedData | null> => {
  logger.info(`Getting assessment with id: ${id}`);

  try {
    const assessment = await Assessment.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Question,
          as: "questions",
          include: [
            {
              model: Option,
              as: "options",
              // Ordering options by createdAt in descending order
            },
          ],
        },
      ],
      order: [
        [{ model: Question, as: "questions" }, "section", "ASC"], // Order questions by section first
        [{ model: Question, as: "questions" }, "createdAt", "ASC"], // Then order questions by createdAt within each section
        [
          { model: Question, as: "questions" },
          { model: Option, as: "options" },
          "createdAt",
          "ASC",
        ], // Order options by createdAt in descending order
      ],
    });

    if (!assessment) {
      return null;
    }
    const assessmentData = assessment.dataValues as AssementDetailedData;

    return assessmentData;
  } catch (error) {
    throw new AppError(
      "Error getting assessment",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getAllAssessments = async (
  offset?: number,
  pageSize?: number,
  sortBy?: AssessmentAttribute,
  order?: "ASC" | "DESC"
): Promise<{ rows: AssessmentAttributes[]; count: number }> => {
  try {
    const findOptions: FindAndCountOptions =
      (offset !== null || offset !== undefined) && pageSize && sortBy && order
        ? {
          limit: pageSize,
          offset: offset,
          order: [[sortBy, order]],
        }
        : {};
    const allAssessments = await Assessment.findAndCountAll(findOptions);
    // Convert the data to plain object
    let plainData: {
      rows: AssessmentAttributes[];
      count: number;
    } = {
      rows: allAssessments.rows.map((assessment) =>
        assessment.get({ plain: true })
      ),
      count: allAssessments.count,
    };
    return plainData;
  } catch (error) {
    throw new AppError(
      "error getting all assessments",
      500,
      "Something went wrong",
      true
    );
  }
};

export const checkQuestionExists = async (
  id: UUID
): Promise<boolean | null> => {
  logger.info(`Checking if question exists with id: ${id}`);

  try {
    const question = await Question.findOne({
      where: {
        id,
      },
    });

    return question !== null;
  } catch (error) {
    throw new AppError(
      "Error getting question",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getQuestionAndOptionsById = async (
  id: UUID
): Promise<QuestionDetailedData | null> => {
  logger.info(`Getting question with id: ${id}`);
  try {
    // Find the question
    const question = await Question.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Option,
          as: "options",
        },
      ],

      order: [["options", "createdAt", "ASC"]],
    });
    if (!question) {
      return null;
    }
    return question.dataValues as QuestionDetailedData;
  } catch (error) {
    throw new AppError(
      "Error getting question",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getTagById = async (id: UUID): Promise<TagData | null> => {
  logger.info(`Getting tag with id: ${id}`);

  try {
    const tag = await Tag.findOne({
      where: {
        id,
      },
      raw: true,
    });
    return tag;
  } catch (error) {
    throw new AppError("Error getting tag", 500, "Something went wrong", false);
  }
};

export const createQuestionInDB = async (question: {
  id: string;
  assessment_id: string;
  description: string;
  marks: number;
  section: number;
}): Promise<QuestionData | null> => {
  logger.info(`Creating question for assessment: ${question.assessment_id}`);
  const transaction = await sequelize.transaction();
  try {
    const existingSection = await Section.findOne({
      where: {
        assessment_id: question.assessment_id,
      },
      order: [[fn("max", col("section")), "DESC"]],
      attributes: [[fn("max", col("section")), "section"]],
    });

    if (!existingSection && question.section === 1) {
      await Section.create(
        {
          assessment_id: question.assessment_id,
          section: question.section,
        },
        { transaction }
      );
    } else if (
      existingSection &&
      question.section === existingSection.section + 1
    ) {
      await Section.create(
        {
          assessment_id: question.assessment_id,
          section: question.section,
        },
        { transaction }
      );
    } else if (existingSection && question.section <= existingSection.section) {
    } else {
      throw new AppError(
        "Section does not exist or is not in order",
        404,
        "Section does not exist",
        false
      );
    }

    const createdQuestion = await Question.create(
      {
        id: question.id,
        assessment_id: question.assessment_id,
        description: question.description,
        marks: question.marks,
        section: question.section,
      },
      {
        transaction,
        raw: true,
      }
    );
    transaction.commit();
    return createdQuestion;
  } catch (error: any) {
    transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    } else if (
      error instanceof ForeignKeyConstraintError &&
      error.table === "assessments"
    ) {
      throw new AppError(
        "Assessment not found",
        404,
        "Assessment with this id does not exist so can't create question",
        false
      );
    }

    throw new AppError("Error creating question", 500, error, false);
  }
};

export const createOptionInDB = async (option: {
  id: string;
  question_id: UUID;
  description: string;
  is_correct: boolean;
}): Promise<OptionData | null> => {
  logger.info(`Creating option for question: ${option.question_id}`);

  try {
    const createdOption = await Option.create(
      {
        id: option.id,
        question_id: option.question_id,
        description: option.description,
        is_correct: option.is_correct,
      },
      {
        raw: true,
      }
    );
    return createdOption;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "Option already exists",
        409,
        "An option with ID already exists",
        false
      );
    } else if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        "Question does not exist",
        404,
        "Question with this question_id does not exists",
        false
      );
    } else {
      throw new AppError(
        "Error creating option",
        500,
        "Something went wrong",
        false
      );
    }
  }
};

export const createQuestionsInBulk = async (
  assessmentId: UUID,
  questions: Array<{
    description: string,
    marks: number,
    section: number,
    options: Array<{
      description: string,
      isCorrect: boolean
    }>
  }>,
): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const uniqueSections = [...new Set(questions.map(q => q.section))];

    // Fetch existing sections
    const existingSections = await Section.findAll({
      where: {
        assessment_id: assessmentId,
        section: uniqueSections
      },
      attributes: ['section'],
      transaction
    });
    // Determine new sections to create
    const existingSectionNumbers = existingSections.map(s => s.section);

    const newSections = uniqueSections
      .filter(section => !existingSectionNumbers.includes(section))
      .map(section => ({
        assessment_id: assessmentId,
        section: section
      }));

    // Bulk create new sections if any
    if (newSections.length > 0) {
      await Section.bulkCreate(newSections, { transaction });
    }
    // Prepare bulk question data
    const time = new Date();
    const questionData = questions.map((question, index) => ({
      id: uuid(),
      assessment_id: assessmentId,
      description: question.description,
      marks: question.marks,
      section: question.section,
      createdAt: new Date(time.getTime() + index), // Adds 1 ms per index
      updatedAt: new Date(time.getTime() + index),
    }));

    // Bulk create questions
    const createdQuestions = await Question.bulkCreate(questionData, { transaction });

    // Prepare bulk option data
    const optionData = questions.flatMap((question, index) =>
      question.options.map((option, optionIndex) => ({
        id: uuid(),
        question_id: createdQuestions[index].id,
        description: option.description,
        is_correct: option.isCorrect,
        createdAt: new Date(time.getTime() + optionIndex), // Adds 1 ms per index
        updatedAt: new Date(time.getTime() + optionIndex),
      }))
    );

    // Bulk create options
    await Option.bulkCreate(optionData, { transaction });

    await transaction.commit();
  } catch (error: any) {
    await transaction.rollback();
    throw new AppError(
      "Error creating questions in bulk",
      500,
      error,
      false
    );
  }
};

export const createTagInDB = async (tag: {
  id: string;
  name: string;
}): Promise<TagData | null> => {
  logger.info(`Creating tag: ${tag.name}`);

  try {
    const createdTag = await Tag.create(
      {
        id: tag.id,
        name: tag.name,
      },
      {
        raw: true,
      }
    );
    return createdTag;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "Tag already exists",
        409,
        "A tag with this name or ID already exists",
        false
      );
    }
    throw new AppError(
      "Error creating tag",
      500,
      "Something went wrong",
      false
    );
  }
};

export const updateAssessmentInDB = async (assessment: {
  id: UUID;
  name: string | null;
  description: string | null;
  is_active: boolean | null;
  start_at: Date | null;
  end_at: Date | null;
  duration: number | null;
}): Promise<AssementData | null> => {
  logger.info(`Updating assessment with id: ${assessment.id}`);

  try {
    // Find the assessment
    const updatedAssessmentDate: any = {
      name: assessment.name ?? undefined,
      description: assessment.description ?? undefined,
      is_active: assessment.is_active ?? undefined,
      start_at: assessment.start_at ?? undefined,
      end_at: assessment.end_at ?? undefined,
      duration: assessment.duration ?? undefined,
    };
    Object.keys(updatedAssessmentDate).forEach(
      (key) =>
        updatedAssessmentDate[key] === undefined &&
        delete updatedAssessmentDate[key]
    );
    if (Object.keys(updatedAssessmentDate).length === 0) {
      return null;
    }

    const [_, [updatedAssessment]] = await Assessment.update(
      updatedAssessmentDate,
      {
        where: {
          id: assessment.id,
        },
        returning: true,
      }
    );

    return updatedAssessment.dataValues as AssementData;
  } catch (error) {
    throw new AppError(
      "Error updating assessment",
      500,
      "Something went wrong",
      false
    );
  }
};

export const updateQuestionInDB = async (question: {
  id: UUID;
  description: string | null;
  marks: number | null;
  section: number | null;
}): Promise<QuestionData | null> => {
  logger.info(`Updating question with id: ${question.id}`);

  try {
    const updatedQuestionDate: any = {
      description: question.description ?? undefined,
      marks: question.marks ?? undefined,
      section: question.section ?? undefined,
    };
    Object.keys(updatedQuestionDate).forEach(
      (key) =>
        updatedQuestionDate[key] === undefined &&
        delete updatedQuestionDate[key]
    );
    if (Object.keys(updatedQuestionDate).length === 0) {
      return null;
    }

    const [_, [updatedQuestion]] = await Question.update(updatedQuestionDate, {
      where: {
        id: question.id,
      },
      returning: true,
    });
    return updatedQuestion.dataValues as QuestionData;
  } catch (error) {
    throw new AppError(
      "Error updating question",
      500,
      "Something went wrong",
      false
    );
  }
};

export const updateOptionInDB = async (option: {
  id: UUID;
  description: string | null;
  is_correct: boolean | null;
}): Promise<OptionData | null> => {
  logger.info(`Updating option with id: ${option.id}`);

  try {
    const updatedOptionDate: any = {
      description: option.description ?? undefined,
      is_correct: option.is_correct ?? undefined,
    };
    Object.keys(updatedOptionDate).forEach(
      (key) =>
        updatedOptionDate[key] === undefined && delete updatedOptionDate[key]
    );
    if (Object.keys(updatedOptionDate).length === 0) {
      return null;
    }

    const [_, [updatedOption]] = await Option.update(updatedOptionDate, {
      where: {
        id: option.id,
      },
      returning: true,
    });
    return updatedOption.dataValues as OptionData;
  } catch (error) {
    throw new AppError(
      "Error updating option",
      500,
      "Something went wrong",
      false
    );
  }
};

export const updateTagInDB = async (tag: {
  id: UUID;
  name: string | null;
}): Promise<TagData | null> => {
  logger.info(`Updating tag with id: ${tag.id}`);

  try {
    const updatedTagDate: any = {
      name: tag.name ?? undefined,
    };
    Object.keys(updatedTagDate).forEach(
      (key) => updatedTagDate[key] === undefined && delete updatedTagDate[key]
    );
    if (Object.keys(updatedTagDate).length === 0) {
      return null;
    }

    const [_, [updatedTag]] = await Tag.update(updatedTagDate, {
      where: {
        id: tag.id,
      },
      returning: true,
    });
    return updatedTag.dataValues as TagData;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "Tag already exists",
        409,
        "A tag with this name or ID already exists",
        false
      );
    }
    throw new AppError(
      "Error updating tag",
      500,
      "Something went wrong",
      false
    );
  }
};

export const deleteAssessmentInDB = async (assessment: {
  id: UUID;
}): Promise<boolean> => {
  logger.info(`Deleting assessment with id: ${assessment.id}`);

  try {
    // Find the assessment
    const deletedAssessment = await Assessment.destroy({
      where: {
        id: assessment.id,
      },
    });

    return deletedAssessment === 1;
  } catch (error) {
    throw new AppError(
      "Error deleting assessment",
      500,
      "Something went wrong",
      false
    );
  }
};

export const deleteQuestionInDB = async (question: {
  id: UUID;
}): Promise<boolean> => {
  logger.info(`Deleting question with id: ${question.id}`);

  try {
    // Find the question
    const deletedQuestion = await Question.destroy({
      where: {
        id: question.id,
      },
    });

    return deletedQuestion === 1;
  } catch (error) {
    throw new AppError(
      "Error deleting question",
      500,
      "Something went wrong",
      false
    );
  }
};

export const deleteOptionInDB = async (option: {
  id: UUID;
}): Promise<boolean> => {
  logger.info(`Deleting option with id: ${option.id}`);

  try {
    // Find the option
    const deletedOption = await Option.destroy({
      where: {
        id: option.id,
      },
    });

    return deletedOption === 1;
  } catch (error) {
    throw new AppError(
      "Error deleting option",
      500,
      "Something went wrong",
      false
    );
  }
};

export const deleteTagInDB = async (tag: { id: UUID }): Promise<boolean> => {
  logger.info(`Deleting tag with id: ${tag.id}`);

  try {
    // Find the tag
    const deletedTag = await Tag.destroy({
      where: {
        id: tag.id,
      },
    });

    return deletedTag === 1;
  } catch (error) {
    throw new AppError(
      "Error deleting tag",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getAllTags = async (
  offset?: number,
  pageSize?: number,
  sortBy?: TagAttribute,
  order?: "ASC" | "DESC"
): Promise<{
  rows: TagData[];
  count: number;
}> => {
  try {
    const findOptions: FindAndCountOptions =
      (offset !== null || offset !== undefined) && pageSize && sortBy && order
        ? {
          limit: pageSize,
          offset: offset,
          order: [[sortBy, order]],
        }
        : {};

    const allTagsData = await Tag.findAndCountAll(findOptions);

    // Convert the data to plain object
    let plainData: {
      rows: TagData[];
      count: number;
    } = {
      rows: allTagsData.rows.map((tag) => tag.get({ plain: true })),
      count: allTagsData.count,
    };

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
  logger.info(`Adding tag to question`);
  const transaction = await sequelize.transaction();
  try {
    const questionExists = await Question.findOne({
      where: { id: questionId },
      transaction,
    });
    const tagExists = await Tag.findOne({ where: { id: tagId }, transaction });

    if (questionExists && tagExists) {
      const questionTag = await QuestionTag.create(
        {
          question_id: questionId,
          tag_id: tagId,
        },
        {
          transaction,
        }
      );
      await transaction.commit();

      return !!questionTag;
    } else {
      await transaction.rollback();
      throw new AppError(
        "question or tag not found",
        500,
        "Either question or tag does not exist",
        false
      );
    }
  } catch (error: any) {
    throw new AppError("Error adding tag to question", 500, error, true);
  }
};

export const removeTagFromQuestionById = async (
  tagId: string,
  questionId: string
): Promise<boolean> => {
  logger.info(`Removing tag from question`);
  try {
    const result = await QuestionTag.destroy({
      where: {
        question_id: questionId,
        tag_id: tagId,
      },
    });

    if (result === 0) {
      return false;
    }

    return true;
  } catch (error: any) {
    throw new AppError("Error removing tag from question", 500, error, true);
  }
};

export const addGroupToAssessmentById = async (
  assessmentId: string,
  groupId: string
): Promise<boolean> => {
  logger.info(`Adding group to assessment`);
  try {
    const assessmentGroup = await AssessmentGroup.create({
      assessment_id: assessmentId,
      group_id: groupId,
    });

    return !!assessmentGroup;
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "Assessment already added to group",
        409,
        "Assessment already added to group",
        false
      );
    } else if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        "Either assessment or group does not exist",
        404,
        "Either assessment or group does not exist",
        false
      );
    } else {
      throw new AppError("Error adding assessment to group", 500, error, true);
    }
  }
};

export const removeGroupFromAssessmentById = async (
  assessmentId: string,
  groupId: string
): Promise<boolean> => {
  logger.info(`Removing group from assessment`);
  try {
    const result = await AssessmentGroup.destroy({
      where: {
        assessment_id: assessmentId,
        group_id: groupId,
      },
    });

    if (result === 0) {
      return false;
    }

    return true;
  } catch (error: any) {
    throw new AppError(
      "Error removing group from assessment",
      500,
      error,
      true
    );
  }
};

export const getAssessmentAssignedGroups = async (
  assessmentId: UUID
): Promise<AssessmentAssigendGroupData[]> => {
  logger.info(`Getting groups assigned to assessment ${assessmentId}`);

  try {
    const assignedGroups = await AssessmentGroup.findAll({
      where: {
        assessment_id: assessmentId,
      },
      attributes: ["group_id"],
    });


    assignedGroups.map((group) => ({ id: group.group_id }));
    const assignedGroupsData = await Group.findAll({
      where: {
        id: assignedGroups.map((group) => group.group_id),
      },
    });

    return assignedGroupsData.map((group) => ({ id: group.id, name: group.name }));

  } catch (error: any) {
    throw new AppError(
      "Error getting groups assigned to assessment",
      500,
      error,
      true
    );
  }
};

export const viewAssignedAssessmentsByUserId = async (
  userId: string,
  offset?: number,
  pageSize?: number,
  sortBy?: Exclude<AssessmentAttribute, "created_by">,
  order?: "ASC" | "DESC"
): Promise<{
  rows: Omit<AssessmentAttributes, "created_by">[];
  count: number;
}> => {
  try {
    const findOptions: FindAndCountOptions =
      (offset !== null || offset !== undefined) && pageSize && sortBy && order
        ? {
          limit: pageSize,
          offset: offset,
          order: [[sortBy, order]],
        }
        : {};

    const assignedAssessments = await Assessment.findAndCountAll({
      where: {
        is_active: true,
      },
      include: [
        {
          model: Group,
          include: [
            {
              model: User,
              where: {
                id: userId,
              },
              attributes: [],
              required: true,
            },
          ],
          attributes: [],
          required: true,
        },
      ],
      attributes: { exclude: ["created_by"] },
      ...findOptions,
    });

    // Convert the data to plain object
    let plainData: {
      rows: Omit<AssessmentAttributes, "created_by">[];
      count: number;
    } = {
      rows: assignedAssessments.rows.map((assessment) =>
        assessment.get({ plain: true })
      ),
      count: assignedAssessments.count,
    };

    return plainData;
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        "User does not exists",
        404,
        "User does not exists",
        false
      );
    }

    throw new AppError("error getting all assessments", 500, error, true);
  }
};

export const generateAiQuestions = async (
  topic: string,
  numberOfQuestions: number,
  difficulty: string
): Promise<AiQuestions | null> => {
  try {
    // const prompt = `Generate ${numberOfQuestions} quiz questions about 
    // ${topic} of ${difficulty} difficulty. Format the response as a JSON array where each question object has 'question', 'options' (an array of 4 choices) with  each option is array ( description and is correct boolean ) `;

    const prompt = `
    You are tasked with generating exactly ${numberOfQuestions} quiz questions on the topic of "${topic}" with a difficulty level of "${difficulty}".
    
    Output the result as a JSON array of ${numberOfQuestions} objects. Each object should have the following structure:
    - "question": A string containing the question text.
    - "options": An array of exactly 4 objects, each object having:
      - "description": A string representing the text of the option.
      - "isCorrect": A boolean indicating whether the option is correct.
    
    Make sure the JSON array contains exactly ${numberOfQuestions} questions, and each question has 4 options with one correct option.
    
    Use the following information for context between the triple quotes:
    """
    Number of questions: ${numberOfQuestions}
    Topic: ${topic}
    Difficulty: ${difficulty}
    """
 
    `;
    const data = await model.generateContent(prompt);
    const responseText = data.response.text();

    let parsedQuestions: any[];

    try {
      parsedQuestions = JSON.parse(responseText);
    } catch (error) {
      if (
        responseText.includes("```json\n") &&
        responseText.includes("\n```")
      ) {
        const jsonContent = responseText
          .trim()
          .split("```json\n")[1]
          .split("\n```")[0];
        parsedQuestions = JSON.parse(jsonContent);
      } else {
        throw new Error("Response format is incorrect.");
      }
    }

    if (!Array.isArray(parsedQuestions)) {
      throw new Error("Parsed content is not an array.");
    }

    const formattedQuestions: AiQuestionData[] = parsedQuestions.map((q) => ({
      description: q.question,
      options: q.options,
    }));

    return { questions: formattedQuestions };
  } catch (error) {
    throw new AppError(
      "Error generating AI questions",
      500,
      String(error),
      true
    );
  }
};

export const removeSectionFromAssessmentById = async (
  assessmentId: string,
  section: number
): Promise<boolean> => {
  logger.info(`Removing section from assessment`);
  try {
    const transaction = await sequelize.transaction();
    const result = await Section.destroy({
      where: {
        assessment_id: assessmentId,
        section: section,
      },
      transaction,
    });
    logger.info(`Section ${section} removed from assessment`);
    if (result === 0) {
      return false;
    }
    await Section.update(
      { section: sequelize.literal('section - 1') },
      {
        where: {
          assessment_id: assessmentId,
          section: { [Op.gt]: section }
        },
        transaction,
      }
    );
    transaction.commit();
    logger.info(`Section ${section} removed and subsequent sections updated`);
    return true;


  } catch (error: any) {
    throw new AppError(
      "Error removing section from assessment",
      500,
      error,
      true
    );
  }
};

export const startAssessmentById = async (
  assessmentId: string,
  userId: string
): Promise<boolean> => {
  logger.info(`Starting assessment`);
  try {
    const result = await AssessmentStatus.create({
      assessment_id: assessmentId,
      user_id: userId,
      started_at: new Date(),
    });

    return true;
  } catch (error: any) {
    if (error instanceof UniqueConstraintError &&
      (error.parent as any).table === "assessment_statuses") {
      return true;
    }
    if (error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "assessment_statuses_user_id_fkey") {
      throw new AppError(
        "user does not exist",
        404,
        "user does not exist",
        false
      );
    }

    throw new AppError(
      "Error starting test",
      500,
      error,
      true
    );
  }
};

export const endAssessmentById = async (
  assessmentId: string,
  userId: string
): Promise<boolean> => {
  logger.info(`Ending assessment`);
  try {
    const result = await AssessmentStatus.update(
      {
        submitted_at: new Date(),
      },
      {
        where: {
          assessment_id: assessmentId,
          user_id: userId,
        },
      }
    );

    return true;
  } catch (error: any) {
    if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "assessment_statuses_user_id_fkey"
    ) {
      throw new AppError(
        "user does not exist",
        404,
        "user does not exist",
        false
      );
    } else {
      throw new AppError("Error starting test", 500, error, true);
    }
  }
};

export const getAssessmentStatusById = async (
  assessmentId: string,
  userId: string
): Promise<AssessmentStatusAttributes> => {
  logger.info(`Getting assessment `);

  try {
    const assessmentStatus = await AssessmentStatus.findOne({
      where: {
        assessment_id: assessmentId,
        user_id: userId,
      },
      raw: true,
    });

    if (!assessmentStatus) {
      throw new AppError(
        "Assessment not started by user",
        404,
        "Assessment not started by user",
        false
      );
    }

    return assessmentStatus;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Error getting assessment", 500, error, true);
    }
  }
};

export const getAssessmentStatusesByUserId = async (
  userId: string
): Promise<AssessmentStatusAttributes[]> => {
  logger.info(`Getting assessment statuses by user id`);

  try {
    const assessmentStatuses = await AssessmentStatus.findAll({
      where: {
        user_id: userId,
      },
      raw: true,
    });

    return assessmentStatuses;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Error getting assessment statuses by user id", 500, error, true);
    }
  }
};

export const startSectionById = async (
  assessmentId: string,
  userId: string,
  section: number
): Promise<boolean> => {
  logger.info(`Starting assessment`);
  try {
    const result = await SectionStatus.create({
      assessment_id: assessmentId,
      user_id: userId,
      section: section,
      is_submited: false,
    });

    return true;
  } catch (error: any) {
    if (
      error instanceof UniqueConstraintError &&
      (error.parent as any).table === "section_statuses"
    ) {
      return true;
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "section_statuses_user_id_fkey"
    ) {
      throw new AppError(
        "user does not exist",
        404,
        "user does not exist",
        false
      );
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "section_statuses_assessment_id_fkey"
    ) {
      throw new AppError(
        "Assessment does not exist",
        404,
        "Assessment does not exist",
        false
      );
    } else {
      throw new AppError("Error starting test", 500, error, true);
    }
  }
};

export const endSectionById = async (
  assessmentId: string,
  userId: string,
  section: number
): Promise<boolean> => {
  logger.info(`Marking section as ended`);
  try {
    const [endedSectionRecord, isCreated] = await SectionStatus.upsert({
      assessment_id: assessmentId,
      user_id: userId,
      section: section,
      is_submited: true,
    });

    return !!endedSectionRecord;
  } catch (error: any) {
    if (
      error instanceof UniqueConstraintError &&
      (error.parent as any).table === "section_statuses"
    ) {
      return true;
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "section_statuses_user_id_fkey"
    ) {
      throw new AppError(
        "user does not exist",
        404,
        "user does not exist",
        false
      );
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "section_statuses_assessment_id_fkey"
    ) {
      throw new AppError(
        "Assessment does not exist",
        404,
        "Assessment does not exist",
        false
      );
    } else {
      throw new AppError("Error marking section as ended", 500, error, true);
    }
  }
};

export const getQuestionsBySection = async (
  assessmentId: string,
  section: number
): Promise<Question[]> => {
  logger.info(`Getting questios by section`);
  try {
    // Find the question
    const questions = await Question.findAll({
      where: {
        assessment_id: assessmentId,
        section: section,
      },
      attributes: ["id", "description", "marks", "section", "assessment_id"],
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Option,
          as: "options",
          attributes: ["id", "description", "question_id"],
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!questions) {
      return [];
    }
    return questions;
  } catch (error: any) {
    throw new AppError("Error getting question", 500, error, false);
  }
};

export const getSectionStatusesById = async (
  assessmentId: string,
  userId: string
): Promise<{
  rows: SectionStatus[];
  count: number;
}> => {
  logger.info(`Getting section statuses by id`);
  try {
    // Find the question
    const sectionStatuses = await SectionStatus.findAndCountAll({
      where: {
        assessment_id: assessmentId,
        user_id: userId,
      },
      raw: true
    });

    logger.info(sectionStatuses);

    return sectionStatuses;
  } catch (error: any) {
    throw new AppError("Error getting section statuses", 500, error, false);
  }
};

export const getQuestionById = async (
  assessmentId: string,
  questionId: string
): Promise<Question | null> => {
  logger.info(`Getting question by id`);
  try {
    // Find the question
    const question = await Question.findOne({
      where: {
        assessment_id: assessmentId,
        id: questionId,
      },
    });

    if (!question) {
      throw new AppError(
        "Question does not exist",
        404,
        "Question does not exist",
        false
      );
    }

    return question;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Error getting question", 500, error, false);
    }
  }
};

export const attemptQuestionById = async (
  assessmentId: string,
  userId: string,
  questionId: string,
  selectedOptionId: string
): Promise<[AssessmentResponse, boolean | null]> => {
  logger.info(`Attempting question by id`);
  try {
    // Find the question
    const attemptedQuestion = await AssessmentResponse.upsert({
      assessment_id: assessmentId,
      user_id: userId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
    });

    return attemptedQuestion;
  } catch (error: any) {
    if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint ===
      "assessment_responses_question_id_fkey"
    ) {
      throw new AppError(
        "Question does not exist",
        404,
        "Question does not exist",
        false
      );
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint === "assessment_responses_user_id_fkey"
    ) {
      throw new AppError(
        "User does not exist",
        404,
        "User does not exist",
        false
      );
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint ===
      "assessment_responses_assessment_id_fkey"
    ) {
      throw new AppError(
        "Assessment does not exist",
        404,
        "Assessment does not exist",
        false
      );
    } else if (
      error instanceof ForeignKeyConstraintError &&
      (error.parent as any).constraint ===
      "assessment_responses_selected_option_id_fkey"
    ) {
      throw new AppError(
        "Option does not exist",
        404,
        "Option does not exist",
        false
      );
    } else {
      throw new AppError("Error Attempting question", 500, error, false);
    }
  }
};

export const attemptQuestionDeleteById = async (
  assessmentId: string,
  userId: string,
  questionId: string,
  selectedOptionId: string
): Promise<boolean> => {
  logger.info(`Attempting question by id`);
  try {
    const recordDeleted = await AssessmentResponse.destroy({
      where: {
        assessment_id: assessmentId,
        user_id: userId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
      },
    });

    if (recordDeleted === 0) {
      throw new AppError(
        "Response does not exist",
        404,
        "Response does not exist",
        false
      );
    }

    return true;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Error deleting record", 500, error, true);
    }
  }
};

export const computeUserResultsByAssessment = async (
  assessmentId: string,
  commitTransaction: boolean,
  transaction?: Transaction
): Promise<{
  result: UserAssessmentResult[]
  transaction: Transaction
}> => {
  logger.info(`calculating user results for assessment`);
  if (!transaction) {
    transaction = await sequelize.transaction();
  }
  try {
    const userResultsQuery = `
        SELECT 
          ar.assessment_id,
          ar.user_id,
          SUM(CASE WHEN o.is_correct THEN 1 ELSE 0 END) AS correct_answers_count,
          SUM(CASE WHEN o.is_correct THEN 0 ELSE 1 END) AS wrong_answers_count,
          SUM(CASE WHEN o.is_correct THEN q.marks ELSE 0 END) AS marks_scored,
          (SUM(CASE WHEN o.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(q.id)) AS correct_percentage
        FROM 
          assessment_responses ar
        JOIN 
          questions q ON ar.question_id = q.id
        JOIN 
          options o ON ar.selected_option_id = o.id
        WHERE 
          ar.assessment_id = :assessmentId
        GROUP BY 
          ar.assessment_id, ar.user_id
      `;

    const userResults = await sequelize.query<{
      assessment_id: string;
      user_id: string;
      correct_answers_count: number;
      wrong_answers_count: number;
      marks_scored: number;
      correct_percentage: number;
    }>(userResultsQuery, {
      replacements: { assessmentId },
      type: QueryTypes.SELECT,
      transaction
    });

    const userAssessmentData = userResults.map(item => ({
      id: uuid(),
      assessment_id: item.assessment_id,
      user_id: item.user_id,
      correct_answers_count: item.correct_answers_count,
      wrong_answers_count: item.wrong_answers_count,
      marks_scored: item.marks_scored,
      correct_percentage: item.correct_percentage,
    }));

    const updatedUserAssessmentResults = await UserAssessmentResult.bulkCreate(userAssessmentData, {
      updateOnDuplicate: [
        'correct_answers_count',
        'wrong_answers_count',
        'marks_scored',
        'correct_percentage',
        'updatedAt'
      ],
      transaction
    })

    if (commitTransaction) {
      await transaction.commit();
    }

    return {
      result: updatedUserAssessmentResults,
      transaction
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Error calculating results",
        500,
        error,
        true
      );
    }
  }
}

export const computeAssessmentAnalytics = async (
  assessmentId: string,
  commitTransaction: boolean,
  transaction?: Transaction
): Promise<{
  result: AssessmentResult
  transaction: Transaction
}> => {
  logger.info(`calculating assessment results`);

  if (!transaction) {
    transaction = await sequelize.transaction();
  }
  try {
    const assessmentAnalytics = await UserAssessmentResult.findOne({
      attributes: [
        [Sequelize.cast(Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), "INTEGER"), 'total_participants'],
        [Sequelize.cast(Sequelize.fn('AVG', Sequelize.col('marks_scored')), "FLOAT"), 'average_marks'],
        [Sequelize.cast(Sequelize.fn('AVG', Sequelize.col('correct_percentage')), "FLOAT"), 'average_marks_percentage']
      ],
      where: {
        assessment_id: assessmentId
      },
      raw: true,
      transaction
    }) as unknown as {
      total_participants: number;
      average_marks: number;
      average_marks_percentage: number;
    }

    const totalMarks = await Question.findOne({
      attributes: [
        [Sequelize.cast(Sequelize.fn('SUM', Sequelize.col('marks')), "FLOAT"), 'total_marks'],
      ],
      where: {
        assessment_id: assessmentId
      },
      raw: true,
      transaction
    }) as unknown as {
      total_marks: number;
    }

    const [updatedRowsCount] = await AssessmentResult.update({
      total_participants: assessmentAnalytics.total_participants,
      average_marks: assessmentAnalytics.average_marks,
      average_marks_percentage: assessmentAnalytics.average_marks_percentage,
      total_marks: totalMarks.total_marks,
      is_published: false
    }, {
      where: { assessment_id: assessmentId },
      transaction
    });

    let updatedAssessmentAnalyticsData: AssessmentResult;

    if (updatedRowsCount === 0) {
      // If no rows were updated, create a new record
      updatedAssessmentAnalyticsData = await AssessmentResult.create({
        id: uuid(),
        assessment_id: assessmentId,
        total_participants: assessmentAnalytics.total_participants,
        average_marks: assessmentAnalytics.average_marks,
        average_marks_percentage: assessmentAnalytics.average_marks_percentage,
        total_marks: totalMarks.total_marks,
        is_published: false
      }, { transaction });
    } else {
      // If a row was updated, fetch the updated record
      updatedAssessmentAnalyticsData = await AssessmentResult.findOne({
        where: { assessment_id: assessmentId },
        transaction
      }) as AssessmentResult;
    }

    if (commitTransaction) {
      await transaction.commit();
    }

    return {
      result: updatedAssessmentAnalyticsData,
      transaction
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Error calculating results",
        500,
        error,
        true
      );
    }
  }
}

export const computeGroupAssessmentAnalytics = async (
  assessmentId: string,
  commitTransaction: boolean,
  transaction?: Transaction
): Promise<{
  results: GroupAssessmentResult[];
  transaction: Transaction
}> => {
  logger.info(`calculating group assessment results`);

  if (!transaction) {
    transaction = await sequelize.transaction();
  }
  try {
    // First, fetch all group IDs associated with this assessment
    const groupAssessments = await AssessmentGroup.findAll({
      where: { assessment_id: assessmentId },
      attributes: ['group_id'],
      transaction
    });

    const groupIds = groupAssessments.map(ga => ga.group_id);

    // Prepare to store group-level results
    const groupResults: GroupAssessmentResult[] = [];

    // Calculate analytics for each group
    for (const groupId of groupIds) {
      // Find users in this group who attempted the assessment
      const groupUserIds = await UserGroup.findAll({
        where: { group_id: groupId },
        attributes: ['user_id'],
        transaction
      });

      const userIds = groupUserIds.map(ug => ug.user_id);

      // Calculate group-specific assessment analytics
      const groupAnalytics = await UserAssessmentResult.findOne({
        attributes: [
          [Sequelize.cast(Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), "INTEGER"), 'total_participants'],
          [Sequelize.cast(Sequelize.fn('AVG', Sequelize.col('marks_scored')), "FLOAT"), 'average_marks'],
          [Sequelize.cast(Sequelize.fn('AVG', Sequelize.col('correct_percentage')), "FLOAT"), 'average_marks_percentage']
        ],
        where: {
          assessment_id: assessmentId,
          user_id: { [Op.in]: userIds }
        },
        raw: true,
        transaction
      }) as unknown as {
        total_participants: number;
        average_marks: number;
        average_marks_percentage: number;
      };

      // Get total marks for the assessment
      const totalMarks = await Question.findOne({
        attributes: [
          [Sequelize.cast(Sequelize.fn('SUM', Sequelize.col('marks')), "FLOAT"), 'total_marks'],
        ],
        where: {
          assessment_id: assessmentId
        },
        raw: true,
        transaction
      }) as unknown as {
        total_marks: number;
      };

      // Upsert group assessment result
      // const [updatedRowsCount] = await GroupAssessmentResult.upsert({
      //   id: uuid(),
      //   assessment_id: assessmentId,
      //   group_id: groupId,
      //   total_participants: groupAnalytics.total_participants,
      //   average_marks: groupAnalytics.average_marks,
      //   average_marks_percentage: groupAnalytics.average_marks_percentage,
      //   total_marks: totalMarks.total_marks,
      // }, {
      //   transaction,
      //   returning: true
      // });

      const [updatedRowsCount] = await GroupAssessmentResult.update({
        assessment_id: assessmentId,
        group_id: groupId,
        total_participants: groupAnalytics.total_participants,
        average_marks: groupAnalytics.average_marks,
        average_marks_percentage: groupAnalytics.average_marks_percentage,
        total_marks: totalMarks.total_marks,
      }, {
        where: { assessment_id: assessmentId, group_id: groupId },
        transaction
      });

      let updatedGroupAssessmentAnalyticsData: GroupAssessmentResult;

      if (updatedRowsCount === 0) {
        // If no rows were updated, create a new record
        updatedGroupAssessmentAnalyticsData = await GroupAssessmentResult.create({
          id: uuid(),
          assessment_id: assessmentId,
          group_id: groupId,
          total_participants: groupAnalytics.total_participants,
          average_marks: groupAnalytics.average_marks,
          average_marks_percentage: groupAnalytics.average_marks_percentage,
          total_marks: totalMarks.total_marks,
        }, { transaction });
      } else {
        // If a row was updated, fetch the updated record
        updatedGroupAssessmentAnalyticsData = await GroupAssessmentResult.findOne({
          where: { assessment_id: assessmentId, group_id: groupId },
          transaction
        }) as GroupAssessmentResult;
      }

      groupResults.push(updatedGroupAssessmentAnalyticsData as GroupAssessmentResult);
    }

    if (commitTransaction) {
      await transaction.commit();
    }

    return {
      results: groupResults,
      transaction
    }
  } catch (error: any) {
    if (transaction) {
      await transaction.rollback();
    }

    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Error calculating group assessment results",
        500,
        error,
        true
      );
    }
  }
}

export const publishAssessmentResultsByAssessmentId = async (
  assessmentId: string,
  pubilsh: boolean,
): Promise<boolean> => {
  logger.info(`Attempting question by id`);
  try {
    const [affectedCount] = await AssessmentResult.update({
      assessment_id: assessmentId,
      is_published: pubilsh,
    }, {
      where: {
        assessment_id: assessmentId,
      }
    });

    if (affectedCount === 0) {
      throw new AppError(
        "Assessment does not exist",
        404,
        "Assessment does not exist",
        false
      );
    }

    return true;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error
    } else {
      throw new AppError("Error Updating publish status", 500, error, true);
    }
  }
};

export const getResultsByAssessmentId = async (
  assessmentId: string,
  offset?: number,
  pageSize?: number,
  sortBy?: UserResultAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  rows: UserResult[];
  count: number
}> => {
  try {
    let findOptions: FindAndCountOptions = {}
    if ((offset !== null || offset !== undefined) && pageSize && sortBy && order) {
      findOptions = {
        limit: pageSize,
        offset: offset,
        order: [[sortBy, order]],
      }

      if (sortBy === "first_name" || sortBy === "last_name" || sortBy === "email") {
        findOptions.order = [[{ model: User, as: "user" }, sortBy, order]];
      }
    }

    findOptions = {
      ...findOptions,
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        },
      ],
      attributes: [
        "user_id", "correct_answers_count", "marks_scored", "correct_percentage",
        "wrong_answers_count", "createdAt", "updatedAt"
      ],
      where: {
        assessment_id: assessmentId,
      },
    }

    const allAssessmentResults = await UserAssessmentResult.findAndCountAll(findOptions);

    if (allAssessmentResults.count === 0) {
      throw new AppError(
        "Assessment results not found",
        404,
        "Assessment results not found",
        false
      );
    }

    // Convert the data to plain object
    let plainData: {
      rows: UserResult[];
      count: number;
    } = {
      rows: allAssessmentResults.rows.map((assessmentResult: any) =>
        assessmentResult.get({ plain: true })
      ),
      count: allAssessmentResults.count,
    };
    return plainData;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getResultsByAssessmentIdAndGroupId = async (
  assessmentId: string,
  groupId: string,
  offset?: number,
  pageSize?: number,
  sortBy?: UserResultAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  rows: UserResult[];
  count: number;
}> => {
  try {
    let findOptions: FindAndCountOptions = {
      subQuery: false
    };

    // Handle pagination and sorting
    if ((offset !== null && offset !== undefined) && pageSize && sortBy && order) {
      findOptions.limit = pageSize;
      findOptions.offset = offset;
      
      // Handle sorting for user attributes vs result attributes
      if (sortBy === "first_name" || sortBy === "last_name" || sortBy === "email") {
        findOptions.order = [[{ model: User, as: "user" }, sortBy, order]];
      } else {
        findOptions.order = [[sortBy, order]];
      }
    }

    // Set up the query options
    findOptions = {
      ...findOptions,
      attributes: [
        "id",
        "user_id",
        "correct_answers_count",
        "marks_scored",
        "correct_percentage",
        "wrong_answers_count",
        "createdAt",
        "updatedAt"
      ],
      include: [{
        model: User,
        as: "user",
        required: true,
        attributes: ["first_name", "last_name", "email"],
        include: [{
          model: UserGroup,
          as: "user_groups", // Changed from userGroups to user_groups
          where: { group_id: groupId },
          attributes: [],
          required: true
        }]
      }],
      where: {
        assessment_id: assessmentId
      },
      distinct: true
    };

    const allAssessmentResults = await UserAssessmentResult.findAndCountAll(findOptions);

    if (allAssessmentResults.count === 0) {
      throw new AppError(
        "Assessment results not found",
        404,
        "No assessment results found for users in this group",
        false
      );
    }

    // Convert to plain object
    const plainData = {
      rows: allAssessmentResults.rows.map((assessmentResult: any) =>
        assessmentResult.get({ plain: true })
      ),
      count: allAssessmentResults.count
    };

    return plainData;

  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Error getting assessment results",
      500,
      error,
      true
    );
  }
};

export const getAssessmentResultList = async (
  offset?: number,
  pageSize?: number,
  sortBy?: AssessmentResultListAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  rows: AssessmentResult[];
  count: number
}> => {
  try {
    let findOptions: FindAndCountOptions = {}
    if ((offset !== null || offset !== undefined) && pageSize && sortBy && order) {
      findOptions = {
        limit: pageSize,
        offset: offset,
        order: [[sortBy, order]],
      }

      if (sortBy === "name") {
        findOptions.order = [[{ model: Assessment, as: "assessment" }, sortBy, order]];
      }
    }

    findOptions = {
      ...findOptions,
      include: [
        {
          model: Assessment,
          attributes: ["name"],
        },
      ],
      attributes: [
        "assessment_id",
        "total_marks",
        "total_participants",
        "average_marks",
        "average_marks_percentage",
        "is_published",
        "createdAt",
        "updatedAt",
      ],
    }

    const allAssessmentResults = await AssessmentResult.findAndCountAll(findOptions);

    if (allAssessmentResults.count === 0) {
      throw new AppError(
        "Assessment results not found",
        404,
        "Assessment results not found",
        false
      );
    }

    // Convert the data to plain object
    let plainData: {
      rows: AssessmentResult[];
      count: number;
    } = {
      rows: allAssessmentResults.rows.map((assessmentResult: any) =>
        assessmentResult.get({ plain: true })
      ),
      count: allAssessmentResults.count,
    };
    return plainData;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getAssessmentsGroupsList = async (
  offset?: number,
  pageSize?: number,
  sortBy?: keyof GroupAssessmentResultAttributes | "name",
  order?: "ASC" | "DESC"
): Promise<{
  rows: GroupAssessmentResult[];
  count: number
}> => {
  try {
    let findOptions: FindAndCountOptions = {}
    if ((offset !== null || offset !== undefined) && pageSize && sortBy && order) {
      findOptions = {
        limit: pageSize,
        offset: offset,
        order: [[sortBy, order]],
      }

      if (sortBy === "name") {
        findOptions.order = [[{ model: Group, as: "group" }, sortBy, order]];
      }
    }

    findOptions = {
      ...findOptions,
      attributes: [
        'group_id',
        [Sequelize.fn('COUNT', Sequelize.col('assessment_id')), 'total_assessments'],
        [Sequelize.fn('MAX', Sequelize.col('group.name')), 'group_name'], // Get group name
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT user_groups.user_id)
            FROM user_groups
            WHERE user_groups.group_id = group_assessment_result.group_id
          )`),
          'total_users'
        ]
      ],
      group: ['group_id', 'group.id'], // Group by both group_id and group.id to maintain association
      include: [
        {
          model: Group,
          attributes: [],
          required: true,
          subQuery: false
        },
      ],
    }

    const allGroups = await GroupAssessmentResult.findAll(findOptions);

    const totalCount = await GroupAssessmentResult.count({
      distinct: true,
      col: 'group_id'
    });

    if (totalCount === 0) {
      throw new AppError(
        "no results for groups found",
        404,
        "no results for groups found",
        false
      );
    }

    // Convert the data to plain object
    let plainData: {
      rows: GroupAssessmentResult[];
      count: number;
    } = {
      rows: allGroups.map((group: any) =>
        group.get({ plain: true })
      ),
      count: totalCount,
    };

    return plainData;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getUserAssessmentResultList = async (
  userId: string,
  offset?: number,
  pageSize?: number,
  sortBy?: UserAssessmentResultListAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  rows: any[];
  total: number
}> => {
  try {
    const limit = pageSize || 10;
    const sqlOffset = offset || 0;
    const sqlOrder = order || "ASC";
    const sqlSortBy = sortBy === "name" ? "a.name" : `uar.${sortBy}`;

    const query = `
      WITH published_assessments AS (
          SELECT DISTINCT ar.assessment_id
          FROM assessment_results ar
          WHERE ar.is_published = true
      )
      SELECT 
          uar.id,
          uar.correct_answers_count,
          uar.marks_scored,
          uar.correct_percentage,
          uar.wrong_answers_count,
          a.id AS "assessment.id",
          a.name AS "assessment.name",
          a.description AS "assessment.description"
      FROM 
          user_assessment_results uar
      INNER JOIN 
          assessments a ON uar.assessment_id = a.id
      INNER JOIN 
          published_assessments pa ON a.id = pa.assessment_id
      WHERE 
          uar.user_id = :userId
      ORDER BY 
          ${sqlSortBy} ${sqlOrder}
      LIMIT :limit OFFSET :offset;
    `;

    const results = await sequelize.query(query, {
      replacements: { userId, limit, offset: sqlOffset },
      type: QueryTypes.SELECT
    });

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_assessment_results uar
      INNER JOIN assessments a ON uar.assessment_id = a.id
      INNER JOIN assessment_results ar ON a.id = ar.assessment_id
      WHERE uar.user_id = :userId AND ar.is_published = true
    `;

    const [{ total }] = await sequelize.query<{ total: number }>(countQuery, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    if (total === 0) {
      throw new AppError(
        "Assessment results not found",
        404,
        "Assessment results not found",
        false
      );
    }

    // Convert the results to match the UserAssessmentResult structure
    const rows = results.map((result: any) => ({
      id: result.id,
      correct_answers_count: result.correct_answers_count,
      marks_scored: result.marks_scored,
      correct_percentage: result.correct_percentage,
      wrong_answers_count: result.wrong_answers_count,
      assessment: {
        id: result['assessment.id'],
        name: result['assessment.name'],
        description: result['assessment.description']
      }
    }));

    return { rows, total };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getAssessmentAnalyticsByAssessmentId = async (
  assessmentId: string,
): Promise<AssessmentResultAttributes> => {
  try {
    const assessmentAnalytics = await AssessmentResult.findOne({
      include: [
        {
          model: Assessment,
          attributes: ["name", "description"],
        },
      ],
      attributes: [
        "assessment_id",
        "total_marks",
        "total_participants",
        "average_marks",
        "average_marks_percentage",
        "is_published",
        "createdAt",
        "updatedAt",
      ],
      where: {
        assessment_id: assessmentId,
      },
    });

    if (!assessmentAnalytics) {
      throw new AppError(
        "Assessment result not found",
        404,
        "Assessment result not found",
        false
      );
    }

    return assessmentAnalytics;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getGroupAssessmentAnalyticsByAssessmentIdAndGroupId = async (
  assessmentId: string,
  groupId: string,
): Promise<GroupAssessmentResultAttributes> => {
  try {
    const assessmentAnalytics = await GroupAssessmentResult.findOne({
      include: [
        {
          model: Group,
          attributes: ["name"],
        },
      ],
      where: {
        assessment_id: assessmentId,
        group_id: groupId,
      },
      attributes: [
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT user_groups.user_id)
            FROM user_groups
            WHERE user_groups.group_id = group_assessment_result.group_id
          )`),
          'total_users'
        ],
        "id",
        "assessment_id",
        "group_id",
        "total_marks",
        "total_participants",
        "average_marks",
        "average_marks_percentage",
        "createdAt",
        "updatedAt",
      ]
    });

    if (!assessmentAnalytics) {
      throw new AppError(
        "Group Assessment result not found",
        404,
        "Group Assessment result not found",
        false
      );
    }

    return assessmentAnalytics;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting group assessment analytics",
        500,
        error,
        true
      );
    }
  }
};

export const getAssessmentResultAnalyticsByMetric = async (
  metric: AssessmentResultAnalyticsMetric,
  start_date?: Date,
  end_date?: Date,
): Promise<ChartData[]> => {
  try {
    let whereClause: Record<string, any> = {};
    if (start_date && end_date) {
      whereClause.created_at = {
        [Op.between]: [start_date, end_date],
      };
    } else if (start_date) {
      whereClause.created_at = {
        [Op.gte]: start_date,
      };
    } else if (end_date) {
      whereClause.created_at = {
        [Op.lte]: end_date,
      };
    }


    const assessmentResultAnalytics = await AssessmentResult.findAll({
      attributes: [metric, "createdAt"],
      where: whereClause,
      order: [['created_at', 'ASC']],
    });

    return assessmentResultAnalytics.map((result: any) => ({
      createdAt: result.createdAt,
      metricValue: result[metric],
    }));
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "error getting assessment results",
        500,
        error,
        true
      );
    }
  }
};

export const getAssessmentTimeData = async (
  assessmentId: UUID,
  userId: string
): Promise<AssessmentTime | null> => {
  try {

    const assessmentStatus = await AssessmentStatus.findOne({
      where: {
        assessment_id: assessmentId,
        user_id: userId,
      },
    });

    const assessment = await Assessment.findOne({
      where: {
        id: assessmentId,
      },
    });

    if (!assessmentStatus || !assessment) {
      throw new AppError(
        "Assessment time data not found",
        404,
        "Assessment time data not found",
        false
      );
    }

    const serverTime = new Date();

    const assessmentTimeData: AssessmentTime = {
      duration: assessment.duration,
      server_time: serverTime,
      started_at: assessmentStatus.started_at,
    };

    return assessmentTimeData;
  } catch (error: any) {
    throw new AppError(
      "Error getting assessment time data",
      500,
      error.message,
      true
    );
  }
}

export const getAssessmentSections = async (assessmentId: UUID): Promise<number[]> => {
  try {
    const sections = await Section.findAll({
      attributes: ['section'],
      where: {
        assessment_id: assessmentId,
      },
      order: [['section', 'ASC']],
      raw: true
    });


    const sectionNumbers = (sections as { section: number }[])
      .map(s => s.section)
      .filter((section): section is number => typeof section === 'number');

    if (sectionNumbers.length === 0) {
      throw new AppError('No sections found for the given assessment', 404, 'NOT_FOUND', false);
    }

    return sectionNumbers;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Error retrieving assessment sections",
      500,
      error instanceof Error ? error.message : 'Unknown error',
      true
    );
  }
}

export const getUserAssessmentResponsesById = async (
  assessmentId: UUID,
  userId: UUID
): Promise<AssessmentResponse[]> => {
  try {
    const userResponses = await AssessmentResponse.findAll({
      where: {
        assessment_id: assessmentId,
        user_id: userId,
      },
      raw: true
    });

    return userResponses;
  } catch (error: any) {
    throw new AppError(
      "Error retrieving assessment responses",
      500,
      error,
      true
    );
  }
}

export const exportAssessmentById = async (
  ids: string[] | '*'
): Promise<Assessment[] | null> => {
  logger.info(`Getting assessments`);

  try {
    let findOptions: FindOptions = {
      attributes: ["name", "description", "duration", "is_active", "start_at", "end_at"],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["description", "marks", "section"],
          include: [
            {
              model: Option,
              as: "options",
              attributes: ["description", "is_correct"],
            },
          ],
        },
      ],
      order: [
        [{ model: Question, as: "questions" }, "section", "ASC"], // Order questions by section first
        [{ model: Question, as: "questions" }, "createdAt", "ASC"], // Then order questions by createdAt within each section
        [
          { model: Question, as: "questions" },
          { model: Option, as: "options" },
          "createdAt",
          "ASC",
        ], // Order options by createdAt in descending order
      ],
    }

    if (ids !== '*') {
      findOptions.where = {
        id: {
          [Op.in]: ids,
        }
      };
    }

    const assessment = await Assessment.findAll(findOptions);
    if (!assessment) {
      return null;
    }

    return assessment;
  } catch (error: any) {
    throw new AppError(
      "Error getting assessment",
      500,
      error,
      false
    );
  }
};

export const getAssessmentCountByType = async ({
  type,
  user_id,
}: AssessmentCountParams): Promise<number> => {
  const currentDate = new Date();

  let whereClause: WhereOptions<AssessmentAttributes> = {
    is_active: true,
  };

  // Add type-specific conditions
  switch (type) {
    case 'scheduled':
      whereClause.start_at = { [Op.gt]: currentDate };
      break;

    case 'past':
      whereClause.end_at = { [Op.lt]: currentDate };
      break;

    case 'ongoing':
      whereClause.start_at = { [Op.lte]: currentDate };
      whereClause.end_at = { [Op.gt]: currentDate };
      break;

    case 'draft':
      whereClause.is_active = false;
      break;

    case 'total':

      break;

    default:
      throw new AppError("Invalid assessment count type", 400, '0', false);
  }

  try {
    if (user_id) {
      logger.info(`Getting assessment count for user ${user_id}`);
      const assignedAssessments = await Assessment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Group,
            include: [
              {
                model: User,
                where: { id: user_id },
                attributes: [],
                required: true,
              },
            ],
            attributes: [],
            required: true,
          },
        ],
      });

      return assignedAssessments.count;
    } else {

      const count = await Assessment.count({
        where: whereClause,
      });

      return count;
    }

  } catch (error: any) {
    throw new AppError(
      "Error getting assessment count",
      500,
      error,
      false
    );
  }
};

export const searchAssesmentsByQuery = async (
  query: string,
  offset?: number,
  pageSize?: number,
  order?: "ASC" | "DESC"
): Promise<{
  rows: (Assessment & { searchRank: number })[];
  count: number;
}> => {
  try {
    const searchResults = await Assessment.findAndCountAll({
      where: {
        [Op.or]: [
          literal(`search_vector @@ plainto_tsquery('english', :query)`),
          // Only include the id condition if the query is a valid UUID
          ...(isValidUUID(query) ? [{ id: query }] : [])
        ],
      },
      order: [
        [literal(`ts_rank(search_vector, plainto_tsquery('english', :query))`), 'DESC']
      ],
      replacements: { query },
      limit: pageSize,
      offset,
      distinct: true,
    }) as { rows: (Assessment & { searchRank: number })[], count: number };
    return searchResults;
  } catch (error: any) {
    throw new AppError(
      "someting went wrong",
      500,
      "someting went wrong",
      true
    );
  }
}

export const searchAssignedAssesmentsByQuery = async (
  userId: string,
  query: string,
  offset: number = 0,
  pageSize: number = 10,
  order: "ASC" | "DESC" = "DESC"
): Promise<{
  rows: (Assessment & { searchRank: number; isSubmitted: boolean })[];
  count: number;
}> => {
  try {
    const sqlQuery = `
      WITH filtered_assessments AS (
          SELECT DISTINCT ON ("assessment"."id")
              "assessment"."id",
              "assessment"."name",
              "assessment"."description",
              "assessment"."is_active",
              "assessment"."start_at",
              "assessment"."end_at",
              "assessment"."duration",
              "assessment"."created_by",
              "assessment"."createdAt",
              "assessment"."updatedAt",
              CASE 
                  WHEN "assessment_statuses"."submitted_at" IS NOT NULL 
                  OR (
                      "assessment_statuses"."started_at" IS NOT NULL 
                      AND (EXTRACT(EPOCH FROM NOW()) * 1000 - EXTRACT(EPOCH FROM "assessment_statuses"."started_at") * 1000) > "assessment"."duration"
                  )
                  OR (
                      "assessment_statuses"."started_at" IS NOT NULL 
                      AND EXTRACT(EPOCH FROM NOW()) > EXTRACT(EPOCH FROM "assessment"."end_at")
                  )
                  THEN true 
                  ELSE false 
              END as "isSubmitted",
              ts_rank("assessment".search_vector, plainto_tsquery('english', :query)) as "searchRank"
          FROM 
              "assessments" AS "assessment"
              INNER JOIN (
                  "assessment_groups" AS "groups->assessment_group"
                  INNER JOIN "groups" AS "groups" 
                  ON "groups"."id" = "groups->assessment_group"."group_id"
              ) ON "assessment"."id" = "groups->assessment_group"."assessment_id"
              INNER JOIN (
                  "user_groups" AS "groups->users->user_group"
                  INNER JOIN "users" AS "groups->users" 
                  ON "groups->users"."id" = "groups->users->user_group"."user_id"
              ) ON "groups"."id" = "groups->users->user_group"."group_id"
              AND "groups->users"."id" = :userId
              LEFT OUTER JOIN "assessment_statuses" AS "assessment_statuses" 
              ON "assessment"."id" = "assessment_statuses"."assessment_id"
              AND "assessment_statuses"."user_id" = :userId
          WHERE 
              ("assessment"."is_active" = true 
              AND 
              ${isValidUUID(query) ? `"assessment"."id" = :query` : `("assessment".search_vector @@ plainto_tsquery('english', :query))`}
              )
      )
      SELECT 
          (SELECT COUNT(*) FROM filtered_assessments) AS total_count,
          *
      FROM filtered_assessments
      ORDER BY "searchRank" DESC
      LIMIT :pageSize
      OFFSET :offset;
    `;

    const results: any = await sequelize.query(sqlQuery, {
      replacements: { userId, query, pageSize, offset },
      type: QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return { rows: [], count: 0 };
    }

    const count = parseInt(results[0].total_count as string, 10);
    const rows = results.map((result: any) => {
      const { total_count, ...rest } = result;
      return rest as Assessment & { searchRank: number; isSubmitted: boolean };
    });

    return { rows, count };
  } catch (error: any) {
    throw new AppError(
      "Something went wrong",
      500,
      error,
      true
    );
  }
};