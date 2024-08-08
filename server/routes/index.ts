import { Router } from "express";
import userRouter from "./user.route";
import assessmenRouter from "./assessment.route";
import notificationRouter from "./notification.route";
import groupRouter from "./group.route";
const router: Router = Router();

router.use("/user", userRouter);
router.use("/assessment", assessmenRouter);
router.use("/notification", notificationRouter);
router.use(groupRouter);
export default router;
