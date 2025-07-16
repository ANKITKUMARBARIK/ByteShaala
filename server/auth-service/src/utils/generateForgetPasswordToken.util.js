import crypto from "crypto";

const generateForgetPasswordToken = () =>
    crypto.randomBytes(32).toString("hex");

export default generateForgetPasswordToken;
