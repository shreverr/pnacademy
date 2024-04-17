import { check } from 'express-validator'

export const validateUserRegister = [
  check('firstName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('lastName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('email')
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage('Must me valid email address'),

  check('phone')
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be a valid phone number'),
  check('roleId')
    .optional()
    .notEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Role Id must be UUID v4'),

  check('password').notEmpty().isStrongPassword({
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
    pointsForContainingSymbol: 10
  }).withMessage(`Password must be more than 8 characters long with
      at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`)
]

export const validateUserLogin = [
  check('email')
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage('Must me valid email address'),

  check('password').notEmpty().isStrongPassword({
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
    pointsForContainingSymbol: 10
  }).withMessage(`Password must be more than 8 characters long with
      at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`)
]

export const validateUserUpdate = [
  check('id')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('dataToUpdate.firstName')
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('dataToUpdate.lastName')
    .optional()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('dataToUpdate.email')
    .optional()
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage('Must me valid email address'),

  check('dataToUpdate.phone')
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be a valid phone number'),
  check('dataToUpdate.role_id').notEmpty()
]

export const validateUserRole = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Role name must be more than 2 characters long'),

  check('permissions.canManageAssessment')
    .isBoolean()
    .withMessage('canManageAssessment must be a boolean'),

  check('permissions.canManageUser')
    .isBoolean()
    .withMessage('canManageUser must be a boolean'),

  check('permissions.canManageRole')
    .isBoolean()
    .withMessage('canManageRole must be a boolean'),

  check('permissions.canManageNotification')
    .isBoolean()
    .withMessage('canManageNotification must be a boolean'),

  check('permissions.canManageLocalGroup')
    .isBoolean()
    .withMessage('canManageLocalGroup must be a boolean'),

  check('permissions.canAttemptAssessment')
    .isBoolean()
    .withMessage('canAttemptAssessment must be a boolean'),

  check('permissions.canViewReport')
    .isBoolean()
    .withMessage('canViewReport must be a boolean'),

  check('permissions.canManageMyAccount')
    .isBoolean()
    .withMessage('canManageMyAccount must be a boolean'),

  check('permissions.canViewNotification')
    .isBoolean()
    .withMessage('canViewNotification must be a boolean')
]

export const validateAssessment = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Assessment name must be more than 2 characters long'),

  check('description')
    .optional()

    .isLength({ min: 2 })
    .escape()
    .withMessage('Assessment description must be more than 2 characters long'),

  check('is_active').isBoolean().withMessage('isActive must be a boolean'),

  check('start_at').isISO8601().withMessage('startAt must be a valid date'),

  check('end_at').isISO8601().withMessage('endAt must be a valid time'),

  check('duration')
    .isNumeric()
    .withMessage('duration must be a valid duration'),

  check('created_by')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Last name must be more than 2 characters long')
]

export const validateQuestion = [
  check('assessment_id')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('description')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Assessment description must be more than 2 characters long'),

  check('marks').isNumeric().withMessage('marks must be a valid number')
]

export const validateOption = [
  check('question_id')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('description')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Assessment description must be more than 2 characters long'),

  check('is_correct')
    .isBoolean()
    .withMessage('isCorrect must be a boolean')
]
