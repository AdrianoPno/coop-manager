import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";

export class AuthController {
  /**
   * Retorna os dados do usuário logado (Perfil + Unidade)
   * Útil para o "Me" ou "VerifySession" no Frontend
   */
  // backend/src/modules/auth/auth.controller.ts

  async me(req: AuthRequest, res: Response) {
    // O middleware de autenticação já garante que req.user exista.
    // Se não existir, o middleware já terá retornado um erro 401 ou 403.
    if (!req.user) {
      // Esta verificação é uma segurança extra, mas não deve ser alcançada.
      return res.status(403).json({
        success: false,
        message: "Perfil de usuário não encontrado na requisição.",
      });
    }

    // Retorna os dados que o middleware 'authMiddleware' anexou ao objeto 'req'
    return res.status(200).json({
      success: true,
      data: req.user,
      message: "Perfil recuperado com sucesso.",
    });
  }
}
