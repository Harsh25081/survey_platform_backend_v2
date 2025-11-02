import prisma from "../config/db.js";
import { markTokenUsed } from "./shareController.js";

/**
 * ✅ Helper: Normalize and prepare answers based on question type
 */
const prepareAnswerData = async (answers) => {
  const preparedAnswers = [];

  for (const a of answers) {
    const question = await prisma.question.findUnique({
      where: { id: a.questionId },
      include: { category: true },
    });

    if (!question) continue;

    const type = question.category?.type_name?.toLowerCase() || "text";

    let answerValue = null;
    let scaleRatingValue = null;
    let mediaLinks = [];
    let selectedOptionIds = null;
    let gridAnswers = [];

    switch (type) {
      // ✅ TEXT TYPES
      case "short answer":
      case "paragraph":
        answerValue = a.answer_value || "";
        break;

      // ✅ SINGLE OPTION TYPES
      case "multiple choice":
      case "dropdown":
        selectedOptionIds = Array.isArray(a.answer_value)
          ? [a.answer_value[0]]
          : [a.answer_value];
        break;

      // ✅ MULTIPLE OPTION TYPES
      case "checkboxes":
        selectedOptionIds = Array.isArray(a.answer_value)
          ? a.answer_value
          : [a.answer_value];
        break;

      // ✅ LINEAR SCALE / RATING
      case "linear scale":
      case "rating":
        // You can store either numeric rating or optionId.
        selectedOptionIds = a.optionId || null;
        if (!selectedOptionIds)
          scaleRatingValue = Number(a.answer_value) || null;
        break;

      // ✅ GRID QUESTION TYPES
      case "multi-choice grid":
      case "checkbox grid":
        /**
         * Expect input like:
         * a.answer_value = [
         *   { rowOptionId: "row1", selectedColumns: ["col1", "col2"] },
         *   { rowOptionId: "row2", selectedColumns: ["col3"] }
         * ]
         */
        if (Array.isArray(a.answer_value)) {
          for (const row of a.answer_value) {
            const { rowOptionId, selectedColumns = [] } = row;
            for (const colId of selectedColumns) {
              gridAnswers.push({
                rowOptionId,
                columnOptionId: colId,
                selected: true,
              });
            }
          }
        }
        break;

      // ✅ FILE UPLOAD
      case "file upload":
        mediaLinks = a.media?.length ? a.media : [];
        break;

      // ✅ DATE / TIME
      case "date":
      case "time":
        answerValue = a.answer_value || null;
        break;

      default:
        answerValue = a.answer_value || "";
    }

    preparedAnswers.push({
      questionId: a.questionId,
      answer_type: type,
      answer_value: answerValue,
      media: mediaLinks,
      selected_option_ids: selectedOptionIds,
      scaleRatingValue,
      gridAnswers,
    });
  }

  return preparedAnswers;
};

/**
 * ✅ Main transaction for creating responses
 */
const createSurveyResponse = async (surveyId, user_metadata, answers) => {
  const formattedAnswers = await prepareAnswerData(answers);

  return await prisma.$transaction(async (tx) => {
    const response = await tx.response.create({
      data: {
        surveyId,
        user_metadata: user_metadata || {},
      },
    });

    for (const ans of formattedAnswers) {
      const resAnswer = await tx.responseAnswer.create({
        data: {
          responseId: response.id,
          questionId: ans.questionId,
          // answer_type: ans.answer_type,
          answer_value: JSON.stringify(ans.answer_value),
          // media: ans.media,
          selected_option_ids: ans.selected_option_ids,
          scaleRatingValue: ans.scaleRatingValue,
        },
      });

      // ✅ Handle grid data
      if (ans.gridAnswers?.length > 0) {
        await tx.gridResponseAnswer.createMany({
          data: ans.gridAnswers.map((g) => ({
            responseAnswerId: resAnswer.id,
            rowOptionId: g.rowOptionId,
            columnOptionId: g.columnOptionId,
            selected: g.selected,
          })),
        });
      }
    }

    // ✅ Return response with all nested data
    return tx.response.findUnique({
      where: { id: response.id },
      include: {
        response_answers: {
          include: {
            grid_answers: true,
            question: true,
          },
        },
      },
    });
  });
};

