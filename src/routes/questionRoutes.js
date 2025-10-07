import express from "express";
import {
  createQuestion,
  getQuestionsBySurvey,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  createQuestionValidation,
  updateQuestionValidation,
} from "../validations/validationSchemas.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();
router.use(protect);

router.post("/", validateRequest(createQuestionValidation), createQuestion);
router.get("/survey/:surveyId", getQuestionsBySurvey);
router.put("/:id", validateRequest(updateQuestionValidation), updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;
