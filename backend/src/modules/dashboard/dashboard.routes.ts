import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { checkRoles } from "../../middleware/role.middleware";

const router = Router();
const controller = new DashboardController();

// Protege todas as rotas do dashboard, permitindo acesso apenas para SUPER e ADMIN
router.use(authMiddleware, checkRoles(["SUPER", "ADMIN"]));

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     summary: Retorna estatísticas e KPIs para o dashboard
 *     description: Busca dados agregados como contagem de alertas (inatividade, documentação) e novos cooperados no mês. O escopo dos dados é definido pela role do usuário (unidade específica para ADMIN, global para SUPER).
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Estatísticas retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       '401':
 *         description: Não autorizado.
 *       '403':
 *         description: Acesso negado.
 */
router.get("/stats", (req, res) => controller.getStats(req, res));

export default router;
