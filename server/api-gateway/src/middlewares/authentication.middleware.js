import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";

const verifyAuthentication = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new ApiError(401, "unauthorized request");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(401, "unauthorized request");

        req.user = decodedToken;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
});

export default verifyAuthentication;
