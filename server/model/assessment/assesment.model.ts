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
  } catch (error) {
    throw new AppError(
      "Error creating assessment",
      500,
      "Something went wrong",
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

    return assignedGroups.map((group) => ({ id: group.group_id }));
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
    const prompt = `Generate ${numberOfQuestions} quiz questions about ${topic} of ${difficulty} difficulty. Format the response as a JSON array where each question object has 'question', 'options' (an array of 4 choices) with  each option is array ( description and is correct boolean ) `;

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
      Options: q.options,
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
    if (
      error instanceof UniqueConstraintError &&
      (error.parent as any).table === "assessment_statuses"
    ) {
      throw new AppError(
        "Assessment already started",
        409,
        "Assessment already started",
        false
      );
    } else if (
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
): Promise<Question[] | null> => {
  logger.info(`Getting questios by section`);
  try {
    // Find the question
    const questions = await Question.findAll({
      where: {
        assessment_id: assessmentId,
        section: section,
      },
      attributes: ["id", "description", "marks", "section", "assessment_id"],
      include: [
        {
          model: Option,
          as: "options",
          attributes: ["id", "description", "question_id"],
        },
      ],
    });

    logger.info(questions);

    if (!questions) {
      return null;
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
