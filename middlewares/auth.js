// middlewares/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { UnauthorizedError, ForbiddenError } from "./errorHandler.js";

export const loggedMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw new UnauthorizedError("Missing Authorization header", [
        { field: "authorization", issue: "Header not provided" }
      ]);
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Invalid Authorization header format", [
        { field: "authorization", issue: "Token not found in header" }
      ]);
    }

    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User does not exist", [
        { field: "userId", issue: "Invalid token user reference" }
      ]);
    }

    req.auth = { userId, role: user.role };
    next();
  } catch (error) {
    // Les erreurs JWT sont automatiquement gérées par errorHandler
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.auth?.role === "admin") {
      return next();
    }

    throw new ForbiddenError("Access forbidden: Admins only", [
      { field: "role", issue: "User is not admin" }
    ]);
  } catch (error) {
    next(error);
  }
};
