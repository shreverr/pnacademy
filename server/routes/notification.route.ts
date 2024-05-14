import express from "express";
import type { Router } from "express";
import { authenticateUser } from "../middleware/Auth";
import { validateGroup, validateNotification, validateNotificationDelete } from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";
import { CreateGroupController, CreateNotificationController, DeleteNotificationController } from "../controller/notification,/notification.controller";

const router: Router = express.Router();

router.post(
    "/create-notification",
    authenticateUser(['canManageNotification']),
    validateNotification,
    validateRequest,
    CreateNotificationController

)

router.delete(
    "/delete-notification",
    authenticateUser(['canManageNotification']),
    validateNotificationDelete,
    validateRequest,
    DeleteNotificationController
)

router.post(
    "/create-group",
    authenticateUser(['canManageLocalGroup']),
    validateGroup,
    validateRequest,
    CreateGroupController
) 


export default router