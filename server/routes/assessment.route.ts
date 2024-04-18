import express from "express";
import type { Router } from "express";
import {
  CreateAssessmentController,
  CreateOptionController,
  CreateQuestionController,
  CreateTagController,
  UpdateAssessmentController,
  UpdateOptionController,
  UpdateQuestionController,
  UpdateTagController,
} from "../controller/assessment/assessment.controller";
import {
  validateAssessment,
  validateAssessmentUpdate,
  validateOption,
  validateOptionUpdate,
  validateQuestion,
  validateQuestionUpdate,
  validateTag,
  validateTagUpdate,
} from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";

const router: Router = express.Router();

/**
 * @openapi
 * /v1/assessment/create:
 *   post:
 *     tags:
 *       - Assessment Controller
 *     summary: Create a new assessment
 *     description: Endpoint to create a new assessment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the assessment.
 *               description:
 *                 type: string
 *                 description: The description of the assessment.
 *               is_active:
 *                 type: boolean
 *                 description: Indicates if the assessment is active.
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the assessment.
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 description: The end date and time of the assessment.
 *               duration:
 *                 type: number
 *                 description: The duration of the assessment in milliseconds.
 *               created_by:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the user who created the assessment.
 *     responses:
 *       '200':
 *         description: Successfully created assessment.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/create",
  validateAssessment,
  validateRequest,
  CreateAssessmentController
);

/**
 * @openapi
 * /v1/assessment/question:
 *   post:
 *     tags:
 *       - Assessment Controller
 *     summary: Create a new question
 *     description: Endpoint to create a new question for an assessment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessment_id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the assessment the question belongs to.
 *               description:
 *                 type: string
 *                 description: The description of the question.
 *               marks:
 *                 type: number
 *                 description: The marks allocated for the question.
 *     responses:
 *       '200':
 *         description: Successfully created question.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/question",
  validateQuestion,
  validateRequest,
  CreateQuestionController
);

/**
 * @openapi
 * /v1/assessment/option:
 *   post:
 *     tags:
 *       - Assessment Controller
 *     summary: Create a new option
 *     description: Endpoint to create a new option for a question.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the question the option belongs to.
 *               description:
 *                 type: string
 *                 description: The description of the option.
 *               is_correct:
 *                 type: boolean
 *                 description: Indicates if the option is correct.
 *     responses:
 *       '200':
 *         description: Successfully created option.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 */
router.post("/option", validateOption, validateRequest, CreateOptionController);

/**
 * @openapi
 * /v1/assessment/tag:
 *   post:
 *     tags:
 *       - Assessment Controller
 *     summary: Create a new tag
 *     description: Endpoint to create a new tag.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tag.
 *     responses:
 *       '200':
 *         description: Successfully created tag.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 */
router.post("/tag", validateTag, validateRequest, CreateTagController);

/**
 * @openapi
 * /v1/assessment/update:
 *   patch:
 *     tags:
 *       - Assessment Update Controller
 *     summary: Update an existing assessment
 *     description: Endpoint to update an existing assessment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the assessment to be updated.
 *               name:
 *                 type: string
 *                 description: The updated name of the assessment.
 *               description:
 *                 type: string
 *                 description: The updated description of the assessment.
 *               is_active:
 *                 type: boolean
 *                 description: Indicates if the assessment is active.
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 description: The updated start date and time of the assessment.
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 description: The updated end date and time of the assessment.
 *     responses:
 *       '200':
 *         description: Successfully updated assessment.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Assessment not found.
 *       '500':
 *         description: Internal server error.
 */
router.patch(
  "/update",
  validateAssessmentUpdate,
  validateRequest,
  UpdateAssessmentController
);
/**
 * @openapi
 * /v1/assessment/question:
 *   patch:
 *     tags:
 *       - Assessment Update Controller
 *     summary: Update an existing question
 *     description: Endpoint to update an existing question.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the question to be updated.
 *               description:
 *                 type: string
 *                 description: The updated description of the question.
 *               marks:
 *                 type: number
 *                 description: The updated marks allocated for the question.
 *     responses:
 *       '200':
 *         description: Successfully updated question.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Question not found.
 *       '500':
 *         description: Internal server error.
 */
router.patch(
  "/question",
  validateQuestionUpdate,
  validateRequest,
  UpdateQuestionController
);

/**
 * @openapi
 * /v1/assessment/option:
 *   patch:
 *     tags:
 *       - Assessment Update Controller
 *     summary: Update an existing option
 *     description: Endpoint to update an existing option.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the option to be updated.
 *               description:
 *                 type: string
 *                 description: The updated description of the option.
 *               is_correct:
 *                 type: boolean
 *                 description: Indicates if the option is correct.
 *     responses:
 *       '200':
 *         description: Successfully updated option.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Option not found.
 *       '500':
 *         description: Internal server error.
 */

router.patch(
  "/option",
  validateOptionUpdate,
  validateRequest,
  UpdateOptionController
);

/**
 * @openapi
 * /v1/assessment/tag:
 *   patch:
 *     tags:
 *       - Assessment Update Controller
 *     summary: Update an existing tag
 *     description: Endpoint to update an existing tag.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the tag to be updated.
 *     responses:
 *       '200':
 *         description: Successfully updated tag.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Tag not found.
 *       '500':
 *         description: Internal server error.
 */

router.patch("/tag", validateTagUpdate, validateRequest, UpdateTagController);

export default router;
