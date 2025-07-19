import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

const verifyAuthentication = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new ApiError(401, "unauthorized request");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(401, "unauthorized request");

        const user = await Auth.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if (!user) throw new ApiError(401, "invalid access token");

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
});

export default verifyAuthentication;
