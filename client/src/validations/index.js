import * as yup from "yup";

// Yup validation schema for signup
export const signupSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must be less than 30 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters")
    .trim(),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must be less than 30 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  // phoneNumber: yup
  //   .string()
  //   .required("Phone number is required")
  //   .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(18, "Password must be less than 18 characters"),
  // gender: yup
  //   .string()
  //   .required("Please select your gender")
  //   .oneOf(
  //     ["male", "female", "other", "prefer-not-to-say"],
  //     "Please select a valid gender option"
  //   ),
});

// Yup validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(18, "Password must be less than 18 characters"),
});
