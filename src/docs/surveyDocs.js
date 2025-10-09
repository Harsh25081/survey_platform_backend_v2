export default {
  "/api/surveys": {
    post: {
      tags: ["Survey"],
      summary: "Create a new survey",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SurveyCreate",
            },
          },
        },
      },
      responses: {
        201: { description: "Survey created successfully" },
        400: { description: "Validation failed" },
        401: { description: "Unauthorized" },
      },
    },
    get: {
      tags: ["Survey"],
      summary: "Get all surveys of logged-in user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "List of surveys" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/surveys/{id}": {
    get: {
      tags: ["Survey"],
      summary: "Get a single survey by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Survey details" },
        404: { description: "Survey not found" },
        401: { description: "Unauthorized" },
      },
    },
    put: {
      tags: ["Survey"],
      summary: "Update a survey by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SurveyUpdate" },
          },
        },
      },
      responses: {
        200: { description: "Survey updated" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["Survey"],
      summary: "Soft delete a survey by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Survey deleted" },
        401: { description: "Unauthorized" },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      SurveyCreate: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          flow_type: {
            type: "string",
            enum: ["STATIC", "INTERACTIVE", "GAME"],
          },
          survey_send_by: {
            type: "string",
            enum: ["WHATSAPP", "EMAIL", "BOTH", "NONE"],
          },
          settings: {
            type: "object",
            properties: {
              isAnonymous: { type: "boolean" },
              showProgressBar: { type: "boolean" },
              shuffleQuestions: { type: "boolean" },
            },
          },
          status: { type: "string", enum: ["DRAFT", "SCHEDULED", "PUBLISHED"] },
          scheduled_date: { type: "string", format: "date-time" },
          scheduled_type: { type: "string", enum: ["IMMEDIATE", "SCHEDULED"] },
          categoryOfSurvey: {
            type: "string",
            description: "Category of the survey for AI question generation",
          },
          autoGenerateQuestions: {
            type: "boolean",
            description: "Whether to automatically generate questions using AI",
          },
        },
        required: ["title"],
      },
      SurveyUpdate: {
        type: "object",
        allOf: [{ $ref: "#/components/schemas/SurveyCreate" }],
      },
    },
  },
};
