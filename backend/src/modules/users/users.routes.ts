import { Router } from "express";
import { UsersController } from "./users.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();
const controller = new UsersController();

router.use(authMiddleware);

router.get("/", (req, res) => controller.index(req, res));
router.post("/", (req, res) => controller.store(req, res));
router.put("/:id", (req, res) => controller.update(req, res));

export default router;
