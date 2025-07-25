import express from "express";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyAuthentication from "./middlewares/authentication.middleware.js";
import jwt from "jsonwebtoken";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-user-data"],
  })
);

app.use(cookieParser());

// auth service
app.use(
  "/api/v1/auth",
  proxy(process.env.AUTH_SERVICE, {
    proxyReqPathResolver: (req) => {
      return `/api/v1/auth${req.url}`;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error("Auth Proxy Error:", err.message);
      next(err);
    },
  })
);

// user service
app.use(
  "/api/v1/user",
  verifyAuthentication,
  proxy(process.env.USER_SERVICE, {
    proxyReqPathResolver: (req) => {
      return `/api/v1/user${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const user = srcReq.user;
      if (user) {
        proxyReqOpts.headers["x-user-data"] = encodeURIComponent(
          JSON.stringify(user)
        );
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error("User Proxy Error:", err.message);
      next(err);
    },
  })
);

// course service
app.use(
    "/api/v1/course",
    proxy(process.env.COURSE_SERVICE, {
        proxyReqPathResolver: (req) => {
            return `/api/v1/course${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            const token =
                srcReq.cookies?.accessToken ||
                srcReq.header("Authorization")?.replace("Bearer ", "");
            if (token) {
                try {
                    const decoded = jwt.verify(
                        token,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    proxyReqOpts.headers["x-user-data"] = encodeURIComponent(
                        JSON.stringify(decoded)
                    );
                } catch (err) {
                    // invalid token — ignore for public routes
                }
            }
            return proxyReqOpts;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("Course Proxy Error:", err.message);
            next(err);
        },
    })
);

export default app;
