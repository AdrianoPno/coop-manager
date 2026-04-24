import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UsersService } from "../users/users.service";
import { CooperadosService } from "./cooperados.service";

const cooperadosService = new CooperadosService();
const usersService = new UsersService();

export class CooperadosController {
  async index(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError("Não autorizado", 401);

    const user = await usersService.getById(req.user.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const cooperados = await cooperadosService.listByUnidade(user.unidadeId);
    return res.status(200).json({
      success: true,
      data: cooperados,
      message: "Cooperados listados com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError("Não autorizado", 401);

    const user = await usersService.getById(req.user.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const id = await cooperadosService.create(req.body, user.unidadeId);
    return res.status(201).json({
      success: true,
      data: { id },
      message: "Cooperado criado com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body;

    // Proteção: Garante que id seja estritamente string
    if (typeof id !== "string") {
      throw new AppError("ID do cooperado inválido", 400);
    }

    if (!req.user) throw new AppError("Não autorizado", 401);

    const user = await usersService.getById(req.user.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    await cooperadosService.update(id, data, user.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Cooperado atualizado com sucesso.",
    });
  }
}
