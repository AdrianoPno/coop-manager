import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { errorMiddleware } from "./middleware/error.middleware";
import routes from "./routes";
import { setupSwagger } from "./config/swagger";
import "./config/firebase";
import logger from "./config/logger";

const app = express();

// --- Middlewares de Segurança ---

// 1. Helmet: Adiciona vários cabeçalhos HTTP de segurança para proteger contra vulnerabilidades conhecidas.
app.use(helmet());

// Adiciona o logger de requisições HTTP
app.use(pinoHttp({ logger }));

// 2. Rate Limiter: Protege contra ataques de força bruta limitando as requisições por IP.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por janela
  standardHeaders: true, // Retorna informações do limite nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

setupSwagger(app);

app.use("/api", limiter, routes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
