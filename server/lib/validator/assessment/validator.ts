import { check, query } from "express-validator";

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
    .isLength({ min: 2 })
    .escape()
    .withMessage("difficulty must be a number"),
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
