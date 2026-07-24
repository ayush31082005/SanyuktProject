const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const createResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const createSmtpTransport = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendViaResend = async ({ to, subject, text, html }) => {
  const resend = createResendClient();
  if (!resend) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend returned an error");
  }

  console.log("Email sent via Resend:", data);
  return { provider: "resend", data };
};

const sendViaSmtp = async ({ to, subject, text, html }) => {
  const transport = createSmtpTransport();
  if (!transport) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing");
  }

  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const info = await transport.sendMail({
    from: fromEmail,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent via SMTP:", info.messageId);
  return { provider: "smtp", data: info };
};

const sendEmail = async (to, subject, text, html) => {
  const payload = { to, subject, text, html };

  try {
    return await sendViaResend(payload);
  } catch (resendError) {
    console.error("Resend email failed, trying SMTP fallback:", resendError?.message || resendError);

    try {
      return await sendViaSmtp(payload);
    } catch (smtpError) {
      console.error("SMTP fallback email failed:", smtpError?.message || smtpError);
      throw smtpError;
    }
  }
};

module.exports = sendEmail;
