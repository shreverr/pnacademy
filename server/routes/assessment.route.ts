import express from "express";
import type { Router } from "express";
import {
  addGroupToAssessmentController,
  addTagController,
  attemptQuestionController,
  attemptQuestionDeleteController,
  CreateAssessmentController,
  CreateOptionController,
  CreateQuestionController,
  CreateTagController,
  DeleteAssessmentController,
  DeleteOptionController,
  DeleteQuestionController,
  deleteSectionController,
  DeleteTagController,
  generateAiQuestionsController,
  removeGroupFromAssessmentController,
  removeTagFromQuestionController,
  startAssessmentController,
  startSectionController,
  UpdateAssessmentController,
  UpdateOptionController,
  UpdateQuestionController,
  UpdateTagController,
  viewAllTagsController,
  viewAssessmentBulkController,
  viewAssessmentController,
  viewAssignedAssessmentsController,
  viewQuestionController,
  viewTagController,
} from "../controller/assessment/assessment.controller";
import {
  validateAddGroupToAssessment,
  validateAddTag,
  validateAssessment,
  validateAssessmentGetId,
  validateAssessmentId,
  validateAssessmentUpdate,
  validateGetAllTags,
  validateGetTag,
  validateOption,
  validateOptionId,
  validateOptionUpdate,
  validateQuestion,
  validateQuestionGetId,
  validateQuestionId,
  validateQuestionUpdate,
  validateRemoveGroupFromAssessment,
  validateRemoveTagFromQuestion,
  validateTag,
  validateTagId,
  validateTagUpdate,
  validateViewAssignedAssessment,
} from "../lib/validator/index";
import { validateRequest } from "../utils/validateRequest";
import { authenticateUser } from "../middleware/Auth";
import {
  validateAttemptQuestion,
  validateAttemptQuestionDelete,
  validateBulkAssessment,
  validateGenerateAssessment,
  validateSectionDelete,
  validateStartAssessment,
  validateStartSection,
} from "../lib/validator/assessment/validator";
import { start } from "repl";

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
  authenticateUser(["canManageAssessment"]),
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
 *               section:
 *                 type: number
 *                 description: The section of the question.
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
  authenticateUser(["canManageAssessment"]),
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
router.post(
  "/option",
  authenticateUser(["canManageAssessment"]),
  validateOption,
  validateRequest,
  CreateOptionController
);

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
router.post(
  "/tag",
  authenticateUser(["canManageAssessment"]),
  validateTag,
  validateRequest,
  CreateTagController
);

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
 *               duration:
 *                 type: number
 *                 description: The updated duration of the assessment in milliseconds.
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
  authenticateUser(["canManageAssessment"]),
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
  authenticateUser(["canManageAssessment"]),
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
  authenticateUser(["canManageAssessment"]),
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
router.patch(
  "/tag",
  authenticateUser(["canManageAssessment"]),
  validateTagUpdate,
  validateRequest,
  UpdateTagController
);

/**
 * @openapi
 * /v1/assessment/delete:
 *  delete:
 *    tags:
 *      - Assessment Delete Controller
 *    summary: Delete an assessment
 *    description: Endpoint to delete an assessment.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                format: uuid
 *            description: The UUID of the assessment to be deleted.
 *    responses:
 *      '200':
 *        description: Successfully deleted assessment.
 *      '400':
 *        description: Bad request. Invalid data provided.
 *      '404':
 *        description: Assessment not found.
 *      '500':
 *        description: Internal server error.
 */
router.delete(
  "/delete",
  authenticateUser(["canManageAssessment"]),
  validateAssessmentId,
  validateRequest,
  DeleteAssessmentController
);

/**
 * @openapi
 * /v1/assessment/question:
 *   delete:
 *     tags:
 *       - Assessment Delete Controller
 *     summary: Delete a question
 *     description: Endpoint to delete a question.
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
 *             description: The UUID of the question to be deleted.
 *     responses:
 *       '200':
 *         description: Successfully deleted question.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Question not found.
 *       '500':
 *         description: Internal server error.
 */

router.delete(
  "/question",
  authenticateUser(["canManageAssessment"]),
  validateQuestionId,
  validateRequest,
  DeleteQuestionController
);

