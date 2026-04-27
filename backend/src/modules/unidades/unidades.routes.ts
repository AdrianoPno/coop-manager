import { Router } from "express";
import { UnidadesController } from "./unidades.controller";
import { checkRoles } from "../../middleware/role.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  getUnidadeSchema,
  createUnidadeSchema,
  updateUnidadeSchema,
  deleteUnidadeSchema,
} from "../../utils/unidades.schema";

const router = Router();
const controller = new UnidadesController();

// Todos os endpoints de unidades exigem autenticação
router.use(authMiddleware);

/**
 * @openapi
 * /unidades:
 *   get:
 *     summary: Lista todas as unidades
 *     description: Retorna uma lista de todas as unidades cadastradas. Acesso - SUPER e ADMIN.
 *     tags:
 *       - Unidades
 *     responses:
 *       '200':
 *         description: Lista de unidades recuperada com sucesso.
 *       '403':
 *         description: Acesso negado.
 */
router.get("/", checkRoles(["SUPER", "ADMIN"]), (req, res) =>
  controller.index(req, res),
);

/**
 * @openapi
 * /unidades/{id}:
 *   get:
 *     summary: Detalha uma unidade
 *     description: Retorna os detalhes de uma unidade específica pelo seu ID. Acesso - SUPER e ADMIN.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalhes da unidade.
 *       '404':
 *         description: Unidade não encontrada.
 */
router.get(
  "/:id",
  checkRoles(["SUPER", "ADMIN"]),
  validate(getUnidadeSchema),
  (req, res) => controller.show(req, res),
);

/**
 * @openapi
 * /unidades:
 *   post:
 *     summary: Cria uma nova unidade
 *     description: Cadastra uma nova unidade no sistema. Acesso restrito a SUPER.
 *     tags:
 *       - Unidades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUnidadeDTO'
 *     responses:
 *       '201':
 *         description: Unidade criada com sucesso.
 *       '403':
 *         description: Acesso restrito a Super Administradores.
 */
router.post(
  "/",
  checkRoles(["SUPER"]),
  validate(createUnidadeSchema),
  (req, res) => controller.store(req, res),
);

/**
 * @openapi
 * /unidades/{id}:
 *   put:
 *     summary: Atualiza uma unidade
 *     description: Atualiza os dados de uma unidade existente. Acesso restrito a SUPER.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUnidadeDTO'
 *     responses:
 *       '200':
 *         description: Unidade atualizada com sucesso.
 *       '403':
 *         description: Acesso restrito a Super Administradores.
 */
router.put(
  "/:id",
  checkRoles(["SUPER"]),
  validate(updateUnidadeSchema),
  (req, res) => controller.update(req, res),
);

/**
 * @openapi
 * /unidades/{id}:
 *   delete:
 *     summary: Exclui uma unidade
 *     description: Remove uma unidade do sistema. Acesso restrito a SUPER.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Unidade excluída com sucesso.
 *       '400':
 *         description: Unidade possui vínculos ativos e não pode ser excluída.
 */
router.delete(
  "/:id",
  checkRoles(["SUPER"]),
  validate(deleteUnidadeSchema),
  (req, res) => controller.delete(req, res),
);

export default router;
