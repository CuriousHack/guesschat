const Joi = require('joi')

const registerSchema = Joi.object({
    username: Joi.string()
            .min(2).max(30)
            .required()
            .messages({
      "any.required": "Username is required",
    }),
    email: Joi.string()
            .email()
            .required()
            .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

    password: Joi.string()
                .min(8)
                .required()
                .messages({
                    "string.min": "Password must be at least 8 characters",
                    "any.required": "Password is required",
    }),
    repeat_password: Joi.ref('password'),
  });

  const loginSchema = Joi.object({
    email: Joi.string()
            .email()
            .required()
            .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

    password: Joi.string()
                .required()
                .messages({
                    "any.required": "Password is required",
    }),
  });

  module.exports = { registerSchema, loginSchema };