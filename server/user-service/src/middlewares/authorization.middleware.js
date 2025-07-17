import ApiError from "../utils/ApiError.util.js";

const verifyAuthorization =
    (...allowedRoles) =>
    (req, _, next) => {
        if (!allowedRoles.includes(req.user.role))
            throw new ApiError(402, "access denied: not authorized");
        next();
    };

export default verifyAuthorization;
