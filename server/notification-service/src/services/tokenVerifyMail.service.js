import transporter from "../config/mail.config.js";
import { promises as fs } from "fs";

const tokenVerifyMail = async (firstName, lastName, email, token) => {
    try {
        const fullName = `${firstName} ${lastName}`;

        const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:1573";
        const resetLink = `${FRONTEND_BASE_URL}/reset-password/${token}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/tokenVerifyMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{actionLink}}", resetLink);

        const mailOptions = {
            from: {
                name: "ByteShaala LMS Platform",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: "🔐 Password Reset Code - ByteShaala LMS Platform",
            html: finalHtml,
            text: finalHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("mail sent ", info.response);
    } catch (error) {
        console.error("error sending mail:", err);
    }
};

export default tokenVerifyMail;
