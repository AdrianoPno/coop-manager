import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  // Lista todos os usuários da mesma unidade do ADMIN
  async index(req: AuthRequest, res: Response) {
    // O middleware adminOnly já garante que req.user existe e é um admin.
    if (!req.user?.unidadeId) {
      throw new AppError("Unidade do administrador não encontrada.", 400);
    }
    const users = await usersService.listByUnidade(req.user.unidadeId);
    return res.status(200).json({
      success: true,
      data: users,
      message: "Usuários listados com sucesso.",
    });
  }

  // Cria um novo usuário vinculado a uma unidade
  async store(req: AuthRequest, res: Response) {
    if (!req.user?.unidadeId) {
      throw new AppError("Unidade do administrador não encontrada.", 400);
    }
    const { uid, nome, email, role } = req.body;

    if (!uid || typeof uid !== "string") {
      throw new AppError("O campo 'uid' é obrigatório.", 400);
    }

    // Se o admin não for super, ele só pode criar usuários para a própria unidade
    const targetUnidade = req.user.unidadeId;

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

    if (!req.user?.unidadeId) {
      throw new AppError("Unidade do administrador não encontrada.", 400);
    }

    // Passa o id (quem), data (o que) e adminUser.unidadeId (validação de segurança)
    await usersService.update(id, data, req.user.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso.",
    });
  }

  // Exclui um usuário
  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params; // UID do usuário que será excluído

    if (typeof id !== "string") {
      throw new AppError("ID de usuário inválido", 400);
    }

    if (!req.user?.unidadeId) {
      throw new AppError("Unidade do administrador não encontrada.", 400);
    }

    await usersService.delete(id, req.user.unidadeId);

    return res.status(200).json({
      success: true,
      message: "Usuário excluído com sucesso.",
    });
  }
}
