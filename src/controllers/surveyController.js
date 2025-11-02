import prisma from "../config/db.js";
import {
  generateSurveyQuestions,
  generateFallbackQuestions,
} from "../utils/openaiService.js";

/**
 * Create a new survey
 */
export const createSurvey = async (req, res) => {
  try {
    const {
      title,
      description,
      flow_type,
      survey_send_by,
      settings,
      status,
      scheduled_date,
      scheduled_type,
      surveyCategoryId,
      autoGenerateQuestions,
    } = req.body;

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        userId: req.user.id, // comes from JWT middleware
        survey_send_by: survey_send_by || "NONE",
        flow_type: flow_type || "STATIC",
        settings: settings || {},
        status: status || "DRAFT",
        scheduled_date: scheduled_date || null,
        scheduled_type: scheduled_type || "IMMEDIATE",
        surveyCategoryId: surveyCategoryId || null,
        autoGenerateQuestions: autoGenerateQuestions || false,
      },
    });

    let aiGeneratedQuestions = [];
    let aiGenerationError = null;

    // Generate AI questions if requested
    if (autoGenerateQuestions) {
      try {
        const surveyData = {
          title,
          description,
          categoryOfSurvey,
        };

        // Try to generate questions using OpenAI
        const generatedQuestions = await generateSurveyQuestions(surveyData, 5);

        // Save generated questions to database
        const questionsToCreate = generatedQuestions.map((question, index) => ({
          surveyId: survey.id,
          question_type: question.question_type,
          question_text: question.question_text,
          options: question.options || [],
          order_index: index + 1,
          required: question.required || true,
          ai_prompt: question.ai_prompt,
          ai_model: question.ai_model,
          confidence_score: question.confidence_score,
        }));

        aiGeneratedQuestions = await prisma.aIGeneratedQuestion.createMany({
          data: questionsToCreate,
        });

        // Fetch the created questions to return in response
        aiGeneratedQuestions = await prisma.aIGeneratedQuestion.findMany({
          where: { surveyId: survey.id },
          orderBy: { order_index: "asc" },
        });
      } catch (aiError) {
        console.error("AI Question Generation Error:", aiError);
        aiGenerationError = aiError.message;

        // Generate fallback questions
        try {
          const fallbackQuestions = generateFallbackQuestions(
            { title, categoryOfSurvey },
            5
          );

          const questionsToCreate = fallbackQuestions.map(
            (question, index) => ({
              surveyId: survey.id,
              question_type: question.question_type,
              question_text: question.question_text,
              options: question.options || [],
              order_index: index + 1,
              required: question.required || true,
              ai_prompt: question.ai_prompt,
              ai_model: question.ai_model,
              confidence_score: question.confidence_score,
            })
          );

          await prisma.aIGeneratedQuestion.createMany({
            data: questionsToCreate,
          });

          aiGeneratedQuestions = await prisma.aIGeneratedQuestion.findMany({
            where: { surveyId: survey.id },
            orderBy: { order_index: "asc" },
          });
        } catch (fallbackError) {
          console.error("Fallback Question Generation Error:", fallbackError);
        }
      }
    }

    const response = {
      message: "Survey created",
      survey,
      ...(autoGenerateQuestions && {
        aiGeneratedQuestions,
        ...(aiGenerationError && { aiGenerationWarning: aiGenerationError }),
      }),
    };
    console.log("Create Survey Response:", response);

    res.status(201).json(response);
  } catch (error) {
    console.error("Create Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all surveys of logged-in user
 */
export const getSurveys = async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      where: { userId: req.user.id, is_deleted: false },
      orderBy: { created_at: "desc" },
      include: { questions: true },
    });

    res.json({ surveys });
  } catch (error) {
    console.error("Get Surveys Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single survey by ID
 */
export const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.findFirst({
      where: { id, is_deleted: false },
      include: { questions: true },
    });

    if (!survey) return res.status(404).json({ message: "Survey not found" });

    res.json({ survey });
  } catch (error) {
    console.error("Get Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update survey
 */
export const updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.updateMany({
      where: { id, userId: req.user.id, is_deleted: false },
      data: req.body,
    });

    if (survey.count === 0)
      return res
        .status(404)
        .json({ message: "Survey not found or not authorized" });

    res.json({ message: "Survey updated" });
  } catch (error) {
    console.error("Update Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete survey (soft delete)
 */
export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.updateMany({
      where: { id, userId: req.user.id, is_deleted: false },
      data: { is_deleted: true },
    });

    if (survey.count === 0)
      return res
        .status(404)
        .json({ message: "Survey not found or not authorized" });

    res.json({ message: "Survey deleted" });
  } catch (error) {
    console.error("Delete Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
