import { check } from 'express-validator'

export const validateMarkAttendance = [
  check('userId')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Employee Id must be UUID v4'),

  check('status')
    .not()
    .isEmpty()
    .isIn(['present', 'absent'])
    .withMessage('Status must be either present or absent')
]

export const validateCheckInAttendance = [
  check('userId')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Employee Id must be UUID v4')
]

export const validateCheckOutAttendance = [
  check('userId')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Employee Id must be UUID v4')
]

export const validateSearchAttendance = [
  check('userId')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Employee Id must be UUID v4'),

  check('startDate')
    .not()
    .isEmpty()
    .isDate()
    .escape()
    .withMessage('Must be a valid date yyyy/mm/dd'),

  check('endDate')
    .not()
    .isEmpty()
    .isDate()
    .escape()
    .withMessage('Must be a valid date yyyy/mm/dd'),
]

export const validateRegisterUser = [

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
    .not()
    .isEmpty()
    .isEmail()
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('password')
    .notEmpty()
    .isStrongPassword({
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
    })
    .withMessage(`Password must be more than 8 characters long with
      at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`),

  check('dateOfBirth')
    .optional()
    .notEmpty()
    .isDate()
    .escape()
    .withMessage('Date of birth must be a valid date yyyy-mm-dd'),

  check('gender')
    .optional()
    .notEmpty()
    .isIn(['male', 'female', 'transgender'])
    .withMessage('Gender must be either male, female or transgender'),

  check('phoneNumber')
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be a valid phone number'),

  check('address')
    .optional()
    .notEmpty()
    .escape(),

  check('jobTitle')
    .optional()
    .notEmpty()
    .escape(),

  check('department')
    .optional()
    .notEmpty()
    .escape(),

  check('hireDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Hire date must be a valid date yyyy-mm-dd'),

  check('joiningDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Joining date must be a valid date yyyy-mm-dd'),

  check('isAdmin')
    .optional()
    .notEmpty()
    .not()
    .isEmpty()
    .isBoolean()
    .withMessage('isAdmin must be a boolean'),

  check('role')
    .optional()
    .notEmpty()
    .escape()
]

export const validateUpdateUserInfo = [
  check('userId')
    .not()
    .isEmpty()
    .isUUID(4)
    .escape()
    .withMessage('Employee Id must be UUID v4'),

  check('firstName')
    .optional()
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('lastName')
    .optional()
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('email')
    .optional()
    .not()
    .isEmpty()
    .isEmail()
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('password')
    .optional()
    .notEmpty()
    .isStrongPassword({
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
    })
    .withMessage(`Password must be more than 8 characters long with
      at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`),

  check('dateOfBirth')
    .optional()
    .notEmpty()
    .isDate()
    .escape()
    .withMessage('Date of birth must be a valid date yyyy-mm-dd'),

  check('gender')
    .optional()
    .notEmpty()
    .isIn(['male', 'female', 'transgender'])
    .withMessage('Gender must be either male, female or transgender'),

  check('phoneNumber')
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be a valid phone number'),

  check('address')
    .optional()
    .notEmpty()
    .escape(),

  check('jobTitle')
    .optional()
    .notEmpty()
    .escape(),

  check('department')
    .optional()
    .notEmpty()
    .escape(),

  check('hireDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Hire date must be a valid date yyyy-mm-dd'),

  check('joiningDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Joining date must be a valid date yyyy-mm-dd'),

  check('isAdmin')
    .optional()
    .notEmpty()
    .not()
    .isEmpty()
    .isBoolean()
    .withMessage('isAdmin must be a boolean'),

  check('role')
    .optional()
    .notEmpty()
    .escape()
]

export const validateFindOneUser = [
  check('userId')
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Employee Id must be more than 10 characters long')
]

export const validatefindAllUsers = [
  check('userId')
    .optional()
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Employee Id must be more than 10 characters long'),

  check('firstName')
    .optional()
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('lastName')
    .optional()
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Last name must be more than 2 characters long'),

  check('email')
    .optional()
    .not()
    .isEmpty()
    .isEmail()
    .escape()
    .withMessage('First name must be more than 2 characters long'),

  check('password')
    .optional()
    .notEmpty()
    .isStrongPassword({
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
    })
    .withMessage(`Password must be more than 8 characters long with
      at least 1 lowercase, 1 uppercase, 1 number and 1 symbol`),

  check('dateOfBirth')
    .optional()
    .notEmpty()
    .isDate()
    .escape()
    .withMessage('Date of birth must be a valid date yyyy-mm-dd'),

  check('gender')
    .optional()
    .notEmpty()
    .isIn(['male', 'female', 'transgender'])
    .withMessage('Gender must be either male, female or transgender'),

  check('phoneNumber')
    .optional()
    .notEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be a valid phone number'),

  check('address')
    .optional()
    .notEmpty()
    .escape(),

  check('jobTitle')
    .optional()
    .notEmpty()
    .escape(),

  check('department')
    .optional()
    .notEmpty()
    .escape(),

  check('hireDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Hire date must be a valid date yyyy-mm-dd'),

  check('joiningDate')
    .optional()
    .notEmpty()
    .isDate()
    .withMessage('Joining date must be a valid date yyyy-mm-dd'),

  check('isAdmin')
    .optional()
    .notEmpty()
    .not()
    .isEmpty()
    .isBoolean()
    .withMessage('isAdmin must be a boolean'),

  check('role')
    .optional()
    .notEmpty()
    .escape()
]

export const validateDeleteUser = [
  check('userId')
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Employee Id must be more than 10 characters long')
]

export const validateCreateRole = [
  check('roleName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Role name must be more than 2 characters long')
]

export const validateUpdateRole = [
  check('roleId')
    .not()
    .isEmpty()
    .isUUID(4)
    .withMessage('Employee Id must be UUID v4'),

  check('roleName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Role name must be more than 2 characters long')
]

export const validateDeleteRole = [
  check('roleId')
    .not()
    .isEmpty()
    .isUUID(4)
    .withMessage('Employee Id must be UUID v4'),
]

export const validateCreateDepartment = [
  check('departmentName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Role name must be more than 2 characters long')
]

export const validateUpdateDepartment = [
  check('departmentId')
    .not()
    .isEmpty()
    .isUUID(4)
    .withMessage('Employee Id must be UUID v4'),

  check('departmentName')
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Role name must be more than 2 characters long')
]

export const validateDeleteDepartment = [
  check('departmentId')
    .not()
    .isEmpty()
    .isUUID(4)
    .withMessage('Employee Id must be UUID v4'),
]

export const validateCreateHoliday = [
  check('holidayDate')
    .notEmpty()
    .isDate()
    .withMessage('Holiday date must be a valid date yyyy-mm-dd'),

  check('holidayName')
    .notEmpty()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Holiday name must be more than 2 characters long')
]