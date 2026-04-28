import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AppError } from "../../utils/AppError";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  // Lista usuários (Service agora decide se filtra por unidade ou traz tudo)
  async index(req: AuthRequest, res: Response) {
    const users = await usersService.list(req.user!);

    return res.status(200).json({
      success: true,
      data: users,
      message: "Usuários listados com sucesso.",
    });
  }

  // Detalha um usuário
  async show(req: AuthRequest, res: Response) {
    const { id } = res.locals.validatedData.params;

    // Passa o req.user para a checagem de permissão
    const user = await usersService.getById(id, req.user!);

    return res.status(200).json({
      success: true,
      data: user,
      message: "Usuário recuperado com sucesso.",
    });
  }

  // Cria um novo usuário
  async store(req: AuthRequest, res: Response) {
    // Pega dados validados do Zod (incluindo a senha)
    const { body } = res.locals.validatedData;

    // Service realiza a criação atômica (Auth + Firestore) e retorna o UID
    const newUserUid = await usersService.create(body, req.user!);

    // A senha NUNCA é retornada.
    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso.",
      data: { uid: newUserUid }, // Retorna o UID para rastreabilidade
    });
  }

  // Atualiza status ou permissão
  async update(req: AuthRequest, res: Response) {
    const { params, body } = res.locals.validatedData;

    // Passa o id (quem), data (o que) e req.user completo para bypass de SUPER
    await usersService.update(params.id, body, req.user!);

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso.",
    });
  }

  // Exclui um usuário
  async delete(req: AuthRequest, res: Response) {
    const { id } = res.locals.validatedData.params;

    await usersService.delete(id, req.user!);

    return res.status(200).json({
      success: true,
      message: "Usuário excluído com sucesso.",
    });
  }
}
