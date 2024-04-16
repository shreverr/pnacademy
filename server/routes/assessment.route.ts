import express from "express";
import type { Router } from "express";
import { CreateAssessmentController } from "../controller/assessment/assessment.controller";
import { validateAssessment } from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";

const router: Router = express.Router();
router.post(
  "/create",
  validateAssessment,
  validateRequest,
  CreateAssessmentController
);

export default router;
