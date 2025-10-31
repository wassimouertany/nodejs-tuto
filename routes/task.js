import express from "express";
import * as taskController from "../controllers/task.js";
import { isAdmin, loggedMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  paramsWithIdSchema,
} from "../validations/taskValidation.js";

export const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated task ID
 *         title:
 *           type: string
 *           description: The task title
 *         duration:
 *           type: string
 *           description: The estimated duration of the task
 *         description:
 *           type: string
 *           description: Additional details about the task
 *       example:
 *         _id: 670ff9b1b7e22e2d80e7a11b
 *         title: "Learn Node.js"
 *         duration: "2h"
 *         description: "Practice routes, controllers, and MongoDB"
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: success
 */
router.get("/", taskController.fetchTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Task not found
 */ 
router.get("/:id", taskController.fetchById);
router.post(
  "/",
  loggedMiddleware,
  isAdmin,
  validate({ body: createTaskSchema }),
  taskController.addTask
);
router.patch(
  "/:id",
  loggedMiddleware,
  isAdmin,
  validate({ params: paramsWithIdSchema, body: updateTaskSchema }),
  taskController.updateTask
);
router.delete("/:id", taskController.deleteTask);
