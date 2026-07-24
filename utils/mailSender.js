require("dotenv").config();

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// ===============================
// Gmail SMTP Configuration
// ===============================
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ===============================
// Load HTML Template
// ===============================
function loadTemplate() {

    const filePath = path.join(__dirname, "..", "templates", "email.html");

    let html = fs.readFileSync(filePath, "utf8");

    // Replace Dynamic Variables
    html = html.replace(/{{name}}/g, "Hassan");
    html = html.replace(/{{amount}}/g, "$250.00");
    html = html.replace(/{{transactionId}}/g, "TXN-2026-0001");
    html = html.replace(/{{status}}/g, "Completed");
    html = html.replace(/{{date}}/g, new Date().toLocaleString());

    return html;
}

// ===============================
// Send Email
// ===============================
async function sendMail(to) {

    const html = loadTemplate();

    const info = await transporter.sendMail({

        from: `"Simple Email Sender" <${process.env.MAIL_FROM}>`,

        to,

        subject: "🎉 Transaction Successful",

        text: `
Transaction Successful

Hello Hassan,

Your transaction has been completed successfully.

Amount : $250.00
Status : Completed
Transaction ID : TXN-2026-0001
`,

        html

    });

    console.log("--------------------------------");
    console.log("✅ Email Sent");
    console.log(info.messageId);
    console.log("--------------------------------");

    return info;

}

module.exports = {
    sendMail
};