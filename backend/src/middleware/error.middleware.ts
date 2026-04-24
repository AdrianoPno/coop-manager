import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
