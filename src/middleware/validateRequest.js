export default function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("Validation error:", error.details);
      const details = error.details.map((d) => d.message);
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: details,
      });
    }
    next();
  };
}
