import express from "express";
import type { Router } from "express";
import {
  CreateAssessmentController,
  CreateQuestionController,
  CreateTagController,
} from "../controller/assessment/assessment.controller";
import {
  validateAssessment,
  validateOption,
  validateQuestion,
  validateTag,
} from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";

const router: Router = express.Router();

router.post(
  "/create",
  validateAssessment,
  validateRequest,
  CreateAssessmentController
);
router.post(
  "/question",
  validateQuestion,
  validateRequest,
  CreateQuestionController
);
router.post(
  "/option",
  validateOption,
  validateRequest,
  CreateQuestionController
);
router.post("/tag", validateTag, validateRequest, CreateTagController);

export default router;
