import { check, query } from "express-validator";

export const validateUserRegister = [
  check("firstName")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be more than 2 characters long"),

  check("lastName")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name must be more than 2 characters long"),

  check("email")
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage("Must me valid email address"),

  check("phone")
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be a valid phone number"),
  check("roleId")
    .optional()
    .notEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Role Id must be UUID v4"),

  check("password").notEmpty().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  }).withMessage(`Password must be more than 8 characters long with
        at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`),
];

export const validateGetAllUsers = [
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
      "^(id|role_id|first_name|last_name|email|phone|createdAt|updatedAt)$"
    )
    .withMessage(
      `Must match one of the specified options:
       "id", "role_id", "first_name", "last_name", "email", 
       "phone", "createdAt", or "updatedAt"`
    ),

  query("order")
    .optional()
    .matches("^(ASC|DESC)$")
    .withMessage(
      `Must match one of the specified options:
       "ASC", "DESC",`
    ),
];

export const validateGetAllRoles = [
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
      "^(id|name|canManageAssessment|canManageUser|canManageRole|canManageNotification|canManageLocalGroup|canManageReports|canAttemptAssessment|canViewReport|canManageMyAccount|canViewNotification|createdAt|updatedAt|role_id)$"
    )
    .withMessage(
      `Column names must match one of the specified options:
        "id", "name", "canManageAssessment", "canManageUser", 
        "canManageRole", "canManageNotification", "canManageLocalGroup",
        "canManageReports", "canAttemptAssessment", "canViewReport",
        "canManageMyAccount", "canViewNotification", "createdAt",
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

export const validateUserLogin = [
  check("email")
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage("Must me valid email address"),

  check("deviceType")
    .notEmpty()
    .matches("^(mobile|web)$")
    .withMessage("deviceType can only be mobile or web"),

  check("password").notEmpty().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  }).withMessage(`Password must be more than 8 characters long with
        at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`),
];

export const validateNewAccessToken = [
  check("refreshToken")
    .notEmpty()
    .isJWT()
    .withMessage("Must be a valid JWT token"),
];

export const validateUserUpdate = [
  check("id")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Last name must be more than 2 characters long"),

  check("firstName")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be more than 2 characters long"),

  check("lastName")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name must be more than 2 characters long"),

  check("email")
    .optional()
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage("Must me valid email address"),

  check("phone")
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be a valid phone number"),

  check("role_id").optional().notEmpty(),
];

export const validateUserRole = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Role name must be more than 2 characters long"),

  check("permissions.canManageAssessment")
    .isBoolean()
    .withMessage("canManageAssessment must be a boolean"),

  check("permissions.canManageUser")
    .isBoolean()
    .withMessage("canManageUser must be a boolean"),

  check("permissions.canManageRole")
    .isBoolean()
    .withMessage("canManageRole must be a boolean"),

  check("permissions.canManageNotification")
    .isBoolean()
    .withMessage("canManageNotification must be a boolean"),

  check("permissions.canManageLocalGroup")
    .isBoolean()
    .withMessage("canManageLocalGroup must be a boolean"),

  check("permissions.canManageReports")
    .isBoolean()
    .withMessage("canManageReports must be a boolean"),

  check("permissions.canAttemptAssessment")
    .isBoolean()
    .withMessage("canAttemptAssessment must be a boolean"),

  check("permissions.canViewReport")
    .isBoolean()
    .withMessage("canViewReport must be a boolean"),

  check("permissions.canManageMyAccount")
    .isBoolean()
    .withMessage("canManageMyAccount must be a boolean"),

  check("permissions.canViewNotification")
    .isBoolean()
    .withMessage("canViewNotification must be a boolean"),
];

export const validateUserRoleUpdate = [
  check("roleId")
    .not()
    .isEmpty()
    .withMessage("RoleId cannot be empty")
    .isUUID(4)
    .withMessage("RoleId should be a valid UUID v4"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Role name must be more than 2 characters long"),

  check("permissions.canManageAssessment")
    .optional()
    .isBoolean()
    .withMessage("canManageAssessment must be a boolean"),

  check("permissions.canManageRole")
    .optional()
    .isBoolean()
    .withMessage("canManageRole must be a boolean"),

  check("permissions.canManageNotification")
    .optional()
    .isBoolean()
    .withMessage("canManageNotification must be a boolean"),

  check("permissions.canManageLocalGroup")
    .optional()
    .isBoolean()
    .withMessage("canManageLocalGroup must be a boolean"),

  check("permissions.canManageReports")
    .optional()
    .isBoolean()
    .withMessage("canManageReports must be a boolean"),

  check("permissions.canAttemptAssessment")
    .optional()
    .isBoolean()
    .withMessage("canAttemptAssessment must be a boolean"),

  check("permissions.canViewReport")
    .optional()
    .isBoolean()
    .withMessage("canViewReport must be a boolean"),

  check("permissions.canManageMyAccount")
    .optional()
    .isBoolean()
    .withMessage("canManageMyAccount must be a boolean"),

  check("permissions.canViewNotification")
    .optional()
    .isBoolean()
    .withMessage("canViewNotification must be a boolean"),
];

export const validateUserRoleDelete = [
  check("roleIds.*.roleId")
    .not()
    .isEmpty()
    .withMessage("RoleId cannot be empty")
    .isUUID(4)
    .withMessage("RoleId should be a valid UUID v4"),
];

export const validateUsersImport = [
  check("users")
    .custom((value, { req }) => {
      // Checks if mime type is csv
      if (req!.file.mimetype === "text/csv") {
        return ".csv";
      } else {
        return false;
      }
    })
    .withMessage("Please only upload CSV file"),

  check("updateExisting")
    .isBoolean()
    .withMessage("updateExisting must be a boolean"),
];

export const validateUserDelete = [
  check("userIds.*")
    .not()
    .isEmpty()
    .withMessage("UserId cannot be empty")
    .isUUID(4)
    .withMessage("UserId should be a valid UUID v4"),
];

export const validateUserAddToGroup = [
  check("userIds.*")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("groupId")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should   be a valid uuid v4"),
];

export const validateRemoveUserFromGroup = [
  check("userIds.*")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),

  check("groupId")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];

export const validateGetUsersByGroup = [
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
      "^(id|role_id|first_name|last_name|email|phone|createdAt|updatedAt)$"
    )
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

  query("groupId")
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage("Should be a valid uuid v4"),
];
