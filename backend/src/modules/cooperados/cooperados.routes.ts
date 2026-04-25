import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { CooperadosController } from "./cooperados.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  getCooperadoSchema,
  createCooperadoSchema,
  updateCooperadoSchema,
  deleteCooperadoSchema,
} from "../../utils/cooperados.schema";

const router = Router();
const controller = new CooperadosController();

router.use(authMiddleware);

/**
 * @openapi
 * /cooperados:
 *   get:
 *     summary: Lista todos os cooperados
 *     tags: [Cooperados]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", (req, res) => controller.index(req, res));

/**
 * @openapi
 * /cooperados/{id}:
 *   get:
 *     summary: Busca um cooperado por ID
 *     tags: [Cooperados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do cooperado
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Não encontrado
 */
router.get("/:id", validate(getCooperadoSchema), (req, res) =>
  controller.show(req, res),
);

/**
 * @openapi
 * /cooperados:
 *   post:
 *     summary: Cria um novo cooperado
 *     tags: [Cooperados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCooperadoDTO'
 *     responses:
 *       201:
 *         description: Criado com sucesso
 */
router.post("/", validate(createCooperadoSchema), (req, res) =>
  controller.store(req, res),
);

/**
 * @openapi
 * /cooperados/{id}:
 *   put:
 *     summary: Atualiza um cooperado
 *     tags: [Cooperados]
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
 *             $ref: '#/components/schemas/UpdateCooperadoDTO'
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put("/:id", validate(updateCooperadoSchema), (req, res) =>
  controller.update(req, res),
);

/**
 * @openapi
 * /cooperados/{id}:
 *   delete:
 *     summary: Exclui um cooperado
 *     tags: [Cooperados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Excluído com sucesso
 */
router.delete("/:id", validate(deleteCooperadoSchema), (req, res) =>
  controller.delete(req, res),
);

export default router;
