import { Router } from "express";
import { UnidadesController } from "./unidades.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/adminOnly.middleware";

const router = Router();
const controller = new UnidadesController();

router.use(authMiddleware, adminOnly);

/**
 * @openapi
 * /unidades:
 *   get:
 *     summary: Lista todas as unidades
 *     description: Retorna uma lista de todas as unidades cadastradas. Acesso restrito a administradores.
 *     tags:
 *       - Unidades
 *     responses:
 *       '200':
 *         description: Lista de unidades.
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
 *                     $ref: '#/components/schemas/IUnidade'
 *       '403':
 *         description: Acesso negado.
 */
router.get("/", (req, res) => controller.index(req, res));

/**
 * @openapi
 * /unidades/{id}:
 *   get:
 *     summary: Detalha uma unidade
 *     description: Retorna os detalhes de uma unidade específica pelo seu ID. Acesso restrito a administradores.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da unidade.
 *     responses:
 *       '200':
 *         description: Detalhes da unidade.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUnidade'
 *       '404':
 *         description: Unidade não encontrada.
 */
router.get("/:id", (req, res) => controller.show(req, res));

/**
 * @openapi
 * /unidades:
 *   post:
 *     summary: Cria uma nova unidade
 *     description: Cadastra uma nova unidade no sistema. Acesso restrito a administradores.
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
 *       '400':
 *         description: Dados inválidos ou sigla já em uso.
 */
router.post("/", (req, res) => controller.store(req, res));

/**
 * @openapi
 * /unidades/{id}:
 *   put:
 *     summary: Atualiza uma unidade
 *     description: Atualiza os dados de uma unidade existente. Acesso restrito a administradores.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da unidade a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUnidadeDTO'
 *     responses:
 *       '200':
 *         description: Unidade atualizada com sucesso.
 *       '400':
 *         description: Dados inválidos ou sigla já em uso.
 *       '404':
 *         description: Unidade não encontrada.
 */
router.put("/:id", (req, res) => controller.update(req, res));

/**
 * @openapi
 * /unidades/{id}:
 *   delete:
 *     summary: Exclui uma unidade
 *     description: Exclui uma unidade existente. A exclusão só é permitida se não houver usuários ou cooperados vinculados. Acesso restrito a administradores.
 *     tags:
 *       - Unidades
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da unidade a ser excluída.
 *     responses:
 *       '200':
 *         description: Unidade excluída com sucesso.
 *       '400':
 *         description: A unidade possui usuários ou cooperados vinculados.
 *       '404':
 *         description: Unidade não encontrada.
 */
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
