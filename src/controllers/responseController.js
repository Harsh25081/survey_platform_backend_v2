import prisma from "../config/db.js";
import { markTokenUsed } from "./shareController.js";

/**
 * Submit Response
 */
export const submitResponse = async (req, res) => {
  try {
    const { surveyId, user_metadata, answers } = req.body;

    // Create Response
    const response = await prisma.response.create({
      data: {
        surveyId,
        user_metadata: user_metadata || {},
        response_answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            answer_type: a.answer_type,
            answer_value: a.answer_value,
            media: a.media || [],
          })),
        },
      },
      include: { response_answers: true },
    });

    res.status(201).json({ message: "Response submitted", response });
  } catch (error) {
    console.error("Submit Response Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Submit Response with a share token
 */
export const submitResponseWithToken = async (req, res) => {
  try {
    const { token, user_metadata, answers } = req.body;

    // Validate share token
    const shareToken = await prisma.shareToken.findFirst({
      where: { token_hash: token, used: false },
      include: { survey: true },
    });

    if (!shareToken)
      return res.status(400).json({ message: "Invalid or used token" });

    const surveyId = shareToken.surveyId;

    // Create response
    const response = await prisma.response.create({
      data: {
        surveyId,
        user_metadata: user_metadata || {},
        response_answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            answer_type: a.answer_type,
            answer_value: a.answer_value,
            media: a.media || [],
          })),
        },
      },
      include: { response_answers: true },
    });

    // Mark token as used (if personalized)
    if (shareToken.recipient_email || shareToken.recipient_mobile) {
      await markTokenUsed(token);
    }

    res.status(201).json({ message: "Response submitted", response });
  } catch (error) {
    console.error("Submit Response With Token Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get responses for a survey
 */
export const getResponsesBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: { response_answers: true },
    });

    res.json({ responses });
  } catch (error) {
    console.error("Get Responses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
