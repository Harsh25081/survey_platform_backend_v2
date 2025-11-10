import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSurveyResults,
  getSurveyResultsSummary,
  getQuestionResults,
  exportSurveyResults,
  getResponseDetails,
  getFilteredResponses,
} from "../controllers/surveyResultsController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/survey-results/:surveyId
 * @desc    Get survey results with pagination and filters
 * @access  Private
 * @query   page, limit, startDate, endDate, questionId, sortBy, sortOrder
 */
router.get("/:surveyId", getSurveyResults);

/**
 * @route   GET /api/survey-results/:surveyId/summary
 * @desc    Get survey results summary with statistics
 * @access  Private
 */
router.get("/:surveyId/summary", getSurveyResultsSummary);

/**
 * @route   GET /api/survey-results/:surveyId/questions/:questionId
 * @desc    Get question-wise results with answer distribution
 * @access  Private
 */
router.get("/:surveyId/questions/:questionId", getQuestionResults);

/**
 * @route   GET /api/survey-results/:surveyId/export
 * @desc    Export survey results in CSV or JSON format
 * @access  Private
 * @query   format (csv or json)
 */
router.get("/:surveyId/export", exportSurveyResults);

/**
 * @route   GET /api/survey-results/:surveyId/responses/:responseId
 * @desc    Get detailed response information
 * @access  Private
 */
router.get("/:surveyId/responses/:responseId", getResponseDetails);

/**
 * @route   GET /api/survey-results/:surveyId/filtered
 * @desc    Get responses filtered by answer value
 * @access  Private
 * @query   questionId, answerValue, page, limit
 */
router.get("/:surveyId/filtered", getFilteredResponses);

export default router;

