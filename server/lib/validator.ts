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
  check('id')
    .optional()
    .notEmpty()
    .isUUID(4)
    .escape()
    .withMessage('User Id must be UUID v4'),

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