/**
 * @openapi
 * /v1/assessment/option:
 *   delete:
 *     tags:
 *       - Assessment Delete Controller
 *     summary: Delete an option
 *     description: Endpoint to delete an option.
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
 *             description: The UUID of the option to be deleted.
 *     responses:
 *       '200':
 *         description: Successfully deleted option.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Option not found.
 *       '500':
 *         description: Internal server error.
 */

router.delete(
  "/option",
  authenticateUser(["canManageAssessment"]),
  validateOptionId,
  validateRequest,
  DeleteOptionController
);

/**
 * @openapi
 * /v1/assessment/tag:
 *   delete:
 *     tags:
 *       - Assessment Delete Controller
 *     summary: Delete a tag
 *     description: Endpoint to delete a tag.
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
 *             description: The UUID of the tag to be deleted.
 *     responses:
 *       '200':
 *         description: Successfully deleted tag.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Tag not found.
 *       '500':
 *         description: Internal server error.
 */

router.delete(
  "/tag",
  authenticateUser(["canManageAssessment"]),
  validateTagId,
  validateRequest,
  DeleteTagController
);

/**
 * @openapi
 * /v1/assessment/view:
 *   get:
 *     tags:
 *       - Assessment View Controller
 *     summary: View an assessment
 *     description: Endpoint to view an assessment by its ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assessment to view.
 *     responses:
 *       '200':
 *         description: Successfully viewed assessment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment:
 *                   type: object
 *                   description: The details of the assessment.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Assessment not found.
 *       '500':
 *         description: Internal server error.
 */

router.get(
  "/view",
  authenticateUser(["canManageAssessment"]),
  validateAssessmentGetId,
  validateRequest,
  viewAssessmentController
);

/**
 * @openapi
 * /v1/assessment/bulk:
 *   get:
 *     tags:
 *       - Assessment View Controller
 *     summary: Retrieve multiple assessments
 *     description: Endpoint to retrieve multiple assessments with pagination, sorting, and filtering options.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination (optional, default is 1)
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page (optional)
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [id, name, description, is_active, start_at, end_at, duration, createdAt, updatedAt]
 *         description: Field to sort the results by (optional)
 *       - name: order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (optional)
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessments:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Array of assessment objects.
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of assessments matching the query.
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *       '400':
 *         description: Bad request. Invalid parameters provided.
 *       '401':
 *         description: Unauthorized. User doesn't have the required permissions.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/bulk",
  authenticateUser(["canManageAssessment"]),
  validateBulkAssessment,
  validateRequest,
  viewAssessmentBulkController
);

/**
 * @openapi
 * /v1/assessment/question:
 *   get:
 *     tags:
 *       - Assessment View Controller
 *     summary: View a question
 *     description: Endpoint to view a question by its ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to view.
 *     responses:
 *       '200':
 *         description: Successfully viewed question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: object
 *                   description: The details of the question.
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Question not found.
 *       '500':
 *         description: Internal server error.
 */

router.get(
  "/question",
  authenticateUser(["canManageAssessment"]),
  validateQuestionGetId,
  validateRequest,
  viewQuestionController
);

