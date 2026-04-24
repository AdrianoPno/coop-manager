import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { AppError } from "../../utils/AppError.js";
import { UsersService } from "./users.service.js";

const usersService = new UsersService();

export class UsersController {
  // Lista todos os usuários da mesma unidade do ADMIN
  async index(req: AuthRequest, res: Response) {
    const adminUser = await usersService.getById(req.user!.uid);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    // Nota: Implementar no service o método listByUnidade similar ao de cooperados
    const users = await usersService.listByUnidade(adminUser.unidadeId);
    return res.json(users);
  }

  // Cria um novo usuário vinculado a uma unidade
  async store(req: AuthRequest, res: Response) {
    const adminUser = await usersService.getById(req.user!.uid);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso negado.", 403);
    }

    const { uid, nome, email, unidadeId, role } = req.body;

    // Se o admin não for super, ele só pode criar usuários para a própria unidade
    const targetUnidade = adminUser.unidadeId;

    await usersService.create({
      uid,
      nome,
      email,
      unidadeId: targetUnidade,
      role,
    });

    return res.status(201).send();
  }

  // Atualiza status ou permissão
  async update(req: AuthRequest, res: Response) {
    const { id } = req.params; // UID do usuário que será editado
    const data = req.body;

    // 1. Busca o perfil do administrador que está realizando a ação
    const adminUser = await usersService.getById(req.user!.uid);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    // 2. Passa o id (quem), data (o que) e adminUser.unidadeId (validação de segurança)
    // Isso resolve o erro "Expected 3 arguments, but got 2"
    await usersService.update(id, data, adminUser.unidadeId);

    return res.status(204).send();
  }
}
