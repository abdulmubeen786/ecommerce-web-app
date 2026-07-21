const joi = require("joi");

// ============================================
// ✅ Reusable Email Schema
// ============================================
const emailSchema = joi
  .string()
  .required()
  .email({ tlds: { allow: true } })
  .max(254)
  .lowercase()
  .trim()
  .messages({
    "string.email": "Please enter a valid email address",
    "string.max": "Email cannot exceed 254 characters",
    "any.required": "Email is required",
  });

// ============================================
// ✅ Reusable Password Schema
// ============================================
const passwordSchema = joi
  .string()
  .required()
  .min(8)
  .max(32)
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[a-z]/, "lowercase")
  .pattern(/[0-9]/, "number")
  .pattern(/[!@#$%^&*]/, "special character")
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password cannot exceed 32 characters",
    "string.pattern.name": "Password must contain at least one {#name}",
    "any.required": "Password is required",
  });

// ============================================
// ✅ Signup Schema
// ============================================
const signupSchema = joi.object({
  name: joi
    .string()
    .required()
    .min(6)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .trim()
    .messages({
      "string.min": "Name must be at least 6 characters",
      "string.max": "Name cannot exceed 50 characters",
      "string.pattern.base": "Name can only contain letters and spaces",
      "any.required": "Name is required",
    }),
  email: emailSchema,
  password: passwordSchema,
});

// ============================================
// ✅ Login Schema
// ============================================
const loginSchema = joi.object({
  email: emailSchema,
  password: passwordSchema,
});

module.exports = { signupSchema, loginSchema };