/**
 * @openapi
 * /v1/assessment/tag:
 *   get:
 *     tags:
 *       - Assessment View Controller
 *     summary: View a tag
 *     description: Endpoint to view a tag by its ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to view.
 *     responses:
 *       '200':
 *         description: Successfully viewed tag.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 486cda4c-12c6-4358-90c8-2af9ef978cd1
 *                     name:
 *                       type: string
 *                       example: legs
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-04T06:35:40.335Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-04T06:35:40.335Z
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Tag not found.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/tag",
  authenticateUser(["canManageAssessment"]),
  validateGetTag,
  validateRequest,
  viewTagController
);

/**
 * @swagger
 * /v1/assessment/tags:
 *   get:
 *     summary: Get a list of tags
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, createdAt, updatedAt]
 *         required: false
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort order (ASC or DESC).
 *     responses:
 *       '200':
 *         description: Successfully retrieved tags.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the tag.
 *                             example: 6e9a8727-9c71-442a-bd2e-b912e8533176
 *                           name:
 *                             type: string
 *                             description: The name of the tag.
 *                             example: bicep
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the tag was created.
 *                             example: 2024-08-04T14:29:34.857Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the tag was last updated.
 *                             example: 2024-08-04T14:29:34.857Z
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages for pagination.
 *                       example: 1
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Tags not found.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/tags",
  authenticateUser(["canManageAssessment"]),
  validateGetAllTags,
  validateRequest,
  viewAllTagsController
);

/**
 * @swagger
 * /v1/assessment/question/addTag:
 *   post:
 *     summary: Add a tag to a question
 *     tags:
 *       - Assessment Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: The unique identifier of the question.
 *                 example: 3aa3d021-ddd8-4fd5-ae5b-a612699962bd
 *               tagId:
 *                 type: string
 *                 description: The unique identifier of the tag.
 *                 example: 2b1b5e76-0ace-41b9-bb89-b18651099308
 *     responses:
 *       '200':
 *         description: Tag successfully added to the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: success
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Question or Tag not found.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/question/addTag",
  authenticateUser(["canManageAssessment"]),
  validateAddTag,
  validateRequest,
  addTagController
);

/**
 * @swagger
 * /v1/assessment/question/remove-tag:
 *   delete:
 *     summary: Remove a tag from a question
 *     tags:
 *      - Assessment Delete Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: The ID of the question from which the tag will be removed.
 *                 example: "c3da5dd8-12aa-460d-bfeb-dd3cf62edd07"
 *               tagId:
 *                 type: string
 *                 description: The ID of the tag to be removed.
 *                 example: "5c6eab3a-2561-492a-a38b-db38c26c4037"
 *     responses:
 *       '200':
 *         description: Tag removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: A message indicating the tag was removed successfully.
 *                   example: "Tag removed successfully"
 *       '400':
 *         description: Bad Request - Invalid ID format or missing parameters
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.delete(
  "/question/remove-tag",
  authenticateUser(["canManageAssessment"]),
  validateRemoveTagFromQuestion,
  validateRequest,
  removeTagFromQuestionController
);

/**
 * @swagger
 * /v1/assessment/add-group:
 *   post:
 *     summary: Add a group to an assessment
 *     tags:
 *       - Assessment Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: 37e1b6e0-5f8d-4999-ba76-c99b5b334f26
 *               groupId:
 *                 type: string
 *                 description: The unique identifier of the group.
 *                 example: ddadf246-ab7d-44d0-a635-8686c3ac533c
 *     responses:
 *       '200':
 *         description: Group successfully added to the assessment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: success
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Assessment or Group not found.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/add-group",
  authenticateUser(["canManageAssessment", "canManageLocalGroup"]),
  validateAddGroupToAssessment,
  validateRequest,
  addGroupToAssessmentController
);

/**
 * @swagger
 * /v1/assessment/remove-group:
 *   delete:
 *     summary: Remove a group from an assessment
 *     tags:
 *      - Assessment Delete Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: 37e1b6e0-5f8d-4999-ba76-c99b5b334f26
 *               groupId:
 *                 type: string
 *                 description: The unique identifier of the group to be removed.
 *                 example: ddadf246-ab7d-44d0-a635-8686c3ac533c
 *     responses:
 *       '200':
 *         description: Group removed successfully from the assessment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Detailed message about the operation.
 *                   example: Group removed successfully
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Assessment or Group not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete(
  "/remove-group",
  authenticateUser(["canManageAssessment", "canManageLocalGroup"]),
  validateRemoveGroupFromAssessment,
  validateRequest,
  removeGroupFromAssessmentController
);

/**
 * @swagger
 * /v1/assessment/assigned:
 *   get:
 *     summary: Get assigned assessments with pagination and sorting
 *     tags:
 *       - Assessment View Controller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The number of items per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         required: true
 *         description: The field to sort the results by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         required: true
 *         description: The sort order, either ascending (ASC) or descending (DESC).
 *     responses:
 *       '200':
 *         description: Successfully retrieved the assigned assessments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     assessments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the assessment.
 *                             example: aaf2cd85-0b42-4b2d-943a-575203e57744
 *                           name:
 *                             type: string
 *                             description: The name of the assessment.
 *                             example: Project X
 *                           description:
 *                             type: string
 *                             description: A brief description of the assessment.
 *                             example: A new project
 *                           is_active:
 *                             type: boolean
 *                             description: The active status of the assessment.
 *                             example: true
 *                           start_at:
 *                             type: string
 *                             format: date-time
 *                             description: The start time of the assessment.
 *                             example: 2024-04-16T08:00:00.000Z
 *                           end_at:
 *                             type: string
 *                             format: date-time
 *                             description: The end time of the assessment.
 *                             example: 2024-04-20T17:00:00.000Z
 *                           duration:
 *                             type: integer
 *                             description: The duration of the assessment in milliseconds.
 *                             example: 345600000
 *                           created_by:
 *                             type: string
 *                             description: The unique identifier of the creator of the assessment.
 *                             example: 1a77a8e2-6b6a-48f5-9251-c3adfb8c6f24
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was created.
 *                             example: 2024-08-08T21:11:36.081Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was last updated.
 *                             example: 2024-08-08T21:11:36.081Z
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '401':
 *         description: Unauthorized. JWT token is missing or invalid.
 *       '400':
 *         description: Bad request. Invalid parameters.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/assigned",
  authenticateUser(["canAttemptAssessment"]),
  validateViewAssignedAssessment,
  validateRequest,
  viewAssignedAssessmentsController
);

router.post(
  "/generate",
  authenticateUser(["canManageAssessment"]),
  validateGenerateAssessment,
  validateRequest,
  generateAiQuestionsController
);

/**
 * @swagger
 * /v1/assessment/section:
 *   delete:
 *     summary: Delete a specific section from an assessment.
 *     tags:
 *       - Assessment Delete Controller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: 0ba767e7-79fd-4b9d-a51e-60d9487358eb
 *               section:
 *                 type: integer
 *                 description: The section number to be removed from the assessment.
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Section removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation.
 *                   example: Section removed successfully
 *       '400':
 *         description: Bad request. Invalid parameters.
 *       '401':
 *         description: Unauthorized. JWT token is missing or invalid.
 *       '404':
 *         description: Not found. The specified section or assessment does not exist.
 *       '500':
 *         description: Internal server error.
 */
