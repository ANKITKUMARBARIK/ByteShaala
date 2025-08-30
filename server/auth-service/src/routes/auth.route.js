import { Router } from "express";
import {
  registerUser,
  verifyOtpSignup,
  resendOtpSignup,
  loginUser,
  forgetUserPassword,
  resetUserPassword,
  refreshAccessToken,
  logoutUser,
  safeLogoutUser,
  updateUserRole,
  getAuthUser,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  registerUserSchema,
  verifyOtpSignupSchema,
  resendOtpSignupSchema,
  loginUserSchema,
  forgetUserPasswordSchema,
  resetUserPasswordSchema,
} from "../validations/auth.validation.js";
import verifyAuthentication from "../middlewares/authentication.middleware.js";
import verifyAuthorization from "../middlewares/authorization.middleware.js";
import ROLES from "../config/role.js";

const router = Router();

router.route("/register").post(validate(registerUserSchema), registerUser);

router
  .route("/verify-signup")
  .post(validate(verifyOtpSignupSchema), verifyOtpSignup);

router
  .route("/resend-signup")
  .post(validate(resendOtpSignupSchema), resendOtpSignup);

router.route("/login").post(validate(loginUserSchema), loginUser);

router
  .route("/forget-password")
  .post(validate(forgetUserPasswordSchema), forgetUserPassword);

router
  .route("/reset-password/:token")
  .post(validate(resetUserPasswordSchema), resetUserPassword);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyAuthentication, logoutUser);

router.route("/safe-logout").post(safeLogoutUser);

router
  .route("/make-admin/:id")
  .patch(
    verifyAuthentication,
    verifyAuthorization(ROLES.ADMIN),
    updateUserRole
  );

router.route("/get-user/:userId").get(getAuthUser);

export default router;
