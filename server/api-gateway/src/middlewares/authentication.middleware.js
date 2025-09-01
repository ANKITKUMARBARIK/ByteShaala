import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";

const verifyAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      throw new ApiError(401, "You're unauthorized, Please login first.");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken)
      throw new ApiError(401, "Invalid access token. Please login again.");

    req.user = decodedToken;

    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        statusCode: 401,
        message: "Your session has expired. Please login again.",
        success: false,
        data: null,
        errors: [],
      });
    } else {
      return res.status(401).json({
        statusCode: 401,
        message: error?.message || "Unauthorized request",
        success: false,
        data: null,
        errors: [],
      });
    }
  }
});

export default verifyAuthentication;
