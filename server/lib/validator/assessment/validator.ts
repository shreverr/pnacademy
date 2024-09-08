import { check, param, query } from "express-validator";

export const validateAssessment = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Assessment name must be more than 2 characters long"),

  check("description")
    .optional()

    .isLength({ min: 2 })
    .escape()
    .withMessage("Assessment description must be more than 2 characters long"),

  check("is_active").isBoolean().withMessage("isActive must be a boolean"),

  check("start_at").isISO8601().withMessage("startAt must be a valid date"),

  check("end_at").isISO8601().withMessage("endAt must be a valid time"),

  check("duration")
    .isNumeric()
    .withMessage("duration must be a valid duration"),

  check("created_by")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateQuestion = [
  check("assessment_id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("description")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Question description must be more than 2 characters long"),

  check("marks").isNumeric().withMessage("marks must be a valid number"),
  check("section").isNumeric().withMessage("section must be a valid number"),
];

export const validateOption = [
  check("question_id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("description")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Option description must be more than 2 characters long"),

  check("is_correct").isBoolean().withMessage("Must be a boolean"),
];

export const validateTag = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Tag name must be more than 2 characters long")
    .isLowercase(),
];

export const validateAssessmentUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Assessment name must be more than 2 characters long"),

  check("description")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Assessment description must be more than 2 characters long"),

  check("is_active")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  check("start_at")
    .optional()
    .isISO8601()
    .withMessage("startAt must be a valid date"),

  check("end_at")
    .optional()
    .isISO8601()
    .withMessage("endAt must be a valid time"),

  check("duration")
    .optional()
    .isNumeric()
    .withMessage("duration must be a valid duration"),
];

export const validateQuestionUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("description")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Question description must be more than 2 characters long"),

  check("marks")
    .optional()
    .isNumeric()
    .withMessage("marks must be a valid number"),

  check("section")
    .optional()
    .isNumeric()
    .withMessage("section must be a valid number"),
];

export const validateOptionUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("description")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Option description must be more than 2 characters long"),

  check("is_correct").optional().isBoolean().withMessage("Must be a boolean"),
];

export const validateTagUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Tag name must be more than 2 characters long")
    .isLowercase(),
];

