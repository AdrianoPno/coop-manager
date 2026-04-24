import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UsersService } from "../users/users.service";
import { CooperadosService } from "./cooperados.service";

const cooperadosService = new CooperadosService();
const usersService = new UsersService();

export class CooperadosController {
  async index(req: AuthRequest, res: Response) {
    if (!req.user?.unidadeId) {
      throw new AppError("Usuário não está associado a uma unidade.", 400);
    }

    const cooperados = await cooperadosService.listByUnidade(
      req.user.unidadeId,
    );
    return res.status(200).json({
      success: true,
      data: cooperados,
      message: "Cooperados listados com sucesso.",
    });
  }

  async show(req: AuthRequest, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError("ID do cooperado inválido.", 400);
    }

    if (!req.user?.unidadeId) {
      throw new AppError("Usuário não está associado a uma unidade.", 400);
    }

    const cooperado = await cooperadosService.getById(id, req.user.unidadeId);

    return res.status(200).json({
      success: true,
      data: cooperado,
      message: "Cooperado recuperado com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    if (!req.user?.unidadeId) {
      throw new AppError("Usuário não está associado a uma unidade.", 400);
    }

    const id = await cooperadosService.create(req.body, req.user.unidadeId);
    return res.status(201).json({
      success: true,
      data: { id },
      message: "Cooperado criado com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (typeof id !== "string") {
      throw new AppError("ID do cooperado inválido.", 400);
    }

    if (!req.user?.unidadeId) {
      throw new AppError("Usuário não está associado a uma unidade.", 400);
    }

    await cooperadosService.update(id, data, req.user.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Cooperado atualizado com sucesso.",
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError("ID do cooperado inválido.", 400);
    }

    if (!req.user?.unidadeId) {
      throw new AppError("Usuário não está associado a uma unidade.", 400);
    }

    await cooperadosService.delete(id, req.user.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Cooperado excluído com sucesso.",
    });
  }
}
