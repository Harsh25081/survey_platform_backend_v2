export default {
  "/api/analytics/survey/{surveyId}": {
    get: {
      tags: ["Analytics"],
      summary: "Get survey-level analytics",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Survey analytics data" },
        404: { description: "Survey not found" },
      },
    },
  },
  "/api/analytics/survey/{surveyId}/questions/{questionId}": {
    get: {
      tags: ["Analytics"],
      summary: "Get question-level analytics for a survey",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        {
          name: "questionId",
          in: "path",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Question analytics data" },
        404: { description: "Survey not found" },
      },
    },
  },
  "/api/analytics/survey/{surveyId}/audience": {
    get: {
      tags: ["Analytics"],
      summary: "Get audience-level analytics",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "surveyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: { 200: { description: "Audience analytics data" } },
    },
  },
};
