import prisma from "../config/db.js";

/**
 * Create Question
 */
export const createQuestion = async (req, res) => {
  try {
    const body = req.body;
    console.log(">>>>> the value of the BODY is : ", body);

    const {
      surveyId,
      question_type,
      question_text,
      mediaId,
      order_index,
      required = true,
      categoryId,
      options = [],
    } = body;

    // Prepare Question Data
    const questionData = {
      surveyId,
      question_type,
      question_text,
      order_index,
      required,
      categoryId,
    };
    if (mediaId) data.mediaId = mediaId;

    // Create Question
    const question = await prisma.question.create({
      data: questionData,
    });
    console.log(">>>>> the value of the QUESTION is : ", question);

    let optionRecords = [];

    // Step 3: Handle Options based on Category Type
    if (options && options.length > 0) {
      const category = await prisma.questionCategory.findUnique({
        where: { id: categoryId },
        select: { type_name: true },
      });
      console.log(">>>>> the value of the CATEGORY is : ", category);

      const categoryType = category?.type_name?.toLowerCase();
      console.log(">>>>>> the value of the CATEGORY TYPE is : ", categoryType);

      switch (categoryType) {
        // Short Answer or Paragraph — store text only
        // case "short answer":
        // case "paragraph":
        // Multiple Choice, Checkbox, Dropdown — store text and optional media
        case "multiple choice":
        case "checkboxes":
        case "dropdown":
          optionRecords = options.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
            mediaId: opt.mediaId || null,
          }));
          break;

        // Linear Scale / Rating — store scale values and labels
        case "linear scale":
        case "rating":
          // Expecting a single object for scale type
          if (options[0]) {
            const scale = options[0];
            optionRecords.push({
              questionId: question.id,
              rangeFrom: scale.rangeFrom,
              rangeTo: scale.rangeTo,
              fromLabel: scale.fromLabel,
              toLabel: scale.toLabel,
              icon: scale.icon,
            });
          }
          break;

        // Multi-choice grid or checkbox grid — need row and column mapping
        case "multi-choice grid":
        case "checkbox grid":
          const { rowOptions = [], columnOptions = [] } = options[0] || {};

          // Row options
          const rowOptionRecords = rowOptions.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
            rowQuestionOptionId: question.id, // links to this question as row
          }));

          // Column options
          const columnOptionRecords = columnOptions.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
            columnQuestionOptionId: question.id, // links to this question as column
          }));

          optionRecords = [...rowOptionRecords, ...columnOptionRecords];
          break;

        // File upload, Date, Time — store in text field or media as needed
        case "file upload":
          optionRecords = options.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
            mediaId: opt.mediaId || null,
          }));
          break;

        case "date":
        case "time":
          optionRecords = options.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
          }));
          break;

        default:
          // For safety fallback
          optionRecords = options.map((opt) => ({
            text: opt.text || "",
            questionId: question.id,
          }));
          break;
      }

      // Step 4: Bulk Create Options
      if (optionRecords.length > 0) {
        await prisma.option.createMany({
          data: optionRecords,
        });
      }
    }

    // Step 5: Return Response
    const questionWithOptions = await prisma.question.findUnique({
      where: { id: question.id },
      include: { options: true },
    });

    res.status(201).json({
      message: "Question created successfully",
      question: questionWithOptions,
    });

    // res.status(201).json({ message: "Question created", question });
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
      include: { options: true, mediaAsset: true, category: true },
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
