import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  surveyAnalyticsValidation,
  questionAnalyticsValidation,
} from "../validations/validationSchemas.js";
import {
  getSurveyAnalytics,
  getQuestionAnalytics,
  getAudienceAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();
router.use(protect);

router.get(
  "/survey/:surveyId",
  validateRequest(surveyAnalyticsValidation, "params"),
  getSurveyAnalytics
);
router.get(
  "/survey/:surveyId/questions/:questionId?",
  validateRequest(questionAnalyticsValidation, "params"),
  getQuestionAnalytics
);
router.get(
  "/survey/:surveyId/audience",
  validateRequest(surveyAnalyticsValidation, "params"),
  getAudienceAnalytics
);

export default router;
