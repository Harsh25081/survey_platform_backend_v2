import prisma from "../config/db.js";

/**
 * Get AI generated questions for a survey
 */
export const getAIQuestionsBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    // Verify survey belongs to user
    const survey = await prisma.survey.findFirst({
      where: { id: surveyId, userId: req.user.id, is_deleted: false },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found or not authorized" });
    }

    const aiQuestions = await prisma.aIGeneratedQuestion.findMany({
      where: { surveyId },
      orderBy: { order_index: "asc" },
    });

    res.json({ aiQuestions });
  } catch (error) {
    console.error("Get AI Questions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create AI generated question manually
 */
export const createAIQuestion = async (req, res) => {
  try {
    const data = req.body;

    // Verify survey belongs to user
    const survey = await prisma.survey.findFirst({
      where: { id: data.surveyId, userId: req.user.id, is_deleted: false },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found or not authorized" });
    }

    const aiQuestion = await prisma.aIGeneratedQuestion.create({
      data: {
        ...data,
        surveyId: data.surveyId,
      },
    });

    res.status(201).json({ message: "AI question created", aiQuestion });
  } catch (error) {
    console.error("Create AI Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update AI generated question
 */
export const updateAIQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Verify question belongs to user's survey
    const aiQuestion = await prisma.aIGeneratedQuestion.findFirst({
      where: { 
        id,
        survey: {
          userId: req.user.id,
          is_deleted: false
        }
      },
    });

    if (!aiQuestion) {
      return res.status(404).json({ message: "AI question not found or not authorized" });
    }

    const updatedQuestion = await prisma.aIGeneratedQuestion.update({
      where: { id },
      data,
    });

    res.json({ message: "AI question updated", aiQuestion: updatedQuestion });
  } catch (error) {
    console.error("Update AI Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete AI generated question
 */
export const deleteAIQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify question belongs to user's survey
    const aiQuestion = await prisma.aIGeneratedQuestion.findFirst({
      where: { 
        id,
        survey: {
          userId: req.user.id,
          is_deleted: false
        }
      },
    });

    if (!aiQuestion) {
      return res.status(404).json({ message: "AI question not found or not authorized" });
    }

    await prisma.aIGeneratedQuestion.delete({ where: { id } });

    res.json({ message: "AI question deleted" });
  } catch (error) {
    console.error("Delete AI Question Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Approve AI generated questions and optionally add them to the survey
 */
export const approveAIQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    const { addToSurvey = false } = req.query;

    // Verify all questions belong to user's surveys
    const aiQuestions = await prisma.aIGeneratedQuestion.findMany({
      where: { 
        id: { in: questionIds },
        survey: {
          userId: req.user.id,
          is_deleted: false
        }
      },
      include: { survey: true }
    });

    if (aiQuestions.length !== questionIds.length) {
      return res.status(404).json({ message: "Some questions not found or not authorized" });
    }

    // Update approval status
    await prisma.aIGeneratedQuestion.updateMany({
      where: { id: { in: questionIds } },
      data: { 
        is_approved: true,
        is_added_to_survey: addToSurvey === 'true'
      },
    });

    // If addToSurvey is true, create actual questions
    if (addToSurvey === 'true') {
      const questionsToCreate = aiQuestions.map(aiQ => ({
        surveyId: aiQ.surveyId,
        question_type: aiQ.question_type,
        question_text: aiQ.question_text,
        options: aiQ.options,
        order_index: aiQ.order_index,
        required: aiQ.required,
      }));

      await prisma.question.createMany({
        data: questionsToCreate,
      });

      // Update survey question count
      for (const aiQ of aiQuestions) {
        await prisma.survey.update({
          where: { id: aiQ.surveyId },
          data: {
            no_of_questions: {
              increment: 1
            }
          }
        });
      }
    }

    res.json({ 
      message: `${questionIds.length} questions approved${addToSurvey === 'true' ? ' and added to survey' : ''}`,
      approvedCount: questionIds.length
    });
  } catch (error) {
    console.error("Approve AI Questions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Bulk add approved AI questions to survey
 */
export const addAIQuestionsToSurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { questionIds } = req.body;

    // Verify survey belongs to user
    const survey = await prisma.survey.findFirst({
      where: { id: surveyId, userId: req.user.id, is_deleted: false },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found or not authorized" });
    }

    // Get approved AI questions
    const aiQuestions = await prisma.aIGeneratedQuestion.findMany({
      where: { 
        id: { in: questionIds },
        surveyId,
        is_approved: true,
        is_added_to_survey: false
      },
    });

    if (aiQuestions.length === 0) {
      return res.status(400).json({ message: "No approved questions found to add" });
    }

    // Create actual questions
    const questionsToCreate = aiQuestions.map(aiQ => ({
      surveyId: aiQ.surveyId,
      question_type: aiQ.question_type,
      question_text: aiQ.question_text,
      options: aiQ.options,
      order_index: aiQ.order_index,
      required: aiQ.required,
    }));

    await prisma.question.createMany({
      data: questionsToCreate,
    });

    // Mark AI questions as added
    await prisma.aIGeneratedQuestion.updateMany({
      where: { id: { in: questionIds } },
      data: { is_added_to_survey: true },
    });

    // Update survey question count
    await prisma.survey.update({
      where: { id: surveyId },
      data: {
        no_of_questions: {
          increment: aiQuestions.length
        }
      }
    });

    res.json({ 
      message: `${aiQuestions.length} questions added to survey`,
      addedCount: aiQuestions.length
    });
  } catch (error) {
    console.error("Add AI Questions to Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
