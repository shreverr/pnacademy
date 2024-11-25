import express from "express";
import type { Router } from "express";
import {
  addGroupToAssessmentController,
  addTagController,
  attemptQuestionController,
  attemptQuestionDeleteController,
  computeResultsController,
  CreateAssessmentController,
  CreateOptionController,
  CreateQuestionController,
  CreateTagController,
  DeleteAssessmentController,
  DeleteOptionController,
  DeleteQuestionController,
  deleteSectionController,
  DeleteTagController,
  endAssessmentController,
  endSectionController,
  exportAssessmentController,
  generateAiQuestionsController,
  getAllAssessmentResultController,
  getAllAssessmentsGroupsListController,
  getAssessmentAnalytics,
  getAssessmentAnalyticsChart,
  getAssessmentSectionsController,
  getAssessmentTimeController,
  getAssessmentTotalController,
  getDraftAssessmentCountController,
  getGroupAssessmentAnalyticsController,
  getGroupAssessmentResultsController,
  getMyAssessmentResponsesController,
  getOngoingAssessmentController,
  getPastAssessmentController,
  getQuestionExplanationController,
  getResultController,
  getScheduledAssessmentController,
  getUserAssessmentResponsesController,
  getUserAssessmentsResultListController,
  publishResultController,
  removeGroupFromAssessmentController,
  removeTagFromQuestionController,
  saveGeneratedAiQuestionsController,
  searchAssesmentsController,
  searchAssignedAssesmentsController,
  startAssessmentController,
  startSectionController,
  totalAssessmentMarksController,
  UpdateAssessmentController,
  UpdateOptionController,
  UpdateQuestionController,
  UpdateTagController,
  viewAllAssignedGroupsController,
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
  validateAssesmentsSearch,
  validateAssessmentExport,
  validateAttemptQuestion,
  validateAttemptQuestionDelete,
  validateBulkAssessment,
  validateComputeResults,
  validateEndAssessment,
  validateEndSection,
  validateGenerateAssessment,
  validateGenerateAssessmentSave,
  validateGetAssessmentAnalytics,
  validateGetAssessmentAnalyticsChart,
  validateGetAssessmentsGroupsList,
  validateGetAssessmentsResultList,
  validateGetGroupAssessmentAnalytics,
  validateGetGroupAssessmentResults,
  validateGetMyAssessmentResponses,
  validateGetMyAssessmentsResultList,
  validateGetQuestionExplanation,
  validateGetResult,
  validateGetUserAssessmentResponses,
  validatePublishResult,
  validateSectionDelete,
  validateStartAssessment,
  validateStartSection,
} from "../lib/validator/assessment/validator";
import { validate } from "uuid";
import { authenticateInternalService } from "../middleware/internalAuth";
import { get } from "http";

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
 * /totalmarks:
 *   get:
 *     tags:
 *       - Assessment View Controller
 *     summary: Get total marks for an assessment
 *     description: Retrieves the total marks for a specific assessment. Requires authentication and appropriate permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the assessment
 *     responses:
 *       '200':
 *         description: Successfully retrieved total marks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMarks:
 *                   type: number
 *                   description: The total marks for the assessment
 *       '400':
 *         description: Bad request. Invalid assessment ID provided.
 *       '401':
 *         description: Unauthorized. User lacks required permissions.
 *       '404':
 *         description: Assessment not found.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/totalmarks",
  authenticateUser(["canManageAssessment"]),
  validateAssessmentId,
  validateRequest,
  totalAssessmentMarksController
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
 *                 message:
 *                   type: string
 *                   example: Assessment fetched successfully
 *                   description: Response message.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the assessment.
 *                     name:
 *                       type: string
 *                       description: The name of the assessment.
 *                     description:
 *                       type: string
 *                       description: The description of the assessment.
 *                     is_active:
 *                       type: boolean
 *                       description: Whether the assessment is active.
 *                     start_at:
 *                       type: string
 *                       format: date-time
 *                       description: The start date and time of the assessment.
 *                     end_at:
 *                       type: string
 *                       format: date-time
 *                       description: The end date and time of the assessment.
 *                     duration:
 *                       type: integer
 *                       description: The duration of the assessment in milliseconds.
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the assessment.
 *                     sections:
 *                       type: array
 *                       description: An array containing the sections of the assessment.
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: The unique identifier for the question.
 *                             assessment_id:
 *                               type: string
 *                               description: The unique identifier for the assessment.
 *                             description:
 *                               type: string
 *                               description: The description of the question.
 *                             marks:
 *                               type: integer
 *                               description: The marks assigned to the question.
 *                             section:
 *                               type: integer
 *                               description: The section number this question belongs to.
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: The creation timestamp of the question.
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               description: The last update timestamp of the question.
 *                             options:
 *                               type: array
 *                               description: An array of options for the question.
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     description: The unique identifier for the option.
 *                                   question_id:
 *                                     type: string
 *                                     description: The unique identifier for the question the option belongs to.
 *                                   description:
 *                                     type: string
 *                                     description: The description of the option.
 *                                   is_correct:
 *                                     type: boolean
 *                                     description: Whether the option is correct.
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
 * /v1/assessment/group:
 *   get:
 *     summary: Get all assigned groups for an assessment
 *     tags:
 *       - Assessment View Controller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the assessment
 *     responses:
 *       '200':
 *         description: Successfully retrieved assigned groups
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
 *                         description: The UUID of the assigned group
 *                       name:
 *                          type: string
 *                          description: The name of the assigned group
 *       '400':
 *         description: Bad Request - Invalid UUID format
 *       '401':
 *         description: Unauthorized - User doesn't have the required permissions
 *       '404':
 *         description: Not Found - No assigned groups found for the given assessment
 *       '500':
 *         description: Internal Server Error
 */
