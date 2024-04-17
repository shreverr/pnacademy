import express from 'express'
import type { Router } from 'express'
import {
  CreateAssessmentController,
  CreateQuestionController
} from '../controller/assessment/assessment.controller'
import { validateAssessment, validateOption, validateQuestion } from '../lib/validator'
import { validateRequest } from '../utils/validateRequest'

const router: Router = express.Router()

router.post(
  '/create',
  validateAssessment,
  validateRequest,
  CreateAssessmentController
)
router.post(
  '/question',
  validateQuestion,
  validateRequest,
  CreateQuestionController
)
router.post(
  '/option',
  validateOption,
  validateRequest,
  CreateQuestionController
)

export default router
