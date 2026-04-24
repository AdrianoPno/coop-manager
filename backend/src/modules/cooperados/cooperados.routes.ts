import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { CooperadosController } from "./cooperados.controller";

const router = Router();
const controller = new CooperadosController();

// Todas as rotas de cooperados exigem autenticação
router.use(authMiddleware);

/**
 * @openapi
 * /cooperados:
 *   get:
 *     summary: Lista todos os cooperados da unidade do usuário
 *     description: Retorna uma lista de cooperados pertencentes à mesma unidade do usuário autenticado.
 *     tags:
 *       - Cooperados
 *     responses:
 *       '200':
 *         description: Lista de cooperados retornada com sucesso.
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
 *                     $ref: '#/components/schemas/ICooperado'
 *       '401':
 *         description: Não autorizado.
 */
router.get("/", (req, res) => controller.index(req, res));

/**
 * @openapi
 * /cooperados:
 *   post:
 *     summary: Cria um novo cooperado
 *     description: Adiciona um novo cooperado à unidade do usuário autenticado. O `unidadeId` é atribuído automaticamente.
 *     tags:
 *       - Cooperados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCooperadoDTO'
 *     responses:
 *       '201':
 *         description: Cooperado criado com sucesso. Retorna o ID do novo registro.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Não autorizado.
 */
router.post("/", (req, res) => controller.store(req, res));

/**
 * @openapi
 * /cooperados/{id}:
 *   put:
 *     summary: Atualiza um cooperado existente
 *     description: Atualiza os dados de um cooperado específico. O usuário só pode atualizar cooperados da sua própria unidade.
 *     tags:
 *       - Cooperados
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cooperado a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCooperadoDTO'
 *     responses:
 *       '200':
 *         description: Cooperado atualizado com sucesso.
 *       '400':
 *         description: ID do cooperado inválido.
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado (cooperado pertence a outra unidade).
 *       '404':
 *         description: Cooperado não encontrado.
 */
router.put("/:id", (req, res) => controller.update(req, res));

export default router;
