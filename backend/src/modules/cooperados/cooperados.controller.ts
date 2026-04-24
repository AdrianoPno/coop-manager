import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { AppError } from "../../utils/AppError.js";
import { UsersService } from "../users/users.service.js";
import { CooperadosService } from "./cooperados.service.js";

const cooperadosService = new CooperadosService();
const usersService = new UsersService();

export class CooperadosController {
  async index(req: AuthRequest, res: Response) {
    const user = await usersService.getById(req.user!.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const cooperados = await cooperadosService.listByUnidade(user.unidadeId);
    return res.json(cooperados);
  }

  async store(req: AuthRequest, res: Response) {
    const user = await usersService.getById(req.user!.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const id = await cooperadosService.create(req.body, user.unidadeId);
    return res.status(201).json({ id });
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body;

    const user = await usersService.getById(req.user!.uid);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    // O Service lançará um AppError se a unidadeId for diferente
    await cooperadosService.update(id, data, user.unidadeId);

    return res.status(204).send();
  }
}