router.delete(
  '/section',
  authenticateUser(["canManageAssessment"]),
  validateSectionDelete,
  validateRequest,
  deleteSectionController,
)

/**
 * @swagger
 * /v1/assessment/attempt/start:
 *   put:
 *     summary: Start an assessment attempt
 *     description: This endpoint starts an assessment attempt for the user by recording the start time.
 *     tags:
 *       - Assessment Controller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment to start.
 *                 example: 0ba767e7-79fd-4b9d-a51e-60d9487358eb
 *             required:
 *               - assessmentId
 *     responses:
 *       '200':
 *         description: Assessment successfully started.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: Assessment Started
 *       '403':
 *         description: Forbidden. The assessment has either not started yet or has already ended.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing why the request was forbidden.
 *                   example: Assessment has not started yet
 *       '404':
 *         description: Not Found. The assessment with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating that the assessment was not found.
 *                   example: Assessment with this id does not exist
 *       '409':
 *         description: Conflict. The assessment has already been started by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating the assessment has already been started.
 *                   example: Assessment already started
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: Error starting test
 */
router.put(
  '/attempt/start',
  authenticateUser(["canAttemptAssessment"]),
  validateStartAssessment,
  validateRequest,
  startAssessmentController
)

/**
 * @swagger
 * /v1/assessment/attempt/section/start:
 *   put:
 *     summary: Start a section of an assessment
 *     description: This endpoint starts a specific section of an assessment attempt by the user, providing access to the questions within that section.
 *     tags:
 *       - Assessment Controller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: f0f4a020-0751-4bfb-be1d-319a3044a9cf
 *               section:
 *                 type: integer
 *                 description: The section number of the assessment to start.
 *                 example: 3
 *             required:
 *               - assessmentId
 *               - section
 *     responses:
 *       '200':
 *         description: Section successfully started.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: Section Started
 *                 questions:
 *                   type: array
 *                   description: A list of questions in the section.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         description: The unique identifier of the question.
 *                         example: b3d5a587-be5f-44b7-a202-38af92c266c3
 *                       description:
 *                         type: string
 *                         description: The question text or description.
 *                         example: "This is a random description for the assessment question."
 *                       marks:
 *                         type: integer
 *                         description: The marks assigned to the question.
 *                         example: 91
 *                       section:
 *                         type: integer
 *                         description: The section number to which this question belongs.
 *                         example: 3
 *                       assessment_id:
 *                         type: string
 *                         format: uuid
 *                         description: The ID of the assessment to which this question belongs.
 *                         example: f0f4a020-0751-4bfb-be1d-319a3044a9cf
 *                       options:
 *                         type: array
 *                         description: The list of options for the question.
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               description: The unique identifier of the option.
 *                               example: 662b8629-b91b-4fd6-8069-54a3dd7fdcee
 *                             description:
 *                               type: string
 *                               description: The description or text of the option.
 *                               example: "This is a randomly generated description for an option."
 *                             question_id:
 *                               type: string
 *                               format: uuid
 *                               description: The ID of the question to which this option belongs.
 *                               example: b3d5a587-be5f-44b7-a202-38af92c266c3
 *       '403':
 *         description: Forbidden. The assessment has either not started yet, has already ended, or the section has already been submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing why the request was forbidden.
 *                   example: Assessment has not started yet
 *       '404':
 *         description: Not Found. The assessment or user with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating that the assessment or user was not found.
 *                   example: Assessment with this id does not exist
 *       '409':
 *         description: Conflict. The section has already been submitted or the section is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating the section has already been submitted.
 *                   example: Section already submitted
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: Error starting test
 */
