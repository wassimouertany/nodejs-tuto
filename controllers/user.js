import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    //TODO: vérifier si l'utilisateur existe déjà
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //Créer l'utilisateur
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    const newUserObject = newUser.toObject();
    delete newUserObject.password;

    res
      .status(201)
      .json({ model: newUserObject, message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  try {
    //récuperer le user qui a l'email donné par le body
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({
        message: "Login ou mot de passe incorrecte",
      });
      return;
    }
    //comparer le mot de passe envoyé par le body avec le mdp hashé de la base de données
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Login ou mot de passe incorrecte" });
    }

    //créer token et le renvoyer le token
    res.status(200).json({
      token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h",
      }),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
