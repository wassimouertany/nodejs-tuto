import express from "express";
import cors from "cors";
import mongoose from "mongoose";
export const app = express();

import { router as taskRouter } from "./routes/task.js";
import { router as userRouter } from "./routes/user.js";
import { swaggerUiMiddleware, swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// --- Connexion MongoDB uniquement si ce n'est pas un test ---
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(
      "mongodb+srv://wassimouertany:KimaSamFil3sal@cluster0.uaxdvct.mongodb.net/tp_backend"
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// --- Swagger ---
app.use(
  "/api-docs",
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpec)
);

// --- Middleware pour routes non trouvées ---
app.use(notFoundHandler);

// --- Middleware global de gestion d'erreurs ---
app.use(errorHandler);

// --- Export pour tests ---
export default app;
