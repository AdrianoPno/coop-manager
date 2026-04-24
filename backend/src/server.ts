import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import usersRoutes from "./modules/users/users.routes.js";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Prefixo opcional para versionamento ou organização
app.use("/api", routes);

app.use(errorMiddleware);

routes.use("/users", usersRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
