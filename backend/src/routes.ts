import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import cooperadosRoutes from "./modules/cooperados/cooperados.routes";
import usersRoutes from "./modules/users/users.routes";
import unidadesRoutes from "./modules/unidades/unidades.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/cooperados", cooperadosRoutes);
routes.use("/users", usersRoutes);
routes.use("/unidades", unidadesRoutes);
routes.use("/dashboard", dashboardRoutes);

export default routes;
