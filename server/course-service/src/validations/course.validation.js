import Joi from "joi";

export const createCourseSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "string.empty": `"title" is required`,
    }),
    description: Joi.string().trim().required().messages({
        "string.empty": `"description" is required`,
    }),
    category: Joi.string().trim().required().messages({
        "string.empty": `"category" is required`,
    }),
    slug: Joi.string().trim().required().messages({
        "string.empty": `"slug" is required`,
    }),
    price: Joi.number().min(0).required().messages({
        "number.base": `"price" must be a number`,
        "number.min": `"price" must be at least 0`,
        "any.required": `"price" is required`,
    }),
    originalPrice: Joi.number().min(0).required().messages({
        "number.base": `"originalPrice" must be a number`,
        "number.min": `"originalPrice" must be at least 0`,
        "any.required": `"originalPrice" is required`,
    }),
    currency: Joi.string().trim().length(3).uppercase().required().messages({
        "string.empty": `"currency" is required`,
        "string.length": `"currency" must be a 3-letter currency code (like USD)`,
    }),
    language: Joi.string().trim().required().messages({
        "string.empty": `"language" is required`,
    }),
    level: Joi.string()
        .valid("Beginner", "Intermediate", "Advanced")
        .required()
        .messages({
            "any.only": `"level" must be one of [Beginner, Intermediate, Advanced]`,
            "any.required": `"level" is required`,
        }),
    tags: Joi.array().items(Joi.string().trim()).default([]).messages({
        "array.base": `"tags" must be an array of strings`,
    }),
});

export const updateCourseSchema = Joi.object({
    title: Joi.string().trim().optional().messages({
        "string.empty": `"title" cannot be empty`,
    }),
    description: Joi.string().trim().optional().messages({
        "string.empty": `"description" cannot be empty`,
    }),
    category: Joi.string().trim().optional().messages({
        "string.empty": `"category" cannot be empty`,
    }),
    slug: Joi.string().trim().optional().messages({
        "string.empty": `"slug" cannot be empty`,
    }),
    price: Joi.number().min(0).optional().messages({
        "number.base": `"price" must be a number`,
        "number.min": `"price" must be at least 0`,
    }),
    originalPrice: Joi.number().min(0).optional().messages({
        "number.base": `"originalPrice" must be a number`,
        "number.min": `"originalPrice" must be at least 0`,
    }),
    currency: Joi.string().trim().length(3).uppercase().optional().messages({
        "string.empty": `"currency" cannot be empty`,
        "string.length": `"currency" must be a 3-letter currency code (like USD)`,
    }),
    language: Joi.string().trim().optional().messages({
        "string.empty": `"language" cannot be empty`,
    }),
    level: Joi.string()
        .valid("Beginner", "Intermediate", "Advanced")
        .optional()
        .messages({
            "any.only": `"level" must be one of [Beginner, Intermediate, Advanced]`,
        }),
    tags: Joi.array().items(Joi.string().trim()).optional().messages({
        "array.base": `"tags" must be an array of strings`,
    }),
});
