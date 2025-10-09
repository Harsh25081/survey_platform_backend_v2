import swaggerUi from "swagger-ui-express";
import authDocs from "./authDocs.js";
import surveyDocs from "./surveyDocs.js";
import questionDocs from "./questionDocs.js";
import aiQuestionDocs from "./aiQuestionDocs.js";
import responseDocs from "./responseDocs.js";
import shareDocs from "./shareDocs.js";
import analyticsDocs from "./analyticsDocs.js";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Survey Platform API",
    version: "1.0.0",
    description: "API documentation for Survey Platform backend",
  },
  servers: [{ url: "http://localhost:5000" }],
  paths: {
    ...authDocs,
    ...surveyDocs,
    ...questionDocs,
    ...aiQuestionDocs,
    ...responseDocs,
    ...shareDocs,
    ...analyticsDocs,
  },
};

export const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
