import { RequestHandler, ErrorRequestHandler } from "express";

// Specify that it's an error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "ValidationError" && "details" in err) {
    res.status(403).json({
      type: "ValidationError",
      details: err.details,
    });
    return; // Early exit after responding
  }

  if (err.name === "Error") {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
    return; // Early exit after responding
  }

  // Default error response
  res.status(500).json({
    errorMsg: err,
    error: "Something went wrong!",
  });
};

export default errorHandler;
