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
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []     # Requires authentication (JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post("/", validate({ body: createTaskSchema }), taskController.addTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Task not found
 */
router.patch(
  "/:id",
  loggedMiddleware,
  isAdmin,
  validate({ params: paramsWithIdSchema, body: updateTaskSchema }),
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the task to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", taskController.deleteTask);
