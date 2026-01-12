import { Task } from "./../models/Task.js";
import { NotFoundError, ValidationError } from "../middlewares/errorHandler.js";

export const fetchTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json({
      model: tasks,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
export const fetchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id });

    if (!task) {
      throw new NotFoundError("Task", [
        { field: "id", issue: `Task with id ${id} does not exist` }
      ]);
    }

    res.status(200).json({
      model: task,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
export const addTask = async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    return res.status(201).json({
      model: newTask,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      throw new NotFoundError("Task", [
        { field: "id", issue: `Task with id ${id} does not exist` }
      ]);
    }
    
    res.status(200).json({
      model: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Task.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      throw new NotFoundError("Task", [
        { field: "id", issue: `Task with id ${id} does not exist` }
      ]);
    }
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
