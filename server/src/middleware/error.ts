import { Response, Request, NextFunction } from "express";
import CustomError from "../errors/CustomError";
import { ValidationError } from "joi";

const errorHandler = (
  error: ValidationError | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error.name === "ValidationError" && "details" in error) {
    return res.status(403).json({
      type: "ValidationError",
      details: error.details,
    });
  }

  if (error.name === "Error") {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
  }
  res.status(500).json({
    errorMsg: error,
    error: "Something went wrong!",
  });
};

export default errorHandler;
