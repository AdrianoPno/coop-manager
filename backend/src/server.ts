import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import routes from "./routes";
import { setupSwagger } from "./config/swagger";
import "./config/firebase";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

setupSwagger(app);
app.use("/api", routes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
