import mongoose from "mongoose";

const livreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },
    auteur: {
      type: String,
      required: true,
      trim: true,
    },
    categorie: {
      type: String,
      required: true,
      trim: true,
    },
    datePublication: {
      type: Date,
      required: false,
    },
    prix: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Livre = mongoose.model("Livre", livreSchema);
