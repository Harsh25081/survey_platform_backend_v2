import express from "express";
import {
  getAIQuestionsBySurvey,
  createAIQuestion,
  updateAIQuestion,
  deleteAIQuestion,
  approveAIQuestions,
  addAIQuestionsToSurvey,
} from "../controllers/aiQuestionController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  createAIGeneratedQuestionValidation,
  updateAIGeneratedQuestionValidation,
  approveAIQuestionValidation,
} from "../validations/validationSchemas.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();
router.use(protect);

// Get AI generated questions for a survey
router.get("/survey/:surveyId", getAIQuestionsBySurvey);

// Create AI generated question manually
router.post("/", validateRequest(createAIGeneratedQuestionValidation), createAIQuestion);

// Update AI generated question
router.put("/:id", validateRequest(updateAIGeneratedQuestionValidation), updateAIQuestion);

// Delete AI generated question
router.delete("/:id", deleteAIQuestion);

// Approve AI generated questions (with optional query param to add to survey)
router.post("/approve", validateRequest(approveAIQuestionValidation), approveAIQuestions);

// Add approved AI questions to survey
router.post("/survey/:surveyId/add", validateRequest(approveAIQuestionValidation), addAIQuestionsToSurvey);

export default router;
