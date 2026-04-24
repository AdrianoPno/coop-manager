import { Response } from "express";
import { UsersService } from "../users/users.service.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { AppError } from "../../utils/AppError.js";

const usersService = new UsersService();

export class AuthController {
  /**
   * Retorna os dados do usuário logado (Perfil + Unidade)
   * Útil para o "Me" ou "VerifySession" no Frontend
   */
  async me(req: AuthRequest, res: Response) {
    const { uid } = req.user!;

    const user = await usersService.getById(uid);

    if (!user) {
      throw new AppError(
        "Perfil de usuário não configurado. Contate o administrador.",
        404,
      );
    }

    if (!user.ativo) {
      throw new AppError("Usuário inativo no sistema.", 403);
    }

    return res.json(user);
  }
}
