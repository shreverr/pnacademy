import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";
import { validateRequest } from "../utils/validateRequest";
import { upload } from "../middleware/multer";
import { validateAssessmentCreate, validateAssessmentGet } from "../lib/validator/assessment/validator";
import { createAssessmentController, getAssessmentController } from "../controller/assessment/assessment.controller";

const router: Router = express.Router();

/**
 * @swagger
 * /v2/assessments:
 *   post:
 *     summary: Create a new assessment
 *     description: Endpoint to create a new assessment with optional image and description.
 *     tags:
 *       - Assessments
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample Assessment Name"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               startAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-26T10:00:00Z"
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T10:00:00Z"
 *               duration:
 *                 type: integer
 *                 example: 1000
 *               isPublished:
 *                 type: boolean
 *                 example: false
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional binary image file.
 *               description:
 *                 type: string
 *                 example: "Optional description for the assessment"
 *     responses:
 *       200:
 *         description: Assessment successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T16:22:15.232Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T16:22:15.233Z"
 *                     totalMarks:
 *                       type: integer
 *                       example: 0
 *                     name:
 *                       type: string
 *                       example: "Sample Assessment Name"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     startAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T10:00:00.000Z"
 *                     endAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T04:30:00.000Z"
 *                     duration:
 *                       type: integer
 *                       example: 1000
 *                     isPublished:
 *                       type: boolean
 *                       example: false
 *                     id:
 *                       type: string
 *                       example: "932c6749-7afd-47d7-a41b-b73ab467e2b7"
 *                     imageUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://pnacademy-dev.s3.ap-south-1.amazonaws.com/assessment-images/97d658ba-c6b3-403a-85ba-24d71c0f4a3c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWREDQP4HQAZEBENG%2F20241226%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20241226T162215Z&X-Amz-Expires=3600&X-Amz-Signature=1083c8ff2396b27b4b3dd18d1be156051fec140c376644db849638c1e261bbf9&X-Amz-SignedHeaders=host&x-id=GetObject"
 */
router.post(
  "/",
  authenticateUser(["canManageAssessment"]),
  upload.single("image"),
  validateAssessmentCreate,
  validateRequest,
  createAssessmentController
);

/**
 * @swagger
 * /v2/assessments:
 *   get:
 *     summary: Get list of assessments
 *     description: Retrieve a list of assessments with optional filtering, sorting, and pagination
 *     tags:
 *       - Assessments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for full-text search
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria (e.g., "name:asc,createdAt:desc")
 *         example: "createdAt:desc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: JSON string of filter criteria
 *         example: '{"isActive":true,"isPublished":true}'
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           enum: [allowedDevices]
 *         description: Additional related data to include
 *     responses:
 *       200:
 *         description: List of assessments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       isActive:
 *                         type: boolean
 *                       startAt:
 *                         type: string
 *                         format: date-time
 *                       endAt:
 *                         type: string
 *                         format: date-time
 *                       duration:
 *                         type: integer
 *                       isPublished:
 *                         type: boolean
 *                       totalMarks:
 *                         type: integer
 *                       imageUrl:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User lacks required permissions
 *       404:
 *         description: No assessments found matching the criteria
 */
router.get(
  "/",
  authenticateUser(["canManageAssessment", "canAttemptAssessment"], true),
  validateAssessmentGet,
  validateRequest,
  getAssessmentController
);

export default router;