/**
 * Submit Response
 */
export const submitResponse = async (req, res) => {
  try {
    const { surveyId, user_metadata, answers } = req.body;
    if (!surveyId || !Array.isArray(answers))
      return res.status(400).json({ message: "Invalid payload" });

    const response = await createSurveyResponse(
      surveyId,
      user_metadata,
      answers
    );
    res.status(201).json({ message: "Response submitted", response });
  } catch (error) {
    console.error("Submit Response Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Submit Response with Token
 */
export const submitResponseWithToken = async (req, res) => {
  try {
    const { token, user_metadata, answers } = req.body;

    const shareToken = await prisma.shareToken.findFirst({
      where: { token_hash: token, used: false },
      include: { survey: true },
    });
    if (!shareToken)
      return res.status(400).json({ message: "Invalid or used token" });

    const response = await createSurveyResponse(
      shareToken.surveyId,
      user_metadata,
      answers
    );

    if (shareToken.recipient_email || shareToken.recipient_mobile)
      await markTokenUsed(token);

    res.status(201).json({ message: "Response submitted", response });
  } catch (error) {
    console.error("Submit Response With Token Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get Responses
 */
export const getResponsesBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: {
        response_answers: {
          include: {
            grid_answers: true,
            question: true,
          },
        },
      },
    });
    res.json({ responses });
  } catch (error) {
    console.error("Get Responses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// import prisma from "../config/db.js";
// import { markTokenUsed } from "./shareController.js";

// /**
//  * Submit Response
//  */
// export const submitResponse = async (req, res) => {
//   try {
//     const { surveyId, user_metadata, answers } = req.body;

//     // Create Response
//     const response = await prisma.response.create({
//       data: {
//         surveyId,
//         user_metadata: user_metadata || {},
//         response_answers: {
//           create: answers.map((a) => ({
//             questionId: a.questionId,
//             answer_type: a.answer_type,
//             answer_value: a.answer_value,
//             media: a.media || [],
//           })),
//         },
//       },
//       include: { response_answers: true },
//     });

//     res.status(201).json({ message: "Response submitted", response });
//   } catch (error) {
//     console.error("Submit Response Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Submit Response with a share token
//  */
// export const submitResponseWithToken = async (req, res) => {
//   try {
//     const { token, user_metadata, answers } = req.body;

//     // Validate share token
//     const shareToken = await prisma.shareToken.findFirst({
//       where: { token_hash: token, used: false },
//       include: { survey: true },
//     });

//     if (!shareToken)
//       return res.status(400).json({ message: "Invalid or used token" });

//     const surveyId = shareToken.surveyId;

//     // Create response
//     const response = await prisma.response.create({
//       data: {
//         surveyId,
//         user_metadata: user_metadata || {},
//         response_answers: {
//           create: answers.map((a) => ({
//             questionId: a.questionId,
//             answer_type: a.answer_type,
//             answer_value: a.answer_value,
//             media: a.media || [],
//           })),
//         },
//       },
//       include: { response_answers: true },
//     });

//     // Mark token as used (if personalized)
//     if (shareToken.recipient_email || shareToken.recipient_mobile) {
//       await markTokenUsed(token);
//     }

//     res.status(201).json({ message: "Response submitted", response });
//   } catch (error) {
//     console.error("Submit Response With Token Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get responses for a survey
//  */
// export const getResponsesBySurvey = async (req, res) => {
//   try {
//     const { surveyId } = req.params;

//     const responses = await prisma.response.findMany({
//       where: { surveyId },
//       include: { response_answers: true },
//     });

//     res.json({ responses });
//   } catch (error) {
//     console.error("Get Responses Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
