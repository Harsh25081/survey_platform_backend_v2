import prisma from "../config/db.js";

/**
 * Get survey-level analytics
 */
export const getSurveyAnalytics = async (req, res) => {
  try {
    const { surveyId } = req.params;

    // Check survey exists
    const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    // Total responses
    const totalResponses = await prisma.response.count({ where: { surveyId } });

    // Total questions
    const totalQuestions = await prisma.question.count({ where: { surveyId } });

    // Optional: calculate average completion rate
    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: { response_answers: true },
    });

    const avgCompletionRate =
      responses.length === 0
        ? 0
        : responses.reduce(
            (acc, r) => acc + r.response_answers.length / totalQuestions,
            0
          ) / responses.length;

    res.json({ surveyId, totalResponses, totalQuestions, avgCompletionRate });
  } catch (error) {
    console.error("Survey Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get question-level analytics
 */
export const getQuestionAnalytics = async (req, res) => {
  try {
    const { surveyId, questionId } = req.params;

    let questions;
    if (questionId) {
      questions = await prisma.question.findMany({
        where: { id: questionId, surveyId },
        include: { response_answers: true },
      });
    } else {
      questions = await prisma.question.findMany({
        where: { surveyId },
        include: { response_answers: true },
      });
    }

    const analytics = questions.map((q) => {
      const totalAnswers = q.response_answers.length;

      const answerDistribution = {};
      q.response_answers.forEach((a) => {
        const key = a.answer_value || "N/A";
        answerDistribution[key] = (answerDistribution[key] || 0) + 1;
      });

      return {
        questionId: q.id,
        question_text: q.question_text,
        totalAnswers,
        answerDistribution,
      };
    });

    res.json({ surveyId, analytics });
  } catch (error) {
    console.error("Question Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get audience-level analytics
 */
export const getAudienceAnalytics = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const totalAudience = await prisma.surveyAudience.count({
      where: { surveyId },
    });

    const respondedAudience = await prisma.response.count({
      where: { surveyId },
    });

    res.json({
      surveyId,
      totalAudience,
      respondedAudience,
      responseRate:
        totalAudience === 0 ? 0 : (respondedAudience / totalAudience) * 100,
    });
  } catch (error) {
    console.error("Audience Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
