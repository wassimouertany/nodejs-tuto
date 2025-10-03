import { Task } from "./../models/Task.js";

export const fetchTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({
      model: tasks,
      message: "success",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const fetchById = async (req, res) => {
  try {
    const { id } = req.params;
    // const task = await Task.findById(id);
    const task = await Task.findOne({ _id: id });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      model: task,
      message: "success",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const addTask = async (req, res) => {
  try {
    console.log("body : ", req.body);
    const newTask = new Task(req.body);
    console.log("newTask :", newTask);
    await newTask.save();
    res.status(201).json({
      model: newTask,
      message: "success",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { id: id },
      { duration: 100 },
      { new: true }
    );
    res.status(200).json({
      model: updatedTask,
      message: "Task updated successfully",
    });
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Task.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
