import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import routes from "./routes";
import "./config/firebase"; // Garante a inicialização do Firebase

// Configura Express
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // URL do seu Vite
    credentials: true,
  }),
);
app.use(express.json());

// Define as Rotas
app.use("/api", routes);

// Middlewares de Erro (Sempre por último)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
