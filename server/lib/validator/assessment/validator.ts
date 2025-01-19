import { check, param, query, ValidationChain } from "express-validator";
import { AssessmentAttributes } from "../../../schema/assessment/assessment.schema";

type ValidTypes = "string" | "boolean" | "number" | "date" | "any" | "uuid";
type TypeMap<T> = Record<keyof T, ValidTypes>;
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateSort = (schema: Object) => {
  return query("sort")
    .optional()
    .custom((value) => {
      if (typeof value !== "string") {
        throw new Error("Sort must be a string");
      }

      const sortPairs = value.split(",");
      for (const pair of sortPairs) {
        const [attribute, order] = pair.split(":");

        // Check if the attribute is allowed
        if (!Object.keys(schema).includes(attribute)) {
          throw new Error(
            `Invalid attribute: ${attribute}.Format: <attribute1>:<order1>, <attribute2>:<order2>,... .Allowed attributes are: ${Object.keys(
              schema
            ).join(", ")}`
          );
        }

        // Check if the order is valid
        if (order !== "asc" && order !== "desc") {
          throw new Error(
            `Invalid order: ${order}.Format: <attribute1>:<order1>, <attribute2>:<order2>,... . Order must be either "asc" or "desc"`
          );
        }
      }

      return true;
    });
};

export const validateFilters = <T extends Record<string, unknown>>(
  schema: Object
) => {
  return query("filters")
    .optional()
    .custom((filters: string) => {
      let parsedFilters: Record<string, unknown>;
      try {
        parsedFilters = JSON.parse(filters);
      } catch {
        return false;
      }

      const typeMap = schema as TypeMap<T>;
      for (const key in parsedFilters) {
        if (!Object.prototype.hasOwnProperty.call(typeMap, key)) {
          return false;
        }

        const value = parsedFilters[key];
        const expectedType = typeMap[key as keyof T];

        switch (expectedType) {
          case "string":
            if (typeof value !== "string") return false;
            break;
          case "boolean":
            if (typeof value !== "boolean") return false;
            break;
          case "number":
            if (typeof value !== "number") return false;
            break;
          case "date":
            if (typeof value !== "string" || isNaN(Date.parse(value)))
              return false;
            break;
          case "uuid":
            return typeof value === "string" && UUID_V4_REGEX.test(value);
          case "any":
            break;
          default:
            return false;
        }
      }

      return true;
    })
    .withMessage((value) => {
      if (!value) {
        return "filters parameter is required";
      }

      try {
        const parsedFilters = JSON.parse(value);
        const typeMap = schema as TypeMap<T>;

        for (const key in parsedFilters) {
          if (!Object.prototype.hasOwnProperty.call(typeMap, key)) {
            return `Invalid filter key: '${key}' is not a valid attribute`;
          }

          const filterValue = parsedFilters[key];
          const expectedType = typeMap[key as keyof T];

          switch (expectedType) {
            case "string":
              if (typeof filterValue !== "string") {
                return `Invalid type for '${key}': expected string`;
              }
              break;
            case "boolean":
              if (typeof filterValue !== "boolean") {
                return `Invalid type for '${key}': expected boolean`;
              }
              break;
            case "number":
              if (typeof filterValue !== "number") {
                return `Invalid type for '${key}': expected number`;
              }
              break;
            case "date":
              if (
                typeof filterValue !== "string" ||
                isNaN(Date.parse(filterValue))
              ) {
                return `Invalid type for '${key}': expected a valid ISO date string`;
              }
              break;
            case "uuid":
              return `Invalid type for '${key}': expected a valid UUIDv4`;
            case "any":
              break;
            default:
              return `Unsupported type for '${key}'`;
          }
        }
      } catch {
        return "filters must be a valid JSON object";
      }

      return "Invalid filters";
    });
};

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
        "image/svg+xml",
      ];
      if (allowedTypes.includes(req!.file.mimetype)) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage(
      "Please upload a valid image (PNG, JPEG, JPG, GIF, WebP or SVG)"
    ),

  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage("Assessment name must be 2 - 255 characters long"),

  check("description")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Assessment description must be more than 1 characters long"),

  check("isActive").isBoolean().withMessage("isActive must be a boolean"),

  check("startAt").isISO8601().withMessage("startAt must be a valid date"),

  check("endAt").isISO8601().withMessage("endAt must be a valid time"),

  check("duration")
    .isNumeric()
    .withMessage("duration must be a valid duration"),

  check("isPublished").isBoolean().withMessage("isPublished must be a boolean"),
];

export const validateAssessmentGet = [
  query("search").optional().isString().trim().escape(),

  validateSort({
    id: "uuid",
    name: "string",
    description: "string",
    isActive: "boolean",
    startAt: "date",
    endAt: "date",
    duration: "number",
    isPublished: "boolean",
    totalMarks: "number",
    createdAt: "date",
    updatedAt: "date",
  }),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  validateFilters<AssessmentAttributes & Record<string, unknown>>({
    id: "uuid",
    name: "string",
    description: "string",
    isActive: "boolean",
    startAt: "date",
    endAt: "date",
    duration: "number",
    isPublished: "boolean",
    totalMarks: "number",
    createdAt: "date",
    updatedAt: "date",
  }),

  query("include")
    .optional()
    .not()
    .isEmpty()
    .isIn(["allowedDevices"])
    .withMessage("Adds additional information. Supported: allowedDevices"),
];

export const validateAssessmentUpdate = [
  param("id")
    .isUUID()
    .withMessage("Assessment ID must be a valid UUIDv4"),

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
        "image/svg+xml",
      ];
      if (allowedTypes.includes(req!.file.mimetype)) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage(
      "Please upload a valid image (PNG, JPEG, JPG, GIF, WebP or SVG)"
    ),

  check("name")
    .optional()

    .not()
    .isEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage("Assessment name must be 2 - 255 characters long"),

  check("description")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Assessment description must be more than 1 characters long"),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  check("startAt")
    .optional()
    .isISO8601()
    .withMessage("startAt must be a valid date"),

  check("endAt")
    .optional()
    .isISO8601()
    .withMessage("endAt must be a valid time"),

  check("duration")
    .optional()
    .isNumeric()
    .withMessage("duration must be a valid duration"),

  check("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
];

export const validateAssessmentDelete = [
  param("id")
    .isUUID()
    .withMessage("Assessment ID must be a valid UUIDv4"),
];
