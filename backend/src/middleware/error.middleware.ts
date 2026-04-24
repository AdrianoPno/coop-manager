import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ValidationError } from "../utils/ValidationError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(`[ERROR] ${req.method} ${req.url}:`, error);

  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor.",
  });
};
