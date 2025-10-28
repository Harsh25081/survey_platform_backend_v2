export default {
  "/api/ai-questions/survey/{surveyId}": {
    get: {
      tags: ["AI Questions"],
      summary: "Get AI generated questions for a survey",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Survey ID",
        },
      ],
      responses: {
        200: { 
          description: "List of AI generated questions",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  aiQuestions: {
                    type: "array",
                    items: { $ref: "#/components/schemas/AIGeneratedQuestion" }
                  }
                }
              }
            }
          }
        },
        404: { description: "Survey not found" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/ai-questions": {
    post: {
      tags: ["AI Questions"],
      summary: "Create AI generated question manually",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AIQuestionCreate" },
          },
        },
      },
      responses: {
        201: { description: "AI question created successfully" },
        400: { description: "Validation failed" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/ai-questions/{id}": {
    put: {
      tags: ["AI Questions"],
      summary: "Update AI generated question",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "AI Question ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AIQuestionUpdate" },
          },
        },
      },
      responses: {
        200: { description: "AI question updated successfully" },
        404: { description: "AI question not found" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["AI Questions"],
      summary: "Delete AI generated question",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "AI Question ID",
        },
      ],
      responses: {
        200: { description: "AI question deleted successfully" },
        404: { description: "AI question not found" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/ai-questions/approve": {
    post: {
      tags: ["AI Questions"],
      summary: "Approve AI generated questions",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "addToSurvey",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          description: "Whether to add approved questions to survey",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                questionIds: {
                  type: "array",
                  items: { type: "string" },
                  description: "Array of AI question IDs to approve"
                }
              },
              required: ["questionIds"]
            },
          },
        },
      },
      responses: {
        200: { description: "Questions approved successfully" },
        404: { description: "Some questions not found" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/ai-questions/survey/{surveyId}/add": {
    post: {
      tags: ["AI Questions"],
      summary: "Add approved AI questions to survey",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Survey ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                questionIds: {
                  type: "array",
                  items: { type: "string" },
                  description: "Array of approved AI question IDs to add"
                }
              },
              required: ["questionIds"]
            },
          },
        },
      },
      responses: {
        200: { description: "Questions added to survey successfully" },
        400: { description: "No approved questions found" },
        404: { description: "Survey not found" },
        401: { description: "Unauthorized" },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      AIGeneratedQuestion: {
        type: "object",
        properties: {
          id: { type: "string" },
          surveyId: { type: "string" },
          question_type: {
            type: "string",
            enum: ["TEXT", "MCQ", "RATING", "IMAGE", "VIDEO", "AUDIO", "FILE", "MATRIX"],
          },
          question_text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          order_index: { type: "integer" },
          required: { type: "boolean" },
          ai_prompt: { type: "string" },
          ai_model: { type: "string" },
          confidence_score: { type: "number" },
          is_approved: { type: "boolean" },
          is_added_to_survey: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      AIQuestionCreate: {
        type: "object",
        properties: {
          surveyId: { type: "string" },
          question_type: {
            type: "string",
            enum: ["TEXT", "MCQ", "RATING", "IMAGE", "VIDEO", "AUDIO", "FILE", "MATRIX"],
          },
          question_text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          order_index: { type: "integer" },
          required: { type: "boolean" },
          ai_prompt: { type: "string" },
          ai_model: { type: "string" },
          confidence_score: { type: "number" },
        },
        required: ["surveyId", "question_type", "question_text"],
      },
      AIQuestionUpdate: {
        type: "object",
        properties: {
          question_type: {
            type: "string",
            enum: ["TEXT", "MCQ", "RATING", "IMAGE", "VIDEO", "AUDIO", "FILE", "MATRIX"],
          },
          question_text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          order_index: { type: "integer" },
          required: { type: "boolean" },
          is_approved: { type: "boolean" },
          is_added_to_survey: { type: "boolean" },
        },
      },
    },
  },
};
