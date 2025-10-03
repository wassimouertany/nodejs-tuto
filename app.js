import express from "express";
import cors from "cors";
import mongoose from "mongoose";
export const app = express();
import { router as taskRouter } from "./routes/task.js";

mongoose
  .connect(
    "mongodb+srv://wassimouertany:KimaSamFil3sal@cluster0.uaxdvct.mongodb.net/tp_backend"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter);

// app.get("/api/livres", async (req, res) => {
//   try {
//     const livres = await Livre.find();
//     res.json({
//       model: livres,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });

// app.get("/api/livres/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const livre = await Livre.findOne({ _id: id });

//     if (!livre) {
//       res.status(404).json({ message: "Livre not found" });
//       return;
//     }

//     res.status(200).json({
//       model: livre,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });

// app.post("/api/livres", async (req, res) => {
//   try {
//     const newLivre = new Livre(req.body);
//     await newLivre.save();
//     res.status(201).json({
//       model: newLivre,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.put("/api/livres/:id", (req, res) => {
//   console.log(req.body);
//   console.log(req.params.id);
// });

// app.patch("/api/livres/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedLivre = await Livre.findOneAndUpdate({ _id: id }, req.body, {
//       new: true,
//     });
//     res.status(200).json({
//       model: updatedLivre,
//       message: "Livre updated successfully",
//     });
//     if (!updatedLivre) {
//       res.status(404).json({ message: "Livre not found" });
//       return;
//     }
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });

// // DELETE livre
// app.delete("/api/livres/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await Livre.deleteOne({ _id: id });
//     if (result.deletedCount === 0) {
//       res.status(404).json({ message: "Livre not found" });
//       return;
//     }
//     res.status(200).json({ message: "Livre deleted successfully" });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });
