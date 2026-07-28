const nodemailer = require("nodemailer");

const smtpUser = process.env.SMPT_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMPT_PW || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

module.exports = transporter;