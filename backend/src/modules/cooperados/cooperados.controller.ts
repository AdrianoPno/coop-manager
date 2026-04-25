import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { CooperadosService } from "./cooperados.service";

const cooperadosService = new CooperadosService();

export class CooperadosController {
  async index(req: AuthRequest, res: Response) {
    const unidadeId = req.user?.unidadeId;
    if (!unidadeId) throw new AppError("Usuário sem unidade associada.", 400);

    const cooperados = await cooperadosService.listByUnidade(unidadeId);

    return res.status(200).json({
      success: true,
      data: cooperados,
      message: "Cooperados listados com sucesso.",
    });
  }

  async show(req: AuthRequest, res: Response) {
    const unidadeId = req.user?.unidadeId;
    if (!unidadeId) throw new AppError("Usuário sem unidade associada.", 400);

    // Pegando do local seguro (Zod)
    const { id } = res.locals.validatedData.params;

    const cooperado = await cooperadosService.getById(id, unidadeId);

    return res.status(200).json({
      success: true,
      data: cooperado,
      message: "Cooperado recuperado com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    const unidadeId = req.user?.unidadeId;
    if (!unidadeId) throw new AppError("Usuário sem unidade associada.", 400);

    // Dados limpos pelo Zod
    const { body } = res.locals.validatedData;

    const id = await cooperadosService.create(body, unidadeId);

    return res.status(201).json({
      success: true,
      data: { id },
      message: "Cooperado criado com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    const unidadeId = req.user?.unidadeId;
    if (!unidadeId) throw new AppError("Usuário sem unidade associada.", 400);

    // Destruturação dos dados validados
    const { params, body } = res.locals.validatedData;

    await cooperadosService.update(params.id, body, unidadeId);

    return res.status(200).json({
      success: true,
      message: "Cooperado atualizado com sucesso.",
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const unidadeId = req.user?.unidadeId;
    if (!unidadeId) throw new AppError("Usuário sem unidade associada.", 400);

    const { id } = res.locals.validatedData.params;

    await cooperadosService.delete(id, unidadeId);

    return res.status(200).json({
      success: true,
      message: "Cooperado excluído com sucesso.",
    });
  }
}
