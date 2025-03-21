import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";

import { validateRequest } from "../utils/validateRequest";
import {
  addGroupToNotificationController,
  CreateNotificationController,
  DeleteNotificationController,
  getAllNotificationsController,
  removeGroupFromNotificationController,
  searchGroupsController,
  viewAssignedNotificationsController,
} from "../controller/notification,/notification.controller";
import { upload } from "../middleware/multer";
import {
  validateNotification,
  validateNotificationDelete,
} from "../lib/validator/index";
import { validateAddGroupToNotification, validateGetAllNotifications, validateGroupSearch, validateRemoveGroupFromNotification, validateViewAssignedNotifications } from "../lib/validator/notification/validator";

const router: Router = express.Router();

/**
 * @swagger
 * /v1/notification/create:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notification.
 *                 example: foo
 *               description:
 *                 type: string
 *                 description: The description of the notification.
 *                 example: bar
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file associated with the notification.
 *                 example: somefile.png
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file associated with the notification.
 *                 example: somefile.pdf
 *     responses:
 *       '200':
 *         description: Notification created successfully
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
 *                   example: Notification created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the notification.
 *                       example: 3c6c3b6c-62ba-4337-beef-31a0e9b244d3
 *                     description:
 *                       type: string
 *                       description: The description of the notification.
 *                       example: bar
 *                     title:
 *                       type: string
 *                       description: The title of the notification.
 *                       example: foo
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the notification was last updated.
 *                       example: 2024-08-09T20:03:52.667Z
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the notification was created.
 *                       example: 2024-08-09T20:03:52.667Z
 *                     image_url:
 *                       type: string
 *                       description: The URL of the uploaded image.
 *                       example: https://pnacademy-dev.s3.ap-south-1.amazonaws.com/notification-images/19a25b72-eeea-4946-b434-a8add0e9ca7f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWREDQP4HQAZEBENG%2F20240809%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240809T200352Z&X-Amz-Expires=3600&X-Amz-Signature=2748979bb2f76315fc383a82f8757149e9b522bba57d0787da1609b1cd8969f0&X-Amz-SignedHeaders=host&x-id=GetObject
 *                     file_url:
 *                       type: string
 *                       description: The URL of the uploaded file.
 *                       example: https://pnacademy-dev.s3.ap-south-1.amazonaws.com/notification-files/079ae1e8-d91f-42c1-bcbd-59a340094350.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWREDQP4HQAZEBENG%2F20240809%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240809T200352Z&X-Amz-Expires=3600&X-Amz-Signature=9d7da03d1bd61824be1c0c9500c745799ca263b4b75b8f1160f4f08da127eec4&X-Amz-SignedHeaders=host&x-id=GetObject
 *       '400':
 *         description: Bad request. Invalid data provided.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/create",
  authenticateUser(["canManageNotification"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateNotification,
  validateRequest,
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
 * @swagger
 * /v1/notification/all:
 *   get:
 *     summary: Retrieve all notifications with pagination and sorting options
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 3
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 3
 *         description: The number of notifications per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: The field to sort the results by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         description: The order of sorting (ascending or descending).
 *     responses:
 *       '200':
 *         description: A list of notifications.
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
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the notification.
 *                             example: 59cfd460-6ded-46e6-a269-b2747065f76c
 *                           title:
 *                             type: string
 *                             description: The title of the notification.
 *                             example: foo
 *                           description:
 *                             type: string
 *                             description: The description of the notification.
 *                             example: bar
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the notification.
 *                             example: 2024-08-09T17:27:50.700Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update timestamp of the notification.
 *                             example: 2024-08-09T17:27:50.700Z
 *                           image_url:
 *                             type: string
 *                             description: The URL of the notification's image.
 *                             example: https://example.com/notification-images/image.png
 *                           file_url:
 *                             type: string
 *                             description: The URL of the notification's file.
 *                             example: https://example.com/notification-files/file.pdf
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                       example: 8
 *       '400':
 *         description: Bad request. Invalid query parameters.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/all",
  authenticateUser(["canManageNotification"]),
  validateGetAllNotifications,
  validateRequest,
  getAllNotificationsController
);

/**
 * @swagger
 * /v1/notification/add-group:
 *   post:
 *     summary: Add a notification to a group
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: The unique identifier of the notification.
 *                 example: 59cfd460-6ded-46e6-a269-b2747065f76c
 *               groupId:
 *                 type: string
 *                 description: The unique identifier of the group.
 *                 example: d579acc4-4936-4490-9cd5-15ddceaf0413
 *     responses:
 *       '200':
 *         description: Notification successfully added to the group.
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
 *         description: Notification or Group not found.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/add-group",
  authenticateUser(["canManageLocalGroup"]),
  validateAddGroupToNotification,
  validateRequest,
  addGroupToNotificationController
);

/**
 * @swagger
 * /v1/notification/remove-group:
 *   delete:
 *     summary: Remove a group from a notification
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: The unique identifier of the notification.
 *                 example: 59cfd460-6ded-46e6-a269-b2747065f76c
 *               groupId:
 *                 type: string
 *                 description: The unique identifier of the group.
 *                 example: d579acc4-4936-4490-9cd5-15ddceaf0413
 *     responses:
 *       '200':
 *         description: Group removed successfully from the notification.
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
 *         description: Notification or Group not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete(
  "/remove-group",
  authenticateUser(["canManageLocalGroup"]),
  validateRemoveGroupFromNotification,
  validateRequest,
  removeGroupFromNotificationController
);

/**
 * @swagger
 * /v1/notification/assigned:
 *   get:
 *     summary: Get assigned notifications with pagination and sorting options.
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 3
 *         required: false
 *         description: The number of items per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         required: false
 *         description: The field to sort the results by.
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
 *         description: A list of assigned notifications.
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
 *                     notifications:
 *                       type: array
 *                       description: A list of notifications.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the notification.
 *                             example: 59cfd460-6ded-46e6-a269-b2747065f76c
 *                           description:
 *                             type: string
 *                             description: The description of the notification.
 *                             example: bar
 *                           title:
 *                             type: string
 *                             description: The title of the notification.
 *                             example: foo
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the notification.
 *                             example: 2024-08-09T17:27:50.700Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update timestamp of the notification.
 *                             example: 2024-08-09T17:27:50.700Z
 *                           image_url:
 *                             type: string
 *                             description: The URL of the notification image.
 *                             example: https://pnacademy-dev.s3.ap-south-1.amazonaws.com/notification-images/74276e6c-dfbf-4c9f-9ff7-e52bacb278bc.png
 *                           file_url:
 *                             type: string
 *                             description: The URL of the notification file.
 *                             example: https://pnacademy-dev.s3.ap-south-1.amazonaws.com/notification-files/f40e1fb8-e633-4dbc-8a81-9e47b15200e2.pdf
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
  "/assigned",
  authenticateUser(["canViewNotification"]),
  validateViewAssignedNotifications,
  validateRequest,
  viewAssignedNotificationsController
);

/**
 * @swagger
 * /v1/notification/group/search:
 *   get:
 *     summary: Search for groups based on the provided query.
 *     tags:
 *       - Group
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           example: hehe
 *         required: true
 *         description: The query string to search for groups. Can be a UUID or a search term.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
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
 *         description: A list of searched groups.
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
 *                       description: A list of groups.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the group.
 *                             example: caed107f-b90e-4488-a7f9-cc9319244c06
 *                           name:
 *                             type: string
 *                             description: The name of the group.
 *                             example: hehe
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the group.
 *                             example: 2024-11-01T14:59:46.314Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update timestamp of the group.
 *                             example: 2024-11-01T14:59:46.314Z
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
  "/group/search",
  authenticateUser(["canManageLocalGroup"]),
  validateGroupSearch,
  validateRequest,
  searchGroupsController
);

export default router;
