import Joi from "joi";

export const registerUserSchema = Joi.object({
    firstName: Joi.string().required().messages({
        "string.empty": `"firstName" is required`,
    }),
    lastName: Joi.string().required().messages({
        "string.empty": `"lastName" is required`,
    }),
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" must be at least 6 characters`,
    }),
});

export const verifyOtpSignupSchema = Joi.object({
    otpSignup: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base": `"otpSignup" must be a 6-digit number`,
            "string.empty": `"otpSignup" is required`,
            "any.required": `"otpSignup" is required`,
        }),
});

export const resendOtpSignupSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": `"email" must be a valid email`,
        "string.empty": `"email" is required`,
        "any.required": `"email" is required`,
    }),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
        "any.required": `"email" is required`,
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" must be at least 6 characters`,
        "any.required": `"password" is required`,
    }),
});

export const forgetUserPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
    }),
});

export const resetUserPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required().messages({
        "string.empty": `"newPassword" is required`,
        "string.min": `"newPassword" must be at least 6 characters`,
    }),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": `"confirmPassword" must match "newPassword"`,
            "string.empty": `"confirmPassword" is required`,
        }),
});
