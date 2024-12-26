import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";
import { validateRequest } from "../utils/validateRequest";
import { upload } from "../middleware/multer";
import { CreateNotificationController } from "../controller/notification,/notification.controller";
import { validateAssessmentCreate } from "../lib/validator/assessment/validator";
import { createAssessmentController } from "../controller/assessment/assessment.controller";

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

export default router;
