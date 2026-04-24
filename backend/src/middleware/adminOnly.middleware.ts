import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "../utils/AppError";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Este middleware deve ser executado após o authMiddleware.
  if (!req.user || req.user.role !== "ADMIN") {
    throw new AppError("Acesso restrito a administradores.", 403);
  }

  return next();
};
