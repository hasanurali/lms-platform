import { config } from "../config/index.js";

const sendEmail = async (to, subject, text, html) => {

    try {
        const info = await config.transporter.sendMail({
            from: `"LMS Platform" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;