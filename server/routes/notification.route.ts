import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";
import {
  validateGetAllGroups,
  validateGroup,
  validateGroupsId,
  validateGroupUpdate,
  validateNotification,
  validateNotificationDelete,
} from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";
import {
  CreateGroupController,
  CreateNotificationController,
  deleteGroupController,
  DeleteNotificationController,
  getAllGroupsController,
  UpdateGroupController,
} from "../controller/notification,/notification.controller";
import { upload } from "../middleware/multer";

const router: Router = express.Router();

/**
 * @openapi
 * v1/notification/create-notification:
 *   post:
 *     tags:
 *       - Notification
 *     summary: Create a new notification
 *     description: Create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "This is a sample notification description."
 *               title:
 *                 type: string
 *                 example: "Sample Notification Title"
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/sample-image.jpg"
 *               file_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/sample-file.pdf"
 *
 *     responses:
 *       '200':
 *         description: Successfully created notification
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error
 */

router.post(
  "/create-notification",
  authenticateUser(["canManageNotification"]),
  validateNotification,
  validateRequest,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  CreateNotificationController
);

/**
 * @openapi
 * v1/notification/delete-notification:
 *   delete:
 *     tags:
 *       - Notification
 *     summary: Delete a notification
 *     description: Delete a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted notification
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error
 */
router.delete(
  "/delete-notification",
  authenticateUser(["canManageNotification"]),
  validateNotificationDelete,
  validateRequest,
  DeleteNotificationController
);

/**
 * @openapi
 * v1/notification/create-group:
 *   post:
 *     tags:
 *       - Notification
 *     summary: Create a new group
 *     description: Create a new group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *
 *     responses:
 *       '200':
 *         description: Successfully created group
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/create-group",
  authenticateUser(["canManageLocalGroup"]),
  validateGroup,
  validateRequest,
  CreateGroupController
);

/**
 * @openapi
 * /v1/notification/group:
 *   patch:
 *     tags:
 *       - Notification
 *     summary: Update an existing notification group
 *     description: Endpoint to update an existing notification group.
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
 *                 description: The UUID of the notification group to be updated.
 *               name:
 *                 type: string
 *                 description: The new name of the notification group.
 *             required:
 *               - id
 *               - name
 *             example:
 *               id: "82802632-1226-4a40-aecf-073a05c7272b"
 *               name: "hello world"
 *     responses:
 *       '200':
 *         description: Group updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "dfb939ef-2cc4-43aa-ac08-7052d5a76e50"
 *                     name:
 *                       type: string
 *                       example: "hello world"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-08T08:25:01.258Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-08T08:25:11.727Z"
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: Notification group not found.
 *       '500':
 *         description: Internal server error.
 */
router.patch(
  "/group",
  authenticateUser(["canManageLocalGroup"]),
  validateGroupUpdate,
  validateRequest,
  UpdateGroupController
);

/**
 * @openapi
 * /v1/notification/groups:
 *   delete:
 *     tags:
 *       - Notification
 *     summary: Delete notification groups
 *     description: Endpoint to delete one or more notification groups by their IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: An array of UUIDs representing the notification groups to be deleted.
 *             example:
 *               groupIds:
 *                 - "d5eca6c5-e6c2-412d-975a-c0bcb4848ef3"
 *                 - "c88891c7-58a1-4d5f-96b7-252f8d5f05a8"
 *     responses:
 *       '200':
 *         description: Groups deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Groups Deleted successfully
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '404':
 *         description: One or more groups not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete(
  "/groups",
  authenticateUser(["canManageLocalGroup"]),
  validateGroupsId,
  validateRequest,
  deleteGroupController
);

/**
 * @swagger
 * /v1/notification/groups:
 *   get:
 *     summary: Get notification groups
 *     tags:
 *       - Notification
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
 *         description: Notification groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of retrieving notification groups.
 *                 data:
 *                   type: object
 *                   properties:
 *                     groups:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the group.
 *                           name:
 *                             type: string
 *                             description: The name of the notification group.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the group was created.
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the group was last updated.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages for pagination.
 *             example:
 *               message: success
 *               data:
 *                 groups:
 *                   - id: "67811411-966c-4b68-8451-db573c07b2b3"
 *                     name: "sfff33fdffffwffffff"
 *                     createdAt: "2024-08-08T10:24:57.536Z"
 *                     updatedAt: "2024-08-08T10:24:57.536Z"
 *                 totalPages: 3
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get(
  "/groups",
  authenticateUser(["canManageLocalGroup"]),
  validateGetAllGroups,
  validateRequest,
  getAllGroupsController
)

export default router;
