import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UnidadesService } from "./unidades.service";
import { UsersService } from "../users/users.service";

const unidadesService = new UnidadesService();
const usersService = new UsersService();

export class UnidadesController {
  async index(req: AuthRequest, res: Response) {
    const unidades = await unidadesService.listAll();
    return res.status(200).json({
      success: true,
      data: unidades,
      message: "Unidades listadas com sucesso.",
    });
  }

  async show(req: AuthRequest, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError("ID da unidade inválido.", 400);
    }

    const unidade = await unidadesService.getById(id);
    return res.status(200).json({
      success: true,
      data: unidade,
      message: "Unidade detalhada com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    const { nome, sigla, status } = req.body;

    if (!nome || !sigla) {
      throw new AppError("Os campos 'nome' e 'sigla' são obrigatórios.", 400);
    }

    const id = await unidadesService.create({ nome, sigla, status });
    return res.status(201).json({
      success: true,
      data: { id },
      message: "Unidade criada com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (typeof id !== "string") {
      throw new AppError("ID da unidade inválido.", 400);
    }

    if (Object.keys(data).length === 0) {
      throw new AppError("Nenhum dado fornecido para atualização.", 400);
    }

    await unidadesService.update(id, data);
    return res.status(200).json({
      success: true,
      message: "Unidade atualizada com sucesso.",
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError("ID da unidade inválido.", 400);
    }

    await unidadesService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Unidade excluída com sucesso.",
    });
  }
}