router.get(
  "/group",
  authenticateUser(["canManageAssessment"]),
  validateAssessmentGetId,
  validateRequest,
  viewAllAssignedGroupsController
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
 *                             example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *                           name:
 *                             type: string
 *                             description: The name of the assessment.
 *                             example: PNA Testes
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
 *                             example: 2024-01-28T01:10:00.000Z
 *                           duration:
 *                             type: integer
 *                             description: The duration of the assessment in milliseconds.
 *                             example: 345600000
 *                           isSubmitted:
 *                             type: boolean
 *                             description: Indicates if the assessment has been submitted.
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was created.
 *                             example: 2024-09-06T21:54:43.310Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was last updated.
 *                             example: 2024-10-07T13:34:51.542Z
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

/**
 * @swagger
 * /v1/assessment/generate:
 *   post:
 *     summary: Generate AI questions for an assessment
 *     tags:
 *       - Assessment Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - numberOfQuestions
 *               - difficulty
 *             properties:
 *               topic:
 *                 type: string
 *                 minLength: 2
 *                 description: The topic for which questions should be generated
 *                 example: "Bihar"
 *               numberOfQuestions:
 *                 type: integer
 *                 minimum: 1
 *                 description: The number of questions to generate
 *                 example: 10
 *               difficulty:
 *                 type: string
 *                 minLength: 2
 *                 description: The difficulty level of the questions
 *                 example: "medium"
 *     responses:
 *       '200':
 *         description: Successfully generated AI questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Questions generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                             example: "What is the capital of Bihar?"
 *                           options:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 description:
 *                                   type: string
 *                                   example: "Patna"
 *                                 isCorrect:
 *                                   type: boolean
 *                                   example: true
 *       '400':
 *         description: Bad request. Invalid input parameters.
 *       '401':
 *         description: Unauthorized. JWT token is missing or invalid.
 *       '403':
 *         description: Forbidden. User does not have the required permissions.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/generate",
  authenticateUser(["canManageAssessment"]),
  validateGenerateAssessment,
  validateRequest,
  generateAiQuestionsController
);

/**
 * @swagger
 * /v1/assessment/generate/save:
 *   post:
 *     summary: Save a generated assessment
 *     tags:
 *       - Assessment Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - is_active
 *               - start_at
 *               - end_at
 *               - duration
 *               - questions
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the assessment
 *                 example: "Sample Assessment"
 *               description:
 *                 type: string
 *                 description: A brief description of the assessment
 *                 example: "An example assessment for testing"
 *               is_active:
 *                 type: boolean
 *                 description: Whether the assessment is active or not
 *                 example: true
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the assessment
 *                 example: "2024-05-01T08:00:00Z"
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 description: The end date and time of the assessment
 *                 example: "2024-05-01T10:00:00Z"
 *               duration:
 *                 type: integer
 *                 description: The duration of the assessment in milliseconds
 *                 example: 7200000
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - description
 *                     - marks
 *                     - section
 *                     - options
 *                   properties:
 *                     description:
 *                       type: string
 *                       description: The question text
 *                       example: "What is the capital of France?"
 *                     marks:
 *                       type: integer
 *                       description: Marks assigned to this question
 *                       example: 10
 *                     section:
 *                       type: integer
 *                       description: The section number of the question
 *                       example: 1
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - description
 *                           - isCorrect
 *                         properties:
 *                           description:
 *                             type: string
 *                             description: The option text
 *                             example: "Paris"
 *                           isCorrect:
 *                             type: boolean
 *                             description: Whether this option is correct or not
 *                             example: true
 *     responses:
 *       '200':
 *         description: Successfully saved the assessment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assessment saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *       '400':
 *         description: Bad request. Invalid input parameters.
 *       '401':
 *         description: Unauthorized. JWT token is missing or invalid.
 *       '403':
 *         description: Forbidden. User does not have the required permissions.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/generate/save",
  authenticateUser(["canManageAssessment"]),
  validateGenerateAssessmentSave,
  validateRequest,
  saveGeneratedAiQuestionsController
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
  "/section",
  authenticateUser(["canManageAssessment"]),
  validateSectionDelete,
  validateRequest,
  deleteSectionController
);

/**
 * @swagger
 * /v1/assessment/attempt/start:
 *   put:
 *     summary: Start an assessment attempt
 *     description: This endpoint starts an assessment attempt for the user by recording the start time and returns the status of each section.
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
 *                 sections:
 *                   type: array
 *                   description: An array of section statuses.
 *                   items:
 *                     type: object
 *                     properties:
 *                       section:
 *                         type: integer
 *                         description: The section number.
 *                         example: 1
 *                       status:
 *                         type: string
 *                         description: The status of the section.
 *                         enum: [submitted, started, not-started]
 *                         example: submitted
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
  "/attempt/start",
  authenticateUser(["canAttemptAssessment"]),
  validateStartAssessment,
  validateRequest,
  startAssessmentController
);

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
 *                       selectedOptionId:
 *                         type: string
 *                         format: uuid | null
 *                         description: The ID of the previously selected option by user. null if not selected.
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
  "/attempt/section/start",
  authenticateUser(["canAttemptAssessment"]),
  validateStartSection,
  validateRequest,
  startSectionController
);

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
  "/attempt/question",
  authenticateUser(["canAttemptAssessment"]),
  validateAttemptQuestion,
  validateRequest,
  attemptQuestionController
);

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
  "/attempt/question",
  authenticateUser(["canAttemptAssessment"]),
  validateAttemptQuestionDelete,
  validateRequest,
  attemptQuestionDeleteController
);

/**
 * @swagger
 * /v1/assessment/attempt/section/end:
 *   put:
 *     summary: End a section in an assessment attempt
 *     description: This endpoint ends a section within an ongoing assessment attempt for the user. The section must be started before it can be ended.
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
 *                 type: number
 *                 description: The section number to end.
 *                 example: 1
 *             required:
 *               - assessmentId
 *               - section
 *     responses:
 *       '200':
 *         description: Section successfully ended.
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
 *                   example: Section ended successfully
 *       '400':
 *         description: Bad Request. The section could not be ended due to invalid input.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid section number or assessment ID
 *       '403':
 *         description: Forbidden. The user is not allowed to end the section.
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
 *                   example: Not authorized to end this section
 *       '404':
 *         description: Not Found. The section or assessment with the specified ID does not exist.
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
 *                   description: A message indicating that the section or assessment was not found.
 *                   example: Section or assessment with this ID does not exist
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
 *                   example: Error ending section
 */
router.put(
  "/attempt/section/end",
  authenticateUser(["canAttemptAssessment"]),
  validateEndSection,
  validateRequest,
  endSectionController
);

/**
 * @swagger
 * /v1/assessment/attempt/end:
 *   put:
 *     summary: End an assessment attempt
 *     description: This endpoint ends an ongoing assessment attempt for the user. All sections must be completed before the assessment can be ended.
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
 *                 description: The unique identifier of the assessment to end.
 *                 example: f0f4a020-0751-4bfb-be1d-319a3044a9cf
 *             required:
 *               - assessmentId
 *     responses:
 *       '200':
 *         description: Assessment successfully ended.
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
 *                   example: Assessment ended successfully
 *       '400':
 *         description: Bad Request. The assessment could not be ended due to invalid input or unfinished sections.
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
 *                   description: A message describing the error in the request.
 *                   example: All sections must be completed before ending the assessment
 *       '403':
 *         description: Forbidden. The user is not authorized to end the assessment.
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
 *                   example: Not authorized to end this assessment
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
 *                   example: Assessment with this ID does not exist
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
 *                   example: Error ending assessment
 */
router.put(
  "/attempt/end",
  authenticateUser(["canAttemptAssessment"]),
  validateEndAssessment,
  validateRequest,
  endAssessmentController
);

/**
 * @swagger
 * /v1/assessment/compute-results:
 *   post:
 *     summary: Compute assessment results
 *     description: This endpoint computes the results of a specific assessment. It is protected and can only be accessed by internal services with valid authorization.
 *     tags:
 *       - Internal API for internal services only
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
 *                 example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *             required:
 *               - assessmentId
 *     responses:
 *       '200':
 *         description: Assessment results successfully computed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: The computed results of the assessment.
 *       '400':
 *         description: Bad Request. The input data is invalid (e.g., assessmentId is missing or not a valid UUID).
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
 *                   description: A message describing the error in the request.
 *                   example: assessmentId should be a valid UUID v4
 *       '401':
 *         description: Unauthorized. The request lacks valid authentication credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating that authentication is required.
 *                   example: unauthorized
 *       '403':
 *         description: Forbidden. The request is authenticated but does not have permission to access this resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating that the user is not authorized.
 *                   example: Not authorized to compute results for this assessment
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
 *                   example: Assessment with this ID does not exist
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
 *                   example: Error computing results for the assessment
 */
router.post(
  '/compute-results',
  authenticateInternalService,
  validateComputeResults,
  validateRequest,
  computeResultsController
);

/**
 * @swagger
 * /v1/assessment/result/publish:
 *   post:
 *     summary: Publish or unpublish an assessment result
 *     description: This endpoint allows publishing or unpublishing the result of a specific assessment.
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
 *                 example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *               publish:
 *                 type: boolean
 *                 description: Flag to either publish (true) or unpublish (false) the assessment result.
 *                 example: false
 *             required:
 *               - assessmentId
 *               - publish
 *     responses:
 *       '200':
 *         description: Result successfully published/unpublished.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *       '400':
 *         description: Bad Request. The input data is invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid assessment ID or publish flag
 *       '403':
 *         description: Forbidden. The user is not authorized to publish/unpublish the result.
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
 *                   example: Not authorized to publish/unpublish this assessment result
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
 *                   example: Assessment with this ID does not exist
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
 *                   example: Error publishing/unpublishing result
 */
router.post(
  '/result/publish',
  authenticateUser(["canManageReports"]),
  validatePublishResult,
  validateRequest,
  publishResultController
)

/**
 * @swagger
 * /v1/assessment/{assessmentId}/results:
 *   get:
 *     summary: Retrieve assessment results
 *     description: This endpoint retrieves the results of a specific assessment, with support for pagination, sorting, and ordering.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment for which results are to be retrieved.
 *         schema:
 *           type: string
 *           example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 4
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: The field by which to sort the results.
 *         schema:
 *           type: string
 *           example: marks_scored
 *           enum:
 *             - user_id
 *             - first_name
 *             - last_name
 *             - email
 *             - correct_answers_count
 *             - marks_scored
 *             - correct_percentage
 *             - wrong_answers_count
 *             - createdAt
 *             - updatedAt
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order in which to sort the results (ascending or descending).
 *         schema:
 *           type: string
 *           example: DESC
 *           enum:
 *             - ASC
 *             - DESC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: string
 *                             description: The unique identifier of the user.
 *                             example: 5a11520a-7fe1-430e-a3b3-94797b3433af
 *                           correct_answers_count:
 *                             type: integer
 *                             description: The number of correct answers.
 *                             example: 3
 *                           marks_scored:
 *                             type: integer
 *                             description: The total marks scored by the user.
 *                             example: 15
 *                           correct_percentage:
 *                             type: number
 *                             format: float
 *                             description: The percentage of correct answers.
 *                             example: 100
 *                           wrong_answers_count:
 *                             type: integer
 *                             description: The number of wrong answers.
 *                             example: 0
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the result was created.
 *                             example: 2024-09-07T09:55:18.179Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the result was last updated.
 *                             example: 2024-09-07T16:30:05.894Z
 *                           user:
 *                             type: object
 *                             properties:
 *                               first_name:
 *                                 type: string
 *                                 description: The first name of the user.
 *                                 example: student2
 *                               last_name:
 *                                 type: string
 *                                 description: The last name of the user.
 *                                 example: stu
 *                               email:
 *                                 type: string
 *                                 description: The email of the user.
 *                                 example: student2@gmail.com
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid query parameters
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
 *                   example: Assessment with this ID does not exist
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
 *                   example: Error retrieving assessment results
 */
router.get(
  "/:assessmentId/results",
  authenticateUser(["canManageReports"]),
  validateGetResult,
  validateRequest,
  getResultController
)

/**
 * @swagger
 * /v1/assessment/results:
 *   get:
 *     summary: Retrieve a list of assessments with results
 *     description: This endpoint retrieves a list of assessments with their results, including pagination, sorting, and ordering options.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 4
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: The field by which to sort the results.
 *         schema:
 *           type: string
 *           example: name
 *           enum:
 *             - assessment_id
 *             - total_marks
 *             - total_participants
 *             - average_marks
 *             - average_marks_percentage
 *             - is_published
 *             - createdAt
 *             - updatedAt
 *             - name
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order in which to sort the results (ascending or descending).
 *         schema:
 *           type: string
 *           example: DESC
 *           enum:
 *             - ASC
 *             - DESC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           assessment_id:
 *                             type: string
 *                             description: The unique identifier of the assessment.
 *                             example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *                           total_marks:
 *                             type: integer
 *                             description: The total marks available for the assessment.
 *                             example: 15
 *                           total_participants:
 *                             type: integer
 *                             description: The total number of participants in the assessment.
 *                             example: 2
 *                           average_marks:
 *                             type: number
 *                             format: float
 *                             description: The average marks scored by participants.
 *                             example: 12.5
 *                           average_marks_percentage:
 *                             type: number
 *                             format: float
 *                             description: The average percentage of marks scored by participants.
 *                             example: 83.33333333333334
 *                           is_published:
 *                             type: boolean
 *                             description: Indicates whether the assessment result is published.
 *                             example: false
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was created.
 *                             example: 2024-09-08T14:58:49.993Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the assessment was last updated.
 *                             example: 2024-09-08T14:58:49.993Z
 *                           assessment:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: The name of the assessment.
 *                                 example: PNA Testes
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid query parameters
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
 *                   example: Error retrieving assessment results
 */
router.get(
  "/results",
  authenticateUser(["canManageReports"]),
  validateGetAssessmentsResultList,
  validateRequest,
  getAllAssessmentResultController
)

/**
 * @swagger
 * /v1/assessment/my-results:
 *   get:
 *     summary: Retrieve the list of your assessment results
 *     description: This endpoint retrieves a paginated list of assessment results for the current user, with options for sorting and ordering.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: The field by which to sort the results.
 *         schema:
 *           type: string
 *           example: name
 *           enum:
 *             - name
 *             - correct_answers_count
 *             - marks_scored
 *             - correct_percentage
 *             - wrong_answers_count
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order in which to sort the results (ascending or descending).
 *         schema:
 *           type: string
 *           example: ASC
 *           enum:
 *             - ASC
 *             - DESC
 *     responses:
 *       '200':
 *         description: Successfully retrieved user assessment results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           correct_answers_count:
 *                             type: integer
 *                             description: The number of correct answers.
 *                             example: 1
 *                           marks_scored:
 *                             type: number
 *                             description: The total marks scored by the user.
 *                             example: 5
 *                           correct_percentage:
 *                             type: number
 *                             description: The percentage of correct answers.
 *                             example: 33.333333333333336
 *                           wrong_answers_count:
 *                             type: integer
 *                             description: The number of wrong answers.
 *                             example: 2
 *                           assessment:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: The name of the assessment.
 *                                 example: PNA Testes
 *                               description:
 *                                 type: string
 *                                 description: A description of the assessment.
 *                                 example: A new project
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid query parameters
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
 *                   example: Error retrieving assessment results
 */
router.get(
  "/my-results",
  authenticateUser(["canViewReport"]),
  validateGetMyAssessmentsResultList,
  validateRequest,
  getUserAssessmentsResultListController
)

/**
 * @swagger
 * /v1/assessment/groups:
 *   get:
 *     summary: Retrieve a list of assessment groups
 *     description: This endpoint retrieves a paginated list of assessment groups, including sorting and ordering options.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: The field by which to sort the results.
 *         schema:
 *           type: string
 *           example: name
 *           enum:
 *             - name
 *             - total_assessments
 *             - total_users
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order in which to sort the results (ascending or descending).
 *         schema:
 *           type: string
 *           example: DESC
 *           enum:
 *             - ASC
 *             - DESC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment groups.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     groups:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           group_id:
 *                             type: string
 *                             description: The unique identifier of the group.
 *                             example: d397c620-5583-424b-8a50-ed923e2c8e3e
 *                           total_assessments:
 *                             type: string
 *                             description: The total number of assessments in the group.
 *                             example: "1"
 *                           group_name:
 *                             type: string
 *                             description: The name of the group.
 *                             example: students
 *                           total_users:
 *                             type: string
 *                             description: The total number of users in the group.
 *                             example: "1"
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 2
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid query parameters
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
 *                   example: Error retrieving assessment groups
 */
router.get(
  "/groups",
  authenticateUser(["canManageReports"]),
  validateGetAssessmentsGroupsList,
  validateRequest,
  getAllAssessmentsGroupsListController
)

/**
 * @swagger
 * /v1/assessment/{assessmentId}/{groupId}/analytics:
 *   get:
 *     summary: Retrieve analytics for a specific assessment and group
 *     description: This endpoint retrieves detailed analytics for a specific assessment within a given group, including metrics such as total users, average marks, and percentages.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment.
 *         schema:
 *           type: string
 *           example: 35e8fd68-eae7-4dcd-a229-5d7d4a8085ea
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: The unique identifier of the group.
 *         schema:
 *           type: string
 *           example: 369decfb-136e-42ef-b71d-f55faa173900
 *     responses:
 *       '200':
 *         description: Successfully retrieved analytics for the assessment and group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_users:
 *                       type: string
 *                       description: The total number of users in the group.
 *                       example: "3"
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the analytics record.
 *                       example: c45b27cf-6bcd-459f-87ee-73ed936eda7a
 *                     assessment_id:
 *                       type: string
 *                       description: The unique identifier of the assessment.
 *                       example: 35e8fd68-eae7-4dcd-a229-5d7d4a8085ea
 *                     group_id:
 *                       type: string
 *                       description: The unique identifier of the group.
 *                       example: 369decfb-136e-42ef-b71d-f55faa173900
 *                     total_marks:
 *                       type: integer
 *                       description: The total marks for the assessment.
 *                       example: 30
 *                     total_participants:
 *                       type: integer
 *                       description: The total number of participants in the assessment.
 *                       example: 3
 *                     average_marks:
 *                       type: number
 *                       format: float
 *                       description: The average marks scored by participants.
 *                       example: 17.333333333333332
 *                     average_marks_percentage:
 *                       type: number
 *                       format: float
 *                       description: The average percentage of marks scored by participants.
 *                       example: 63.333333333333336
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the analytics record was created.
 *                       example: 2024-11-22T21:17:47.448Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the analytics record was last updated.
 *                       example: 2024-11-22T21:17:54.878Z
 *                     group:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the group.
 *                           example: hoes
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid path parameters
 *       '404':
 *         description: Not Found. The assessment or group could not be found.
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
 *                   example: Assessment or group not found
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
 *                   example: Error retrieving analytics
 */
router.get(
  "/:assessmentId/:groupId/analytics",
  authenticateUser(["canManageReports"]),
  validateGetGroupAssessmentAnalytics,
  validateRequest,
  getGroupAssessmentAnalyticsController
)

/**
 * @swagger
 * /v1/assessment/{assessmentId}/{groupId}/results:
 *   get:
 *     summary: Retrieve a list of assessment results for a specific group
 *     description: This endpoint retrieves a paginated list of assessment results for a specific group, including sorting and ordering options.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment.
 *         schema:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *       - name: groupId
 *         in: path
 *         required: true
 *         description: The unique identifier of the group.
 *         schema:
 *           type: string
 *           example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: The field by which to sort the results.
 *         schema:
 *           type: string
 *           example: first_name
 *           enum:
 *             - first_name
 *             - last_name
 *             - email
 *             - marks_scored
 *             - correct_percentage
 *             - createdAt
 *             - updatedAt
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order in which to sort the results (ascending or descending).
 *         schema:
 *           type: string
 *           example: ASC
 *           enum:
 *             - ASC
 *             - DESC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment results for the group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier for the assessment result.
 *                             example: 435bc8f1-353b-489f-88ad-95d7d0885667
 *                           user_id:
 *                             type: string
 *                             description: The unique identifier of the user.
 *                             example: 81d2c0fc-3f78-4aef-abd5-4f9f1f60a63e
 *                           correct_answers_count:
 *                             type: integer
 *                             description: The number of correct answers given by the user.
 *                             example: 5
 *                           marks_scored:
 *                             type: integer
 *                             description: The total marks scored by the user.
 *                             example: 15
 *                           correct_percentage:
 *                             type: number
 *                             format: float
 *                             description: The percentage of correct answers.
 *                             example: 50
 *                           wrong_answers_count:
 *                             type: integer
 *                             description: The number of wrong answers given by the user.
 *                             example: 5
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the result was created.
 *                             example: 2024-11-22T20:24:22.746Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the result was last updated.
 *                             example: 2024-11-22T21:17:54.868Z
 *                           user:
 *                             type: object
 *                             description: Information about the user.
 *                             properties:
 *                               first_name:
 *                                 type: string
 *                                 description: The first name of the user.
 *                                 example: student1
 *                               last_name:
 *                                 type: string
 *                                 description: The last name of the user.
 *                                 example: Verma
 *                               email:
 *                                 type: string
 *                                 description: The email of the user.
 *                                 example: student1@gmail.com
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad Request. The input parameters are invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid query parameters
 *       '404':
 *         description: Not Found. The assessment or group does not exist.
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
 *                   example: Assessment or group not found
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
 *                   example: Error retrieving assessment results
 */
router.get(
  "/:assessmentId/:groupId/results",
  authenticateUser(["canManageReports"]),
  validateGetGroupAssessmentResults,
  validateRequest,
  getGroupAssessmentResultsController
)

/**
 * @swagger
 * /v1/assessment/{assessmentId}/analytics:
 *   get:
 *     summary: Retrieve analytics for a specific assessment
 *     description: This endpoint retrieves analytics data for a specific assessment, including total marks, total participants, average marks, and more.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment for which analytics are being retrieved.
 *         schema:
 *           type: string
 *           example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     assessment_id:
 *                       type: string
 *                       description: The unique identifier of the assessment.
 *                       example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *                     total_marks:
 *                       type: integer
 *                       description: The total marks available for the assessment.
 *                       example: 15
 *                     total_participants:
 *                       type: integer
 *                       description: The total number of participants in the assessment.
 *                       example: 2
 *                     average_marks:
 *                       type: number
 *                       format: float
 *                       description: The average marks scored by participants.
 *                       example: 12.5
 *                     average_marks_percentage:
 *                       type: number
 *                       format: float
 *                       description: The average percentage of marks scored by participants.
 *                       example: 83.33333333333334
 *                     is_published:
 *                       type: boolean
 *                       description: Indicates whether the assessment result is published.
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the assessment was created.
 *                       example: 2024-09-08T14:58:49.993Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the assessment was last updated.
 *                       example: 2024-09-08T14:58:49.993Z
 *                     assessment:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the assessment.
 *                           example: PNA Testes
 *                         description:
 *                           type: string
 *                           description: A description of the assessment.
 *                           example: A new project
 *       '400':
 *         description: Bad Request. The assessment ID is invalid.
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
 *                   description: A message describing the error in the request.
 *                   example: Invalid assessment ID
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
 *                   example: Assessment with this ID does not exist
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
 *                   example: Error retrieving assessment analytics
 */
router.get(
  "/:assessmentId/analytics",
  authenticateUser(["canManageReports"]),
  validateGetAssessmentAnalytics,
  validateRequest,
  getAssessmentAnalytics
)

/**
 * @swagger
 * /v1/assessment/analytics/chart:
 *   get:
 *     summary: Get assessment analytics data in chart format.
 *     tags:
 *       - Assessment Analytics
 *     description: Retrieves the assessment analytics data based on the specified metric and optional date range.
 *     parameters:
 *       - in: query
 *         name: metric
 *         required: true
 *         description: The metric for which the analytics data is to be retrieved.
 *         schema:
 *           type: string
 *           enum: [average_marks_percentage, total_participants, average_marks]
 *       - in: query
 *         name: start_date
 *         required: false
 *         description: The start date for the data range.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2004/10/16"
 *       - in: query
 *         name: end_date
 *         required: false
 *         description: The end date for the data range.
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved the assessment analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-08T14:58:49.993Z"
 *                       metricValue:
 *                         type: integer
 *                         example: 2
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "start_date must be a valid date"
 */
router.get(
  "/analytics/chart",
  authenticateUser(["canManageReports"]),
  validateGetAssessmentAnalyticsChart,
  validateRequest,
  getAssessmentAnalyticsChart
)

/**
 * @swagger
 * /v1/assessment/attempt/assessmentdetails/time:
 *   get:
 *     summary: Get assessment time data
 *     tags:
 *        - Assessment Attempt Controller
 *     description: Retrieves the assessment time data for a specific assessment and user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The UUID of the assessment.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved the assessment time data.
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
 *                     duration:
 *                       type: integer
 *                       description: Duration in seconds
 *                       example: 864000
 *                     server_time:
 *                       type: string
 *                       format: date-time
 *                       description: The current server time
 *                       example: "2024-09-16T17:15:13.773Z"
 *                     start_at:
 *                       type: string
 *                       format: date-time
 *                       description: The start time of the assessment
 *                       example: "2024-09-16T17:13:13.389Z"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid UUID. Please provide a valid UUID v4."
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get(
  "/attempt/assessmentdetails/time",
  authenticateUser(["canAttemptAssessment"]),
  validateAssessmentGetId,
  validateRequest,
  getAssessmentTimeController

)

/**
 * @swagger
 * /v1/assessment/attempt/assessmentdetails/sections:
 *   get:
 *     summary: Get assessment sections details
 *     tags:
 *       - Assessment Attempt Controller
 *     description: Retrieves the sections of a specific assessment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The UUID of the assessment.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved the assessment sections.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2]
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid UUID. Please provide a valid UUID v4."
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/attempt/assessmentdetails/sections",
  authenticateUser(["canAttemptAssessment"]),
  validateAssessmentGetId,
  validateRequest,
  getAssessmentSectionsController,
)

/**
 * @swagger
 * /v1/assessment/export:
 *   post:
 *     summary: Export assessments as a zip file
 *     description: Exports specified assessments or all assessments as a zip file.
 *     tags:
 *       - Assessment Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentIds:
 *                 oneOf:
 *                   - type: string
 *                     enum: ['*']
 *                     description: Export all assessments
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uuid
 *                     description: Array of assessment IDs to export
 *             example:
 *               assessmentIds: "*"
 *     responses:
 *       200:
 *         description: Successful response with zip file
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/export",
  authenticateUser(["canManageAssessment"]),
  validateAssessmentExport,
  validateRequest,
  exportAssessmentController
);


/**
 * @swagger
 * /v1/assessment/total:
 *   get:
 *     summary: Get total number of assessments
 *     description: Retrieves the total count of assessments in the system.
 *     tags:
 *       - Admin Dashboard Routes
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     responses:
 *       200:
 *         description: Successful response with the total number of assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAssessments:
 *                   type: integer
 *                   description: The total number of assessments
 *             example:
 *               totalAssessments: 25
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total",
  authenticateUser(["canManageAssessment"]),
  validateRequest,
  getAssessmentTotalController
);

/**
 * @swagger
 * /v1/assessment/ongoing:
 *   get:
 *     summary: Get count of ongoing assessments
 *     description: Retrieves the count of ongoing assessments in the system.
 *     tags:
 *       - Admin Dashboard Routes
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     responses:
 *       200:
 *         description: Successful response with the count of ongoing assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ongoingAssessmentsCount:
 *                   type: integer
 *                   description: The total number of ongoing assessments
 *             example:
 *               ongoingAssessmentsCount: 10
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
  "/ongoing",
  authenticateUser(["canManageAssessment"]),
  validateRequest,
  getOngoingAssessmentController
);

/**
 * @swagger
 * /v1/assessment/scheduled:
 *   get:
 *     summary: Get count of scheduled assessments
 *     description: Retrieves the count of scheduled assessments in the system.
 *     tags:
 *       - Admin Dashboard Routes
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     responses:
 *       200:
 *         description: Successful response with the count of scheduled assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduledAssessmentsCount:
 *                   type: integer
 *                   description: The total number of scheduled assessments
 *             example:
 *               scheduledAssessmentsCount: 15
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
  "/scheduled",
  authenticateUser(["canManageAssessment"]),
  validateRequest,
  getScheduledAssessmentController
);

/**
 * @swagger
 * /v1/assessment/past:
 *   get:
 *     summary: Get count of past assessments
 *     description: Retrieves the count of past assessments in the system.
 *     tags:
 *       - Admin Dashboard Routes
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     responses:
 *       200:
 *         description: Successful response with the count of past assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pastAssessmentsCount:
 *                   type: integer
 *                   description: The total number of past assessments
 *             example:
 *               pastAssessmentsCount: 20
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
  "/past",
  authenticateUser(["canManageAssessment"]),
  validateRequest,
  getPastAssessmentController
);

/**
 * @swagger
 * /v1/assessment/draft:
 *   get:
 *     summary: Get count of draft assessments
 *     description: Retrieves the count of draft assessments in the system.
 *     tags:
 *       - Admin Dashboard Routes
 *     security:
 *       - bearerAuth: []  # Token-based authentication
 *     responses:
 *       200:
 *         description: Successful response with the count of draft assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDraftAssessments:
 *                   type: integer
 *                   description: The total number of draft assessments
 *             example:
 *               totalDraftAssessments: 10
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
  "/draft",
  authenticateUser(["canManageAssessment"]),
  validateRequest,
  getDraftAssessmentCountController
);

/**
 * @swagger
 * /v1/assessment/search:
 *   get:
 *     summary: Search for assessments based on the provided query.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           example: pna
 *         required: true
 *         description: The query string to search for assessments. Can match assessment name or description.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         required: false
 *         description: The number of items per page.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         required: false
 *         description: The sort order, either ascending (ASC) or descending (DESC).
 *     responses:
 *       '200':
 *         description: A list of searched assessments.
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
 *                     searchResults:
 *                       type: array
 *                       description: A list of assessments matching the search criteria.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the assessment.
 *                             example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *                           name:
 *                             type: string
 *                             description: The name of the assessment.
 *                             example: PNA Testes
 *                           description:
 *                             type: string
 *                             description: The description of the assessment.
 *                             example: A new project
 *                           is_active:
 *                             type: boolean
 *                             description: Indicates whether the assessment is active.
 *                             example: true
 *                           start_at:
 *                             type: string
 *                             format: date-time
 *                             description: The start date and time of the assessment.
 *                             example: 2024-04-16T08:00:00.000Z
 *                           end_at:
 *                             type: string
 *                             format: date-time
 *                             description: The end date and time of the assessment.
 *                             example: 2024-01-28T01:10:00.000Z
 *                           duration:
 *                             type: integer
 *                             description: The duration of the assessment in milliseconds.
 *                             example: 345600000
 *                           created_by:
 *                             type: string
 *                             description: The ID of the user who created the assessment.
 *                             example: 27c710c1-53db-48c8-b8c4-13f35ec769a5
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the assessment record.
 *                             example: 2024-09-06T21:54:43.310Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update timestamp of the assessment record.
 *                             example: 2024-10-07T13:34:51.542Z
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad request. Invalid query parameters.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/search",
  authenticateUser(["canManageAssessment"]),
  validateAssesmentsSearch,
  validateRequest,
  searchAssesmentsController
);

/**
 * @swagger
 * /v1/assessment/assigned/search:
 *   get:
 *     summary: Search for assigned assessments based on the provided query.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           example: pna
 *         required: true
 *         description: The query string to search for assigned assessments. Can match assessment name or description.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         required: false
 *         description: The number of items per page.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         required: false
 *         description: The sort order, either ascending (ASC) or descending (DESC).
 *     responses:
 *       '200':
 *         description: A list of searched assigned assessments.
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
 *                     searchResults:
 *                       type: array
 *                       description: A list of assigned assessments matching the search criteria.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the assessment.
 *                             example: c3c911cb-e8f1-4d90-9e75-83062bdd6df1
 *                           name:
 *                             type: string
 *                             description: The name of the assessment.
 *                             example: PNA Testes
 *                           description:
 *                             type: string
 *                             description: The description of the assessment.
 *                             example: A new project
 *                           is_active:
 *                             type: boolean
 *                             description: Indicates if the assessment is active.
 *                             example: true
 *                           start_at:
 *                             type: string
 *                             format: date-time
 *                             description: The start date and time of the assessment.
 *                             example: 2024-04-16T08:00:00.000Z
 *                           end_at:
 *                             type: string
 *                             format: date-time
 *                             description: The end date and time of the assessment.
 *                             example: 2024-01-28T01:10:00.000Z
 *                           duration:
 *                             type: integer
 *                             description: The duration of the assessment in milliseconds.
 *                             example: 345600000
 *                           created_by:
 *                             type: string
 *                             description: The identifier of the user who created the assessment.
 *                             example: 27c710c1-53db-48c8-b8c4-13f35ec769a5
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the assessment.
 *                             example: 2024-09-06T21:54:43.310Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update timestamp of the assessment.
 *                             example: 2024-10-07T13:34:51.542Z
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 1
 *       '400':
 *         description: Bad request. Invalid query parameters.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/assigned/search",
  authenticateUser(["canAttemptAssessment"]),
  validateAssesmentsSearch,
  validateRequest,
  searchAssignedAssesmentsController
);

/**
 * @swagger
 * /v1/assessment/{assessmentId}/{userId}/responses:
 *   get:
 *     summary: Retrieve user responses for a specific assessment
 *     description: Get detailed responses for all questions answered by a user in a specific assessment, organized by sections.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment.
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order of results (ascending or descending).
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment responses.
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
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               description: Question identifier
 *                             description:
 *                               type: string
 *                               description: The question text
 *                             marks:
 *                               type: integer
 *                               description: Marks allocated for the question
 *                             section:
 *                               type: integer
 *                               description: Section number of the question
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                     description: Option identifier
 *                                   description:
 *                                     type: string
 *                                     description: Option text
 *                                   is_correct:
 *                                     type: boolean
 *                                     description: Indicates if this is the correct option
 *                                   is_selected:
 *                                     type: boolean
 *                                     description: Indicates if this option was selected by the user
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages available
 *                       example: 1
 *       '400':
 *         description: Bad request. Invalid parameters provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid parameters provided
 *       '404':
 *         description: Assessment or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Assessment or user not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get(
  "/:assessmentId/:userId/responses",
  authenticateUser(["canManageReports"]),
  validateGetUserAssessmentResponses,
  validateRequest,
  getUserAssessmentResponsesController
);

/**
 * @swagger
 * /v1/assessment/{assessmentId}/my-responses:
 *   get:
 *     summary: Retrieve user responses for a specific assessment
 *     description: Get detailed responses for all questions answered by a user in a specific assessment, organized by sections.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: assessmentId
 *         in: path
 *         required: true
 *         description: The unique identifier of the assessment.
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         description: The number of results per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *       - name: order
 *         in: query
 *         required: false
 *         description: The order of results (ascending or descending).
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *     responses:
 *       '200':
 *         description: Successfully retrieved assessment responses.
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
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               description: Question identifier
 *                             description:
 *                               type: string
 *                               description: The question text
 *                             marks:
 *                               type: integer
 *                               description: Marks allocated for the question
 *                             section:
 *                               type: integer
 *                               description: Section number of the question
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                     description: Option identifier
 *                                   description:
 *                                     type: string
 *                                     description: Option text
 *                                   is_correct:
 *                                     type: boolean
 *                                     description: Indicates if this is the correct option
 *                                   is_selected:
 *                                     type: boolean
 *                                     description: Indicates if this option was selected by the user
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages available
 *                       example: 1
 *       '400':
 *         description: Bad request. Invalid parameters provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid parameters provided
 *       '404':
 *         description: Assessment or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Assessment or user not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get(
  "/:assessmentId/my-responses",
  authenticateUser(["canViewReport"]),
  validateGetMyAssessmentResponses,
  validateRequest,
  getMyAssessmentResponsesController
);

/**
 * @swagger
 * /v1/assessment/{questionId}/explain:
 *   get:
 *     summary: Get explanation for a specific assessment question
 *     description: Retrieves the detailed explanation for a specific question in an assessment by its ID.
 *     tags:
 *       - Assessment View Controller
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The unique identifier of the question.
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       '200':
 *         description: Successfully retrieved the question explanation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     explanation:
 *                       type: string
 *                       description: The detailed explanation for the question.
 *                       example: "Node.js is not a framework for building user interfaces (front-end), a database system for storing data, or a compiler that translates JavaScript into machine code. Instead, Node.js is a runtime environment that allows you to execute JavaScript code on a server. This means you can use JavaScript to build the back-end (server-side) logic of web applications, APIs, and other server-based systems. It provides an environment with libraries and tools to handle network requests, file systems, and other server-side tasks, all using JavaScript."
 *       '404':
 *         description: Question not found.
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
 *                   description: A message indicating that the question was not found.
 *                   example: Question not found
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
 *                   example: Error retrieving question explanation
 */
router.get(
  "/:questionId/explain",
  authenticateUser(["canViewReport", "canManageReports"], true),
  validateGetQuestionExplanation,
  validateRequest,
  getQuestionExplanationController
);

export default router;
