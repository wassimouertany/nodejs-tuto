import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "email is invalid",
    "any.required": "email is required",
  }),

  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "password must be at least 8 characters",
  }),

  role: Joi.string().valid("user", "admin").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().min(8).max(100).required(),
});
