import express from "express";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyAuthentication from "./middlewares/authentication.middleware.js";

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

export default app;
