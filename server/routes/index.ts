import { Router } from "express";
import userRouter from "./user.route";
import notificationRouter from "./notification.route";
import groupRouter from "./group.route";
import assessmentRouter from "./assessment.route";

const router: Router = Router();

router.use("/v1/user", userRouter);
router.use("/v1/notification", notificationRouter);
router.use("/v2/assessments", assessmentRouter);
router.use("/v1", groupRouter);
export default router;
