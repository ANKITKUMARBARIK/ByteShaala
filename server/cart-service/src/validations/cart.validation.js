import Joi from "joi";

export const addToCartSchema = Joi.object({
    courseId: Joi.string().required().messages({
        "any.required": "Course ID is required",
        "string.empty": "Course ID cannot be empty",
        "string.base": "Course ID must be a string",
    }),
});

export const removeFromCartSchema = Joi.object({
    courseId: Joi.string().required().messages({
        "any.required": "Course ID is required",
        "string.empty": "Course ID cannot be empty",
        "string.base": "Course ID must be a string",
    }),
});
