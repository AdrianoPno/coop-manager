import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();

router.get("/me", authMiddleware, (req, res) => controller.me(req, res));

export default router;
