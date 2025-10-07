import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createSurveyValidation,
  updateSurveyValidation,
} from "../validations/validationSchemas.js";
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} from "../controllers/surveyController.js";

const router = express.Router();

// All routes protected with JWT
router.use(protect);

router.post("/", validateRequest(createSurveyValidation), createSurvey);
router.get("/", getSurveys);
router.get("/:id", getSurveyById);
router.put("/:id", validateRequest(updateSurveyValidation), updateSurvey);
router.delete("/:id", deleteSurvey);

export default router;
