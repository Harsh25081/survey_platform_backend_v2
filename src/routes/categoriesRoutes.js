import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createQuestionCategory,
  createSurveyCategory,
  getSurveyCategories,
} from "../controllers/categoriesController.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/createSurveyCategory", createSurveyCategory);
router.get("/getSurveyCategory", getSurveyCategories);
// router.get("/validate/:token", validateToken);

router.post("/createQuestionCategory", createQuestionCategory);
// router.get("/getSurveyCategory", getSurveyCategories);

export default router;
