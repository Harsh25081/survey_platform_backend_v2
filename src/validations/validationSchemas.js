import Joi from "joi";

/**
 * ✅ AUTH VALIDATIONS
 */
export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  mobile_no: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid("SYSTEM_ADMIN", "USER").optional(),
  theme: Joi.string().valid("LIGHT", "DARK").optional(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// -------- SURVEY --------
export const createSurveyValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  flow_type: Joi.string().valid("STATIC", "INTERACTIVE", "GAME").optional(),
  survey_send_by: Joi.string()
    .valid("WHATSAPP", "EMAIL", "BOTH", "NONE")
    .optional(),
  settings: Joi.object({
    isAnonymous: Joi.boolean().optional(),
    showProgressBar: Joi.boolean().optional(),
    shuffleQuestions: Joi.boolean().optional(),
  }).optional(),
  status: Joi.string().valid("DRAFT", "SCHEDULED", "PUBLISHED").optional(),
  scheduled_date: Joi.date().optional(),
  scheduled_type: Joi.string().valid("IMMEDIATE", "SCHEDULED").optional(),
});

export const updateSurveyValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  flow_type: Joi.string().valid("STATIC", "INTERACTIVE", "GAME").optional(),
  survey_send_by: Joi.string()
    .valid("WHATSAPP", "EMAIL", "BOTH", "NONE")
    .optional(),
  settings: Joi.object({
    isAnonymous: Joi.boolean().optional(),
    showProgressBar: Joi.boolean().optional(),
    shuffleQuestions: Joi.boolean().optional(),
  }).optional(),
  status: Joi.string().valid("DRAFT", "SCHEDULED", "PUBLISHED").optional(),
  scheduled_date: Joi.date().optional(),
  scheduled_type: Joi.string().valid("IMMEDIATE", "SCHEDULED").optional(),
});

// -------- QUESTIONS --------
export const createQuestionValidation = Joi.object({
  surveyId: Joi.string().uuid().required(),
  question_type: Joi.string()
    .valid("TEXT", "MCQ", "RATING", "IMAGE", "VIDEO", "AUDIO", "FILE", "MATRIX")
    .required(),
  question_text: Joi.string().min(1).max(500).required(),
  options: Joi.array().items(Joi.string()).required(),
  media: Joi.array()
    .items(
      Joi.object({
        type: Joi.string(),
        url: Joi.string(),
        thumbnail_url: Joi.string().optional(),
      })
    )
    .optional(),
  categoryId: Joi.string().uuid().required(),
  subCategoryId: Joi.string().uuid().required(),
  order_index: Joi.number().integer().optional(),
  required: Joi.boolean().optional(),
});

export const updateQuestionValidation = Joi.object({
  // question_type: Joi.string()
  //   .valid("TEXT", "MCQ", "RATING", "IMAGE", "VIDEO", "AUDIO", "FILE", "MATRIX")
  //   .optional(),
  question_text: Joi.string().min(1).max(500).optional(),
  options: Joi.array().items(Joi.string()).optional(),
  media: Joi.array()
    .items(
      Joi.object({
        type: Joi.string(),
        url: Joi.string(),
        thumbnail_url: Joi.string().optional(),
      })
    )
    .optional(),
  categoryId: Joi.string().uuid().optional(),
  subCategoryId: Joi.string().uuid().optional(),
  order_index: Joi.number().integer().optional(),
  required: Joi.boolean().optional(),
});

// -------- RESPONSES --------
export const createResponseValidation = Joi.object({
  surveyId: Joi.string().uuid().required(),
  user_metadata: Joi.object().optional(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().uuid().required(),
        answer_type: Joi.string().required(),
        answer_value: Joi.string().allow(null, ""),
        media: Joi.array()
          .items(Joi.object({ type: Joi.string(), url: Joi.string() }))
          .optional(),
      })
    )
    .required(),
});

export const createResponseWithTokenValidation = Joi.object({
  token: Joi.string().required(),
  user_metadata: Joi.object().optional(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().uuid().required(),
        answer_type: Joi.string().required(),
        answer_value: Joi.string().allow(null, ""),
        media: Joi.array()
          .items(Joi.object({ type: Joi.string(), url: Joi.string() }))
          .optional(),
      })
    )
    .required(),
});

// -------- SHARE --------
export const shareSurveyValidation = Joi.object({
  surveyId: Joi.string().uuid().required(),
  type: Joi.string().valid("PUBLIC", "PERSONALIZED").required(),
  recipients: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().optional(),
        mobile_no: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .optional(),
      })
    )
    .when("type", {
      is: "PERSONALIZED",
      then: Joi.required().messages({
        "any.required": "Recipients are required for PERSONALIZED sharing",
      }),
      otherwise: Joi.optional(),
    }),
});

// -------- ANALYTICS --------
export const surveyAnalyticsValidation = Joi.object({
  surveyId: Joi.string().uuid().required(),
});

export const questionAnalyticsValidation = Joi.object({
  surveyId: Joi.string().uuid().required(),
  questionId: Joi.string().uuid().optional(), // if omitted, return all questions analytics
});
