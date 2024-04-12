import { check } from "express-validator";

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
]
