import prisma from "../config/db.js";

/**
 * Create Question
 */
export const createQuestion = async (req, res) => {
  try {
    const data = req.body;

    const question = await prisma.question.create({
      data: {
        ...data,
        surveyId: data.surveyId,
      },
    });

    res.status(201).json({ message: "Question created", question });
  } catch (error) {
    console.error("Create Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all questions of a survey
 */
export const getQuestionsBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const questions = await prisma.question.findMany({
      where: { surveyId },
      orderBy: { order_index: "asc" },
    });

    res.json({ questions });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update question
 */
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.update({
      where: { id },
      data: req.body,
    });

    res.json({ message: "Question updated", question });
  } catch (error) {
    console.error("Update Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete question
 */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({ where: { id } });

    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Delete Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