export const validateAssessmentId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateAssessmentGetId = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateBulkAssessment = [
  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches(
      "^(id|name|description|is_active|start_at|end_at|duration|createdAt|updatedAt)$"
    )
    .withMessage(
      `Must match one of the specified options:
          "id", "name", "description", "is_active", "start_at", "end_at", "duration", "createdAt", or "updatedAt"`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
         "ASC", "DESC",`
    ),
];

export const validateQuestionId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateQuestionGetId = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateOptionId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateTagId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateGetTag = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateGetAllTags = [
  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches("^(id|name|createdAt|updatedAt)$")
    .withMessage(
      `Must match one of the specified options:
       "id", "name", "createdAt", or "updatedAt"`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
];

export const validateAddTag = [
  check("questionId")
    .not()
    .isEmpty()
    .withMessage("questionId cannot be empty")
    .isUUID(4)
    .withMessage("questionId should be a valid UUID v4"),

  check("tagId")
    .not()
    .isEmpty()
    .withMessage("tagId cannot be empty")
    .isUUID(4)
    .withMessage("tagId should be a valid UUID v4"),
];

export const validateGroupUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Group name must be more than 2 characters long"),
];

export const validateGroupsId = [
  check("groupIds.*")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateGetAllGroups = [
  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches("^(id|name|createdAt|updatedAt)$")
    .withMessage(
      `Column names must match one of the specified options:
        "id", "name", "createdAt",
        or "updatedAt".`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
];

export const validateRemoveTagFromQuestion = [
  check("questionId")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("tagId")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateAddGroupToAssessment = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("groupId")
    .not()
    .isEmpty()
    .withMessage("groupId cannot be empty")
    .isUUID(4)
    .withMessage("groupId should be a valid UUID v4"),
];

export const validateRemoveGroupFromAssessment = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("groupId")
    .not()
    .isEmpty()
    .withMessage("groupId cannot be empty")
    .isUUID(4)
    .withMessage("groupId should be a valid UUID v4"),
];

export const validateViewAssignedAssessment = [
  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches(
      "^(id|name|description|is_active|start_at|end_at|duration|createdAt|updatedAt)$"
    )
    .withMessage(
      `Column names must match one of the specified options:
        id|name|description|is_active|start_at|end_at|duration|createdAt|updatedAt.`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
];

export const validateGenerateAssessment = [
  check("topic")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Topic must be more than 2 characters long"),
  check("numberOfQuestions")
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage("numberOfQuestions must be a number"),
  check("difficulty")
    .not()
    .isEmpty()
    .isIn(["easy", "medium", "hard"])
    .escape()
    .withMessage("difficulty must be 'easy', 'medium' or 'hard'"),
];

export const validateSectionDelete = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("section")
    .not()
    .isEmpty()
    .withMessage("section cannot be empty")
    .matches(/^[1-9]\d*$/)
    .withMessage("section should be >= 1"),
];

export const validateStartAssessment = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),
];

export const validateEndAssessment = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),
];

export const validateComputeResults = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),
];

export const validateStartSection = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("section")
    .not()
    .isEmpty()
    .withMessage("section cannot be empty")
    .matches(/^[1-9]\d*$/)
    .withMessage("section should be >= 1"),
];

export const validateAttemptQuestion = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("questionId")
    .not()
    .isEmpty()
    .withMessage("questionId cannot be empty")
    .isUUID(4)
    .withMessage("questionId should be a valid UUID v4"),

  check("selectedOptionId")
    .not()
    .isEmpty()
    .withMessage("selectedOptionId cannot be empty")
    .isUUID(4)
    .withMessage("selectedOptionId should be a valid UUID v4"),
];

export const validateAttemptQuestionDelete = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("questionId")
    .not()
    .isEmpty()
    .withMessage("questionId cannot be empty")
    .isUUID(4)
    .withMessage("questionId should be a valid UUID v4"),

  check("selectedOptionId")
    .not()
    .isEmpty()
    .withMessage("selectedOptionId cannot be empty")
    .isUUID(4)
    .withMessage("selectedOptionId should be a valid UUID v4"),
];

export const validateEndSection = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("section")
    .not()
    .isEmpty()
    .withMessage("section cannot be empty")
    .matches(/^[1-9]\d*$/)
    .withMessage("section should be >= 1"),
];

export const validatePublishResult = [
  check("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  check("publish")
    .not()
    .isEmpty()
    .withMessage("publish cannot be empty")
    .isBoolean()
    .withMessage("section should be boolean"),
];

export const validateGetResult = [
  param("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4"),

  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches(
      "^(user_id|first_name|last_name|email|correct_answers_count|marks_scored|correct_percentage|wrong_answers_count|createdAt|updatedAt)$"
    )
    .withMessage(
      `Must match one of the specified options:
          user_id|first_name|last_name|email|correct_answers_count|marks_scored|correct_percentage|wrong_answers_count|createdAt|updatedAt`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
         "ASC", "DESC",`
    ),
];

export const validateGetAssessmentsResultList = [
  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page must be a number >= 1"),

  query("pageSize")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage("Page size must be a number >= 1"),

  query("sortBy")
    .optional()
    .matches(
      "^(id|name|assessment_id|total_marks|total_participants|average_marks|average_marks_percentage|is_published|createdAt|updatedAt)$"
    )
    .withMessage(
      `Must match one of the specified options:
          id|name|assessment_id|total_marks|total_participants|average_marks|average_marks_percentage|is_published|createdAt|updatedAt`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
         "ASC", "DESC",`
    ),
];

export const validateGetAssessmentAnalytics = [
  param("assessmentId")
    .not()
    .isEmpty()
    .withMessage("assessmentId cannot be empty")
    .isUUID(4)
    .withMessage("assessmentId should be a valid UUID v4")
];

export const validateGetAssessmentAnalyticsChart = [
  query("metric")
    .matches("^(average_marks_percentage|total_participants|average_marks)$")
    .withMessage(
      `Must match one of the specified options:
         average_marks_percentage | total_participants | average_marks`
    ),

  query("start_date")
    .optional()
    .isDate()
    .withMessage("start_date must be a valid date"),

  query("end_date")
    .optional()
    .isDate()
    .withMessage("start_date must be a valid date"),

  // Custom validation to ensure both start_date and end_date are provided together
];