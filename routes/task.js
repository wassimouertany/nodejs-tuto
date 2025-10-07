import express from "express";
import * as taskController from "../controllers/task.js";
import { isAdmin, loggedMiddleware } from "../middlewares/auth.js";

export const router = express.Router();

router.get("/", taskController.fetchTasks);
router.get("/:id", taskController.fetchById);
router.post("/", loggedMiddleware,isAdmin, taskController.addTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
