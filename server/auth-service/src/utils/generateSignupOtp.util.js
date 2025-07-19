import crypto from "crypto";

const generateSignupOtp = () => crypto.randomInt(100000, 999999).toString();

export default generateSignupOtp;
