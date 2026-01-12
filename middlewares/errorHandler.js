import { formatError } from "../utils/errorFormatter.js";

// Classes d'erreur personnalisées
export class AppError extends Error {
  constructor(code, message, status = 500, details = []) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = []) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource, details = []) {
    super("RESOURCE_NOT_FOUND", `${resource} not found`, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", details = []) {
    super("UNAUTHORIZED", message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = []) {
    super("FORBIDDEN", message, 403, details);
  }
}

export class ConflictError extends AppError {
  constructor(message, details = []) {
    super("CONFLICT", message, 409, details);
  }
}

// Middleware global de gestion d'erreurs
export const errorHandler = (err, req, res, next) => {
  // Si la réponse a déjà été envoyée, passer au middleware suivant
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Si ce n'est pas une AppError, la convertir
  if (!(error instanceof AppError)) {
    // Gestion des erreurs MongoDB
    if (error.name === "CastError") {
      error = new ValidationError("Invalid ID format", [
        { field: error.path, issue: error.message },
      ]);
    } else if (error.name === "ValidationError") {
      const details = Object.keys(error.errors).map((key) => ({
        field: key,
        issue: error.errors[key].message,
      }));
      error = new ValidationError("Validation failed", details);
    } else if (error.code === 11000) {
      // Erreur de duplication MongoDB
      const field = Object.keys(error.keyPattern)[0];
      error = new ConflictError("Duplicate entry", [
        { field, issue: `${field} already exists` },
      ]);
    } else if (error.name === "JsonWebTokenError") {
      error = new UnauthorizedError("Invalid token");
    } else if (error.name === "TokenExpiredError") {
      error = new UnauthorizedError("Token expired");
    } else {
      // Erreur générique
      error = new AppError(
        "INTERNAL_SERVER_ERROR",
        error.message || "An unexpected error occurred",
        error.status || 500,
        []
      );
    }
  }

  // Formater l'erreur
  const formattedError = formatError({
    code: error.code,
    message: error.message,
    status: error.status,
    details: error.details,
    path: req.originalUrl,
  });

  // Logger l'erreur en développement
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", {
      ...formattedError,
      stack: err.stack,
    });
  }

  // Envoyer la réponse
  res.status(error.status).json(formattedError);
};

// Middleware pour les routes non trouvées (404)
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError("Route", [
    { field: "path", issue: `Route ${req.originalUrl} not found` },
  ]);
  next(error);
};
