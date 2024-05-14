import { Router } from "express";
import userRouter from "./user.route";
import assessmenRouter from "./assessment.route";
import notificationRouter from "./notification.route";
const router: Router = Router();

router.use("/user", userRouter);
router.use("/assessment", assessmenRouter);
router.use("/notification", notificationRouter);
export default router;
