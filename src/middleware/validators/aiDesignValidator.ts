import { body, param } from "express-validator";

export const generateDesignRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isString()
    .withMessage("Variant ID must be a string"),

  body("prompt")
    .notEmpty()
    .withMessage("Design prompt is required")
    .isString()
    .withMessage("Prompt must be a string")
    .isLength({ min: 3, max: 500 })
    .withMessage("Prompt must be between 3 and 500 characters"),

  body("strength")
    .optional()
    .isFloat({ min: 0.2, max: 0.8 })
    .withMessage(
      "Strength must be between 0.2 (subtle change) and 0.8 (dramatic change). Default is 0.55.",
    ),
];

export const getDesignRules = [
  param("id")
    .isMongoId()
    .withMessage("Design ID must be a valid MongoDB ObjectId"),
];
