import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { shareSurveyValidation } from "../validations/validationSchemas.js";
import { shareSurvey, validateToken } from "../controllers/shareController.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/", validateRequest(shareSurveyValidation), shareSurvey);
router.get("/validate/:token", validateToken);

export default router;
