import ApiError from "../utils/ApiError.util.js";

const attachUser = (req, res, next) => {
  const encodedUser = req.headers["x-user-data"];
  if (!encodedUser) {
    return next(new ApiError(401, "unauthorized request"));
  }
  try {
    req.user = JSON.parse(decodeURIComponent(encodedUser));
    next();
  } catch (err) {
    return next(new ApiError(400, "Invalid user data in x-user-data header"));
  }
};

export default attachUser;
