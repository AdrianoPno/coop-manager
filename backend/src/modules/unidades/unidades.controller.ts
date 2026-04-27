import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UnidadesService } from "./unidades.service";

const unidadesService = new UnidadesService();

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
    const { id } = res.locals.validatedData.params;
    const unidade = await unidadesService.getById(id);
    return res.status(200).json({
      success: true,
      data: unidade,
      message: "Unidade detalhada com sucesso.",
    });
  }

  async store(req: AuthRequest, res: Response) {
    const { body } = res.locals.validatedData;
    const id = await unidadesService.create(body);
    return res.status(201).json({
      success: true,
      data: { id },
      message: "Unidade criada com sucesso.",
    });
  }

  async update(req: AuthRequest, res: Response) {
    const { params, body } = res.locals.validatedData;
    await unidadesService.update(params.id, body);
    return res.status(200).json({
      success: true,
      message: "Unidade atualizada com sucesso.",
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = res.locals.validatedData.params;
    await unidadesService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Unidade excluída com sucesso.",
    });
  }
}
