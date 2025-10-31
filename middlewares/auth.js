// middlewares/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { formatError, paramDetail } from "../utils/errorFormatter.js";

export const loggedMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json(
        formatError({
          code: "UNAUTHORIZED",
          message: "Missing Authorization header",
          status: 401,
          details: [paramDetail("authorization", "Header not provided")],
          path: req.originalUrl,
        })
      );
    }

    const token = header.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json(
        formatError({
          code: "UNAUTHORIZED",
          message: "User does not exist",
          status: 401,
          details: [paramDetail("userId", "Invalid token user reference")],
          path: req.originalUrl,
        })
      );
    }

    req.auth = { userId, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json(
      formatError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
        status: 401,
        details: [paramDetail("token", "Is not guuqegjgsed")],
        path: req.originalUrl,
      })
    );
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.auth?.role === "admin") return next();

    return res.status(403).json(
      formatError({
        code: "FORBIDDEN",
        message: "Access forbidden: Admins only",
        status: 403,
        details: [paramDetail("role", "User is not admin")],
        path: req.originalUrl,
      })
    );
  } catch (error) {
    return res.status(500).json(
      formatError({
        code: "INTERNAL_ERROR",
        message: "Authorization check failed", ///nkharejha fonction okhra nkharejha function 500
        status: 500,
        details: [paramDetail("middleware", error.message)],
        path: req.originalUrl,
      })
    );
  }
};
