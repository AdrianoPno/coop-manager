import { Router } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { checkRoles } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "../../utils/users.schema"; // OBS: Este arquivo não está no contexto, mas estou assumindo que ele existe.
import { getUserSchema } from "./users.schema";

const router = Router();
const controller = new UsersController();

router.use(authMiddleware, checkRoles(["SUPER", "ADMIN"]));

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista usuários da mesma unidade do administrador
 *     description: Retorna uma lista de usuários que pertencem à mesma unidade do administrador autenticado. Acesso restrito a usuários com role 'ADMIN'.
 *     tags:
 *       - Usuários
 *     responses:
 *       '200':
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IUser'
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso restrito a administradores.
 */
router.get("/", (req, res) => controller.index(req, res));

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Detalha um usuário
 *     description: Retorna os detalhes de um usuário específico. Acesso restrito a SUPER e ADMIN (apenas para usuários da sua unidade).
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalhes do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUser'
 *       '404':
 *         description: Usuário não encontrado.
 */
router.get(
  "/:id",
  validate(getUserSchema), // Valida que o ID está presente
  (req, res) => controller.show(req, res),
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo perfil de usuário no sistema. O novo usuário será vinculado à mesma unidade do administrador que está realizando a operação. Acesso restrito a 'ADMIN'.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICreateUserDTO'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *       '400':
 *         description: Usuário já cadastrado.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado.
 */
router.post("/", validate(createUserSchema), (req, res) =>
  controller.store(req, res),
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Atualiza a role ou outros dados de um usuário. Um administrador só pode editar usuários da sua própria unidade. Acesso restrito a 'ADMIN'.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UID do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUpdateUserDTO'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado (usuário de outra unidade ou sem permissão de admin).
 *       '404':
 *         description: Usuário não encontrado.
 */
router.put("/:id", validate(updateUserSchema), (req, res) =>
  controller.update(req, res),
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     description: Exclui um usuário do sistema (Firestore e Firebase Auth). Um administrador só pode excluir usuários da sua própria unidade. Acesso restrito a 'ADMIN'.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UID do usuário a ser excluído.
 *     responses:
 *       '200':
 *         description: Usuário excluído com sucesso.
 *       '403':
 *         description: Acesso negado (usuário de outra unidade ou sem permissão de admin).
 *       '404':
 *         description: Usuário não encontrado.
 */
router.delete("/:id", validate(deleteUserSchema), (req, res) =>
  controller.delete(req, res),
);

export default router;
