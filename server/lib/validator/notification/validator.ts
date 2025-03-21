import { check, query } from "express-validator";


export const validateNotification = [
  check("description")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters long"),

  check("title")
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 255 })
    .withMessage("Title must be at least 2 - 255 characters long"),

  check("image_url")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  check("file_url")
    .optional()
    .isURL()
    .withMessage("File URL must be a valid URL"),
];

export const validateNotificationDelete = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateGroup = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .withMessage("Group name must be at least 2 characters long"),
];

export const validateGetAllNotifications = [
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
      "^(id|description|title|createdAt|updatedAt)$"
    )
    .withMessage(
      `Must match one of the specified options: id|description|title|createdAt|updatedAt`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
           "ASC", "DESC",`
    ),
];

export const validateAddGroupToNotification = [
  check("notificationId")
    .not()
    .isEmpty()
    .withMessage("notificationId cannot be empty")
    .isUUID(4)
    .withMessage("notificationId should be a valid UUID v4"),

  check("groupId")
    .not()
    .isEmpty()
    .withMessage("groupId cannot be empty")
    .isUUID(4)
    .withMessage("groupId should be a valid UUID v4"),
];

export const validateRemoveGroupFromNotification = [
  check("notificationId")
    .not()
    .isEmpty()
    .withMessage("notificationId cannot be empty")
    .isUUID(4)
    .withMessage("notificationId should be a valid UUID v4"),

  check("groupId")
    .not()
    .isEmpty()
    .withMessage("groupId cannot be empty")
    .isUUID(4)
    .withMessage("groupId should be a valid UUID v4"),
];

export const validateViewAssignedNotifications = [
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
      "^(id|description|title|createdAt|updatedAt)$"
    )
    .withMessage(
      `Column names must match one of the specified options:
        id|description|title|createdAt|updatedAt.`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
];

export const validateGroupSearch = [
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

export const validateGroupsId = [
  check("groupIds.*")
    .not()
    .isEmpty()
    .isUUID(4)

    .withMessage("Should be a valid uuid v4"),
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
