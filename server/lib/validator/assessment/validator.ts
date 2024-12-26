import { check } from "express-validator";

export const validateAssessmentCreate = [
  check("image")
    .optional()
    .custom((value, { req }) => {
      // Checks if mime type is an allowed image format
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
        "image/svg+xml"
      ];
      if (allowedTypes.includes(req!.file.mimetype)) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload a valid image (PNG, JPEG, JPG, GIF, WebP or SVG)"),

  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage("Assessment name must be 2 - 255 characters long"),


  check("description")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Assessment description must be more than 1 characters long"),

  check("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  check("startAt")
    .isISO8601()
    .withMessage("startAt must be a valid date"),

  check("endAt")
    .isISO8601()
    .withMessage("endAt must be a valid time"),

  check("duration")
    .isNumeric()
    .withMessage("duration must be a valid duration"),

  check("isPublished")
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
];