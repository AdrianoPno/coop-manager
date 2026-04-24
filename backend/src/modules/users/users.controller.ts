import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  // Lista todos os usuários da mesma unidade do ADMIN
  async index(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError("Não autorizado", 401);

    const adminUser = await usersService.getById(req.user.uid);
    if (!adminUser) throw new AppError("Administrador não encontrado", 404);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    const users = await usersService.listByUnidade(adminUser.unidadeId);
    return res.status(200).json({
      success: true,
      data: users,
      message: "Usuários listados com sucesso.",
    });
  }

  // Cria um novo usuário vinculado a uma unidade
  async store(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError("Não autorizado", 401);

    const adminUser = await usersService.getById(req.user.uid);
    if (!adminUser) throw new AppError("Administrador não encontrado", 404);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso negado.", 403);
    }

    const { uid, nome, email, role } = req.body;

    if (!uid || typeof uid !== "string") {
      throw new AppError("O campo 'uid' é obrigatório.", 400);
    }

    // Se o admin não for super, ele só pode criar usuários para a própria unidade
    const targetUnidade = adminUser.unidadeId;

    await usersService.create(
      {
        uid,
        nome,
        email,
        role,
      },
      targetUnidade,
    );

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso.",
    });
  }

  // Atualiza status ou permissão
  async update(req: AuthRequest, res: Response) {
    const { id } = req.params; // UID do usuário que será editado
    const data = req.body;

    // Type Guard para garantir que 'id' seja string
    if (typeof id !== "string") {
      throw new AppError("ID de usuário inválido", 400);
    }

    if (!req.user) throw new AppError("Não autorizado", 401);

    const adminUser = await usersService.getById(req.user.uid);
    if (!adminUser) throw new AppError("Administrador não encontrado", 404);

    if (adminUser.role !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    // Passa o id (quem), data (o que) e adminUser.unidadeId (validação de segurança)
    await usersService.update(id, data, adminUser.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso.",
    });
  }
}
