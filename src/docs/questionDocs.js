export default {
  "/api/questions": {
    post: {
      tags: ["Question"],
      summary: "Create a new question",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/QuestionCreate" },
          },
        },
      },
      responses: {
        201: { description: "Question created" },
        400: { description: "Validation failed" },
      },
    },
  },
  "/api/questions/survey/{surveyId}": {
    get: {
      tags: ["Question"],
      summary: "Get all questions for a survey",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: { 200: { description: "List of questions" } },
    },
  },
  "/api/questions/{id}": {
    put: {
      tags: ["Question"],
      summary: "Update a question",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/QuestionUpdate" },
          },
        },
      },
      responses: { 200: { description: "Question updated" } },
    },
    delete: {
      tags: ["Question"],
      summary: "Delete a question",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Question deleted" } },
    },
  },
  components: {
    schemas: {
      QuestionCreate: {
        type: "object",
        properties: {
          surveyId: { type: "string" },
          question_type: {
            type: "string",
            enum: [
              "TEXT",
              "MCQ",
              "RATING",
              "IMAGE",
              "VIDEO",
              "AUDIO",
              "FILE",
              "MATRIX",
            ],
          },
          question_text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          media: { type: "array", items: { type: "object" } },
          categoryId: { type: "string" },
          subCategoryId: { type: "string" },
          order_index: { type: "integer" },
          required: { type: "boolean" },
        },
        required: ["surveyId", "question_type", "question_text"],
      },
      QuestionUpdate: {
        type: "object",
        allOf: [{ $ref: "#/components/schemas/QuestionCreate" }],
      },
    },
  },
};
