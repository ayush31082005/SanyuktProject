const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // Switch to 587 (STARTTLS) - more compatible with cloud providers
            secure: false, // Must be false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 15000, // Increase timeout slightly
            tls: {
                rejectUnauthorized: false // Helps avoid certificate issues on some nodes
            }
        });

        console.log(`[EMAIL] START: Attempting to send to ${to} with subject: ${subject}`);

        const mailOptions = {
            from: `"Sanyukt Parivaar and Rich Life" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] SUCCESS: Sent to ${to}. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EMAIL] FAILURE: Could not send to ${to}.`);
        console.error(`[EMAIL] ERROR: ${error.message}`);
        console.error(`[EMAIL] STACK: ${error.stack}`);
        
        // Detailed check for common errors
        if (error.message.includes('EAUTH')) {
            console.error("[EMAIL] Potential Issue: Invalid EMAIL_USER or EMAIL_PASS (App Password).");
        } else if (error.message.includes('ETIMEDOUT')) {
            console.error("[EMAIL] Potential Issue: Connection timeout. Check if port 465 is blocked.");
        }
        
        throw error;
    }
};

module.exports = sendEmail;