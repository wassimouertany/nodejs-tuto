import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "title cannot be empty",
    "any.required": "title is required",
  }),
  duration: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "duration is required" }),
  description: Joi.string().trim().allow("").optional(),
});

// For updates — partial allowed
export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  duration: Joi.string().trim().optional(),
  description: Joi.string().trim().allow("").optional(),
}).min(1);

export const paramsWithIdSchema = Joi.object({
  id: Joi.string().required(),
});
