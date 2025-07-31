import ApiError from "../utils/ApiError.util.js";

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map((d) => d.message).join(", ");
        return next(new ApiError(400, message));
    }

    next();
};

export default validate;
