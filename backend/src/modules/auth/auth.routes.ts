import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
const controller = new AuthController();

router.get("/me", authMiddleware, (req, res) => controller.me(req, res));

export default router;
