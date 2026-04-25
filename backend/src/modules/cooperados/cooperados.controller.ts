import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { CooperadosService } from "./cooperados.service";

const cooperadosService = new CooperadosService();

export class CooperadosController {
  async index(req: AuthRequest, res: Response) {
    // O service agora lida com a lógica de role (ADMIN vs SUPER)
    const cooperados = await cooperadosService.list(req.user!);

    return res.status(200).json({
      success: true,
      data: cooperados,
      message: "Cooperados listados com sucesso.",
    });
  }

  async show(req: AuthRequest, res: Response) {
    // Pegando do local seguro (Zod)
    const { id } = res.locals.validatedData.params;

    const cooperado = await cooperadosService.getById(id, req.user!);

    return res.status(200).json({
      success: true,
      data: cooperado,
      message: "Cooperado recuperado com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    // Dados limpos pelo Zod
    const { body } = res.locals.validatedData;

    // Passa o objeto 'user' inteiro para o service lidar com a lógica de multi-tenancy
    const id = await cooperadosService.create(body, req.user!);

    return res.status(201).json({
      success: true,
      data: { id },
      message: "Cooperado criado com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    // Destruturação dos dados validados
    const { params, body } = res.locals.validatedData;

    await cooperadosService.update(params.id, body, req.user!);

    return res.status(200).json({
      success: true,
      message: "Cooperado atualizado com sucesso.",
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = res.locals.validatedData.params;

    await cooperadosService.delete(id, req.user!);

    return res.status(200).json({
      success: true,
      message: "Cooperado excluído com sucesso.",
    });
  }
}