router.put(
  '/attempt/section/start',
  authenticateUser(["canAttemptAssessment"]),
  validateStartSection,
  validateRequest,
  startSectionController
)

/**
 * @swagger
 * /v1/assessment/attempt/question:
 *   post:
 *     summary: Attempt a question in an assessment
 *     description: This endpoint allows a user to attempt a specific question in an assessment by selecting an option.
 *     tags:
 *       - Assessment Controller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: f0f4a020-0751-4bfb-be1d-319a3044a9cf
 *               questionId:
 *                 type: string
 *                 description: The unique identifier of the question to attempt.
 *                 example: b3d5a587-be5f-44b7-a202-38af92c266c3
 *               selectedOptionId:
 *                 type: string
 *                 description: The unique identifier of the selected option.
 *                 example: 662b8629-b91b-4fd6-8069-54a3dd7fdcee
 *             required:
 *               - assessmentId
 *               - questionId
 *               - selectedOptionId
 *     responses:
 *       '200':
 *         description: Question attempted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message indicating the question was successfully attempted.
 *                   example: Question attempted
 *       '403':
 *         description: Forbidden. The assessment has either not started yet or has already ended.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing why the request was forbidden.
 *                   example: Assessment has not started yet
 *       '404':
 *         description: Not Found. The question or assessment with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating that the assessment or question was not found.
 *                   example: Question or Assessment with this id does not exist
 *       '409':
 *         description: Conflict. The question has already been attempted by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating the question has already been attempted.
 *                   example: Question already attempted
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: Error attempting question
 */
router.post(
  '/attempt/question',
  authenticateUser(["canAttemptAssessment"]),
  validateAttemptQuestion,
  validateRequest,
  attemptQuestionController
)

/**
 * @swagger
 * /v1/assessment/attempt/question:
 *   delete:
 *     summary: Delete an attempted question
 *     description: This endpoint deletes an attempted question from an ongoing assessment attempt.
 *     tags:
 *       - Assessment Delete Controller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The unique identifier of the assessment.
 *                 example: f0f4a020-0751-4bfb-be1d-319a3044a9cf
 *               questionId:
 *                 type: string
 *                 description: The unique identifier of the question to delete.
 *                 example: b3d5a587-be5f-44b7-a202-38af92c266c3
 *               selectedOptionId:
 *                 type: string
 *                 description: The unique identifier of the selected option that was attempted.
 *                 example: 662b8629-b91b-4fd6-8069-54a3dd7fdcee
 *             required:
 *               - assessmentId
 *               - questionId
 *               - selectedOptionId
 *     responses:
 *       '200':
 *         description: Question successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation.
 *                   example: Question deleted
 *       '403':
 *         description: Forbidden. The user is not allowed to delete the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing why the request was forbidden.
 *                   example: Not authorized to delete this question
 *       '404':
 *         description: Not Found. The question or assessment with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message indicating that the question or assessment was not found.
 *                   example: Question or assessment with this ID does not exist
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the error.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: Error deleting question
 */
router.delete(
  '/attempt/question',
  authenticateUser(["canAttemptAssessment"]),
  validateAttemptQuestionDelete,
  validateRequest,
  attemptQuestionDeleteController
)

export default router;
