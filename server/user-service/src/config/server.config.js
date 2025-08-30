import dotenv from "dotenv";

dotenv.config();

export default {
  AUTH_SERVICE: process.env.AUTH_SERVICE,
  COURSE_SERVICE: process.env.COURSE_SERVICE,
};
