import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import cooperadosRoutes from "./modules/cooperados/cooperados.routes";
import usersRoutes from "./modules/users/users.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/cooperados", cooperadosRoutes);
routes.use("/users", usersRoutes);

export default routes;
