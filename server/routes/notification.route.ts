import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";
import {
  validateNotification,
  validateNotificationDelete,
} from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";
import {
  CreateNotificationController,
  DeleteNotificationController,
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

export default router;
