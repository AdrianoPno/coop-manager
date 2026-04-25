import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "../utils/AppError";

type Role = "SUPER" | "ADMIN" | "USER";

/**
 * Middleware factory para verificar se o usuário possui uma das roles permitidas.
 * @param allowedRoles - Um array de roles que têm permissão para acessar a rota.
 */
export const checkRoles = (allowedRoles: Array<Role>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    next();
  };
};
