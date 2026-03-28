const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // Using 465 (SSL) is often more stable for Gmail in production
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000, // 10 seconds timeout
        });

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