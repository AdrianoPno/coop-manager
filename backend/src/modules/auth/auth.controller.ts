import { Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";

const usersService = new UsersService();

export class AuthController {
  /**
   * Retorna os dados do usuário logado (Perfil + Unidade)
   * Útil para o "Me" ou "VerifySession" no Frontend
   */
  // backend/src/modules/auth/auth.controller.ts

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Perfil não carregado" });
      }

      // Retorna os dados que o middleware buscou no Firestore
      return res.json(req.user);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao buscar perfil" });
    }
  }
}
