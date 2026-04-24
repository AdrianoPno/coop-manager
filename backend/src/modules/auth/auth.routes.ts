import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     description: Verifica o token JWT, busca os dados do usuário no Firestore (incluindo role e unidadeId) e retorna o perfil completo.
 *     tags:
 *       - Autenticação
 *     responses:
 *       '200':
 *         description: Perfil do usuário retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/IUser'
 *       '401':
 *         description: Não autorizado (token inválido, expirado ou não fornecido).
 *       '403':
 *         description: Proibido (usuário autenticado mas sem perfil no sistema).
 */
router.get("/me", authMiddleware, (req, res) => controller.me(req, res));

export default router;
