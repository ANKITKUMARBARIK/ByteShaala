import { Router } from "express";
import {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
} from "../controllers/course.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createCourseSchema,
    updateCourseSchema,
} from "../validations/course.validation.js";
import upload from "../middlewares/multer.middleware.js";
import attachUser from "../middlewares/attachUser.middleware.js";
import verifyAuthorization from "../middlewares/authorization.middleware.js";
import ROLES from "../config/role.js";

const router = Router();

router
    .route("/create-course")
    .post(
        attachUser,
        verifyAuthorization(ROLES.ADMIN),
        upload.single("thumbnail"),
        validate(createCourseSchema),
        createCourse
    );

router
    .route("/update-course/:courseId")
    .put(
        attachUser,
        verifyAuthorization(ROLES.ADMIN),
        upload.single("thumbnail"),
        validate(updateCourseSchema),
        updateCourse
    );

router
    .route("/delete-course/:courseId")
    .delete(attachUser, verifyAuthorization(ROLES.ADMIN), deleteCourse);

router.route("/get-all-courses").get(getAllCourses);

router.route("/get-course/:courseId").get(getCourseById);

export default router;
