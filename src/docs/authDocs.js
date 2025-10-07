/**
 * Swagger definitions for Auth APIs
 */

export default {
  "/api/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                mobile_no: { type: "string" },
                password: { type: "string" },
                role: { type: "string", enum: ["SYSTEM_ADMIN", "USER"] },
              },
              required: ["name", "email", "password"],
            },
          },
        },
      },
      responses: {
        201: { description: "User registered successfully" },
        400: { description: "User already exists or invalid data" },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login a user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: { description: "Login successful" },
        400: { description: "Invalid credentials" },
      },
    },
  },
};
