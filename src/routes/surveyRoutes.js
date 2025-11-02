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
// router.use(protect);

router.post(
  "/",
  protect,
  validateRequest(createSurveyValidation),
  createSurvey
);
router.get("/", protect, getSurveys);
router.get("/:id", getSurveyById);
router.put(
  "/:id",
  protect,
  validateRequest(updateSurveyValidation),
  updateSurvey
);
router.delete("/:id", protect, deleteSurvey);

export default router;
