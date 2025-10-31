// middlewares/validate.js
import Joi from "joi";
import { formatError, paramDetail } from "../utils/errorFormatter.js";
import mongoose from "mongoose";


export const validate = (schemaObj) => {
  return (req, res, next) => {
    try {
      const details = [];

      // Validate body if schema provided
      if (schemaObj.body) {
        const { error } = schemaObj.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          error.details.forEach((d) => {
            details.push({ field: d.path.join("."), issue: d.message });
          });
          const payload = formatError({
            code: "VALIDATION_ERROR",
            message: "Request body validation failed",
            status: 422,
            details,
            path: req.originalUrl,
          });
          return res.status(422).json(payload);
        }
        // Put the cleaned/validated body back (optional)
        req.body = schemaObj.body.validate(req.body, {
          stripUnknown: true,
        }).value;
      }

      // Validate query params if schema provided
      if (schemaObj.query) {
        const { error } = schemaObj.query.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          error.details.forEach((d) =>
            details.push({ field: d.path.join("."), issue: d.message })
          );
          const payload = formatError({
            code: "VALIDATION_ERROR",
            message: "Query validation failed",
            status: 422,
            details,
            path: req.originalUrl,
          });
          return res.status(422).json(payload);
        }
        req.query = schemaObj.query.validate(req.query, {
          stripUnknown: true,
        }).value;
      }

      // Validate route params if schema provided (but for ObjectId we handle below)
      if (schemaObj.params) {
        const { error } = schemaObj.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          error.details.forEach((d) =>
            details.push({ field: d.path.join("."), issue: d.message })
          );
          const payload = formatError({
            code: "VALIDATION_ERROR",
            message: "Params validation failed",
            status: 422,
            details,
            path: req.originalUrl,
          });
          return res.status(422).json(payload);
        }
        req.params = schemaObj.params.validate(req.params, {
          stripUnknown: true,
        }).value;
      }

      // Additional: common ObjectId param validation for any param named 'id'
      if (req.params && req.params.id) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          const payload = formatError({
            code: "RESOURCE_NOT_FOUND",
            message: "The requested resource does not exist",
            status: 404,
            details: [paramDetail("id", "Invalid ObjectId format")],
            path: req.originalUrl,
          });
          return res.status(404).json(payload);
        }
      }

      next();
    } catch (e) {
      // Unexpected error in validation middleware
      const payload = formatError({
        code: "INTERNAL_ERROR",
        message: "Validation middleware failure",
        status: 500,
        details: [{ field: "validation", issue: e.message }],
        path: req.originalUrl,
      });
      return res.status(500).json(payload);
    }
  };
};
