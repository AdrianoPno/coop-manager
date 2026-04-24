import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cooperadosRoutes from "./modules/cooperados/cooperados.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/cooperados", cooperadosRoutes);
routes.use("/users", usersRoutes);

export default routes;
