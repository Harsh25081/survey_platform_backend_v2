import prisma from "../config/db.js";

/**
 * Create a new survey
 */
export const createSurvey = async (req, res) => {
  try {
    const {
      title,
      description,
      flow_type,
      survey_send_by,
      settings,
      status,
      scheduled_date,
      scheduled_type,
    } = req.body;

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        flow_type: flow_type || "STATIC",
        survey_send_by: survey_send_by || "NONE",
        settings: settings || {},
        status: status || "DRAFT",
        scheduled_date: scheduled_date || null,
        scheduled_type: scheduled_type || "IMMEDIATE",
        userId: req.user.id, // comes from JWT middleware
      },
    });

    res.status(201).json({ message: "Survey created", survey });
  } catch (error) {
    console.error("Create Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all surveys of logged-in user
 */
export const getSurveys = async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      where: { userId: req.user.id, is_deleted: false },
      orderBy: { created_at: "desc" },
    });

    res.json({ surveys });
  } catch (error) {
    console.error("Get Surveys Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single survey by ID
 */
export const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.findFirst({
      where: { id, userId: req.user.id, is_deleted: false },
    });

    if (!survey) return res.status(404).json({ message: "Survey not found" });

    res.json({ survey });
  } catch (error) {
    console.error("Get Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update survey
 */
export const updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.updateMany({
      where: { id, userId: req.user.id, is_deleted: false },
      data: req.body,
    });

    if (survey.count === 0)
      return res
        .status(404)
        .json({ message: "Survey not found or not authorized" });

    res.json({ message: "Survey updated" });
  } catch (error) {
    console.error("Update Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete survey (soft delete)
 */
export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.updateMany({
      where: { id, userId: req.user.id, is_deleted: false },
      data: { is_deleted: true },
    });

    if (survey.count === 0)
      return res
        .status(404)
        .json({ message: "Survey not found or not authorized" });

    res.json({ message: "Survey deleted" });
  } catch (error) {
    console.error("Delete Survey Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
