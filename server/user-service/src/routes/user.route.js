import { Router } from "express";
import {
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  deleteUser,
  getAllUsers,
  addPurchaseCourse,
  getUserById,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  changeCurrentPasswordSchema,
  updateAccountDetailsSchema,
} from "../validations/user.validation.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/change-password")
  .patch(validate(changeCurrentPasswordSchema), changeCurrentPassword);

router
  .route("/update-account")
  .patch(
    upload.single("avatar"),
    validate(updateAccountDetailsSchema),
    updateAccountDetails
  );

router.route("/current-user").get(getCurrentUser);

router.route("/delete-user/:userId").delete(deleteUser);

router.route("/all-users").get(getAllUsers);

router.route("/add-purchase-course").post(addPurchaseCourse);

// router.route("/get-user/:userId").get(getUserById);

export default router;
