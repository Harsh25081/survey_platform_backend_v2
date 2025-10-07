export default {
  "/api/responses": {
    post: {
      tags: ["Response"],
      summary: "Submit survey responses",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ResponseCreate" },
          },
        },
      },
      responses: {
        201: { description: "Response submitted" },
        400: { description: "Validation failed" },
      },
    },
  },
  "/api/responses/survey/{surveyId}": {
    get: {
      tags: ["Response"],
      summary: "Get all responses for a survey",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: { 200: { description: "List of responses" } },
    },
  },
  components: {
    schemas: {
      ResponseCreate: {
        type: "object",
        properties: {
          surveyId: { type: "string" },
          user_metadata: { type: "object" },
          answers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionId: { type: "string" },
                answer_type: { type: "string" },
                answer_value: { type: "string" },
                media: { type: "array", items: { type: "object" } },
              },
              required: ["questionId", "answer_type"],
            },
          },
        },
        required: ["surveyId", "answers"],
      },
    },
  },
  "/api/responses/submit-token": {
    post: {
      tags: ["Response"],
      summary: "Submit survey response using a share token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ResponseWithToken" },
          },
        },
      },
      responses: {
        201: { description: "Response submitted" },
        400: { description: "Invalid or used token" },
      },
    },
  },
  components: {
    schemas: {
      ResponseWithToken: {
        type: "object",
        properties: {
          token: { type: "string" },
          user_metadata: { type: "object" },
          answers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionId: { type: "string" },
                answer_type: { type: "string" },
                answer_value: { type: "string" },
                media: { type: "array", items: { type: "object" } },
              },
              required: ["questionId", "answer_type"],
            },
          },
        },
        required: ["token", "answers"],
      },
    },
  },
};
