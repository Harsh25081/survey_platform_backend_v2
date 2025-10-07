import express from "express";
import { register, login } from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/validationSchemas.js";
const router = express.Router();

router.post("/signup", validateRequest(registerValidation), register);
router.post("/login", validateRequest(loginValidation), login);

export default router;
