import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { CooperadosController } from "./cooperados.controller";

const router = Router();
const controller = new CooperadosController();

// Todas as rotas de cooperados exigem autenticação
router.use(authMiddleware);

// GET /modules/cooperados/
router.get("/", (req, res) => controller.index(req, res));

// POST /modules/cooperados/
router.post("/", (req, res) => controller.store(req, res));

// PUT /modules/cooperados/:id
// Nota: A lógica de validação de unidadeId já está dentro do Service chamado pelo Controller
router.put("/:id", (req, res) => controller.update(req, res));

export default router;
