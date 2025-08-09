import ApiError from "../utils/ApiError.util.js";

const validate = (schema) => (req, res, next) => {
  let dataToValidate = req.body;

  if (req.body.payloadObj) {
    try {
      dataToValidate = JSON.parse(req.body.payloadObj);
    } catch (parseError) {
      return next(new ApiError(400, "Invalid JSON in payloadObj"));
    }
  }

  const { error } = schema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new ApiError(400, message));
  }

  next();
};

export default validate;
