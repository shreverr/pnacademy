import { body, check, param, query } from "express-validator";

export const validateAssessment = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage("Assessment name must be 2 - 255 characters long"),

  check("description")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Assessment description must be more than 1 characters long"),

  check("is_active").isBoolean().withMessage("isActive must be a boolean"),

  check("start_at").isISO8601().withMessage("startAt must be a valid date"),

  check("end_at").isISO8601().withMessage("endAt must be a valid time"),

  check("duration")
    .isNumeric()
    .withMessage("duration must be a valid duration"),
];

export const validateQuestion = [
  check("assessment_id")
    .not()
    .isEmpty()
    .isUUID(4)
    .withMessage("Should be a valid uuid v4"),

  check("description")
    .not()
    .isEmpty()
    .isLength({ min: 1 })
    .withMessage("Question description must be more than 2 characters long"),

  check("marks").isNumeric().withMessage("marks must be a valid number"),
  check("section").isNumeric().withMessage("section must be a valid number"),
];

export const validateOption = [
  check("question_id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),

  check("description")
    .not()
    .isEmpty()
    .isLength({ min: 1 })

    .withMessage("Option description must be more than 2 characters long"),

  check("is_correct").isBoolean().withMessage("Must be a boolean"),
];

export const validateTag = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 255 })

    .withMessage("Tag name must be 2 - 255 characters long")
    .isLowercase(),
];

export const validateAssessmentUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 1, max: 255 })

    .withMessage("Assessment name must be 1 - 255 characters long"),

  check("description")
    .optional()
    .isLength({ min: 1 })

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

    .withMessage("Should be a valid uuid v4"),

  check("description")
    .optional()
    .isLength({ min: 1 })

    .withMessage("Question description must be more than 1 characters long"),

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

    .withMessage("Should be a valid uuid v4"),

  check("description")
    .optional()
    .isLength({ min: 1 })

    .withMessage("Option description must be more than 1 characters long"),

  check("is_correct").optional().isBoolean().withMessage("Must be a boolean"),
];

export const validateTagUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 2, max: 255 })

    .withMessage("Tag name must be 2 - 255 characters long")
    .isLowercase(),
];

export const validateAssessmentId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
];

export const validateAssessmentGetId = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)

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

    .withMessage("Should be a valid uuid v4"),
];

export const validateQuestionGetId = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
];

export const validateOptionId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
];

export const validateTagId = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
];

export const validateGetTag = [
  query("id")
    .not()
    .isEmpty()
    .isUUID(4)

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

    .withMessage("Should be a valid uuid v4"),

  check("name")
    .optional()
    .isLength({ min: 2, max: 255 })

    .withMessage("Group name must be 2 - 255 characters long"),
];

export const validateGroupsId = [
  check("groupIds.*")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
];
export const validateGetAssessmentbyGroupId = [
  query("groupId")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
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

    .withMessage("Should be a valid uuid v4"),

  check("tagId")
    .not()
    .isEmpty()
    .isUUID(4)

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

    .withMessage("difficulty must be 'easy', 'medium' or 'hard'"),
];

export const validateGenerateAssessmentSave = [
  check('questions.*.marks')
    .isNumeric()
    .withMessage('Marks must be a number'),

  check('questions')
    .isArray()
    .withMessage('Questions must be an array')
    .notEmpty()
    .withMessage('Questions array cannot be empty'),

  check('questions.*.description')
    .isString()
    .notEmpty()
    .withMessage('Question description must be a non-empty string'),

  check('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('Each question must have at least two options'),

  check('questions.*.options.*.description')
    .isString()
    .notEmpty()
    .withMessage('Option description must be a non-empty string'),

  check('questions.*.options.*.isCorrect')
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),

  check('questions.*.section')
    .not()
    .isEmpty()
    .withMessage("section cannot be empty")
    .matches(/^[1-9]\d*$/)
    .withMessage("section should be >= 1"),

  check('questions')
    .custom((questions) => {
      for (let question of questions) {
        const correctOptions = question.options.filter((option: { isCorrect: boolean }) => option.isCorrect);
        if (correctOptions.length === 0) {
          throw new Error('Each question must have at least one correct option');
        }
      }
      return true;
    })
    .withMessage('Each question must have at least one correct option'),

  ...validateAssessment
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

export const validateGetMyAssessmentsResultList = [
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
      "^(correct_answers_count|marks_scored|correct_percentage|wrong_answers_count|name|description)$"
    )
    .withMessage(
      `Must match one of the specified options:
          correct_answers_count|marks_scored|correct_percentage|wrong_answers_count|name|description`
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


export const validateAssessmentExport = [
  body('assessmentIds')
    .custom((value) => {
      // If it's a wildcard "*", it's valid
      if (value === '*') {
        return true;
      }

      // If it's an array, validate each UUID
      if (Array.isArray(value)) {
        return value.every((id) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        );
      }

      // Otherwise, it's invalid
      return false;
    })
    .withMessage('assessmentIds must be "*" or an array of valid UUID v4s')
];


export const validateAssesmentsSearch = [
  query("query")
    .not()
    .isEmpty()
    .withMessage("Query cannot be empty")
    .isString()
    .withMessage("Query must be a string"),
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
  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
  ]
