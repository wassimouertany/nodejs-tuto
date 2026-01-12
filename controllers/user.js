import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "../middlewares/errorHandler.js";

export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new ConflictError("User already exists", [
        { field: "email", issue: "This email is already registered" }
      ]);
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    });
    await newUser.save();
    const newUserObject = newUser.toObject();
    delete newUserObject.password;

    res
      .status(201)
      .json({ model: newUserObject, message: "Utilisateur créé avec succès" });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials", [
        { field: "email", issue: "Email or password is incorrect" }
      ]);
    }
    
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials", [
        { field: "password", issue: "Email or password is incorrect" }
      ]);
    }

    res.status(200).json({
      token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h",
      }),
    });
  } catch (e) {
    next(e);
  }
};
