import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createQuestionCategory,
  createSurveyCategory,
  getQuestionCategories,
  getSurveyCategories,
} from "../controllers/categoriesController.js";

const router = express.Router();

// Protected routes
router.use(protect);

// for survey Categories
router.post("/createSurveyCategory", createSurveyCategory);
router.get("/getSurveyCategory", getSurveyCategories);

// for question Categories
router.post("/createQuestionCategory", createQuestionCategory);
router.get("/getQuestionCategory", getQuestionCategories);

export default router;
