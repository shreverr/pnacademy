import express from "express";
import type { Router } from "express";
import {
  CreateAssessmentController,
  CreateOptionController,
  CreateQuestionController,
  CreateTagController,
  UpdateAssessmentController,
  UpdateOptionController,
  UpdateQuestionController,
  UpdateTagController,
} from "../controller/assessment/assessment.controller";
import {
  validateAssessment,
  validateAssessmentUpdate,
  validateOption,
  validateOptionUpdate,
  validateQuestion,
  validateQuestionUpdate,
  validateTag,
  validateTagUpdate,
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
router.post("/option", validateOption, validateRequest, CreateOptionController);

router.post("/tag", validateTag, validateRequest, CreateTagController);

router.patch(
  "/update",
  validateAssessmentUpdate,
  validateRequest,
  UpdateAssessmentController
);

router.patch(
  "/question",
  validateQuestionUpdate,
  validateRequest,
  UpdateQuestionController
);

router.patch(
  "/option",
  validateOptionUpdate,
  validateRequest,
  UpdateOptionController
);

router.patch(
  "/tag", 
  validateTagUpdate, 
  validateRequest, 
  UpdateTagController
);

export default router;
