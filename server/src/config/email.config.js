import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify API key connection
(async () => {
    try {
        await resend.domains.list();
        console.log("Resend server is ready to send emails");
    } catch (error) {
        console.error("Error connecting to Resend:", error);
    }
})();

export default resend;