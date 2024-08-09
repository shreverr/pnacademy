import { check } from "express-validator";


export const validateNotification = [
    check("description")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Description must be at least 2 characters long"),
  
    check("title")
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters long"),
  
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
  
  