import transporter from "../config/mail.config.js";
import { promises as fs } from "fs";

const verifySignupMail = async (firstName, lastName, email, otpSignup) => {
    try {
        const fullName = `${firstName} ${lastName}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/verifySignupMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{otpSignup}}", otpSignup);

        const mailOptions = {
            from: {
                name: "ByteShaala LMS Platform",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: "🔐 Verify Your Email - ByteShaala LMS Platform",
            html: finalHtml,
            text: finalHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("mail sent ", info.response);
    } catch (error) {
        console.error("error sending mail ", err);
    }
};

export default verifySignupMail;
