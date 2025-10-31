import express from "express";
import cors from "cors";
import mongoose from "mongoose";
export const app = express();
import { router as taskRouter } from "./routes/task.js";
import { router as userRouter } from "./routes/user.js";

mongoose
  .connect(
    "mongodb+srv://wassimouertany:KimaSamFil3sal@cluster0.uaxdvct.mongodb.net/tp_backend"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
import { swaggerUiMiddleware, swaggerSpec } from "./config/swagger.js";

app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));  