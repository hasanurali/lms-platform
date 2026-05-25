import { config } from "../config/index.js";

const sendEmail = async (to, subject, text, html) => {
    try {
        await config.resend.emails.send({
            from: `LMS Platform <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;