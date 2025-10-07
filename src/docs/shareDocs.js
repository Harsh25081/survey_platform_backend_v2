export default {
  "/api/share/share": {
    post: {
      tags: ["Share"],
      summary: "Share survey publicly or with personalized recipients",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ShareSurvey" },
          },
        },
      },
      responses: {
        200: { description: "Survey shared" },
        400: { description: "Validation failed" },
      },
    },
  },
  "/api/share/validate/{token}": {
    get: {
      tags: ["Share"],
      summary: "Validate survey token and get survey info",
      parameters: [
        {
          name: "token",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Token valid" },
        404: { description: "Invalid or used token" },
      },
    },
  },
  components: {
    schemas: {
      ShareSurvey: {
        type: "object",
        properties: {
          surveyId: { type: "string" },
          type: { type: "string", enum: ["PUBLIC", "PERSONALIZED"] },
          recipients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                email: { type: "string" },
                mobile_no: { type: "string" },
              },
            },
          },
        },
        required: ["surveyId", "type"],
      },
    },
  },
};
