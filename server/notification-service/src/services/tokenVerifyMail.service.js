import transporter from "../config/mail.config.js";
import { promises as fs } from "fs";

const tokenVerifyMail = async (firstName, lastName, email, token) => {
    try {
        const fullName = `${firstName} ${lastName}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/tokenVerifyMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{token}}", token)
            .replace("{{actionLink}}", "http://localhost:5000/");

        const mailOptions = {
            from: {
                name: "ByteShaala Team 🎓",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: "Token Verification - Reset Password",
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
