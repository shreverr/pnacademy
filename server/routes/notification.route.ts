import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";

import { validateRequest } from "../utils/validateRequest";
import {
  CreateNotificationController,
  DeleteNotificationController,
  getAllNotificationsController,
} from "../controller/notification,/notification.controller";
import { upload } from "../middleware/multer";
import {
  validateNotification,
  validateNotificationDelete,
} from "../lib/validator/index";
import { validateGetAllNotifications } from "../lib/validator/notification/validator";

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

export default router;
