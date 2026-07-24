const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {

    // Allow only POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: "Method not allowed"
            })
        };
    }

    try {

        const { email } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Email is required"
                })
            };
        }

        // Email template
        const templatePath = path.join(
            process.cwd(),
            "templates",
            "email.html"
        );

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        let html = fs.readFileSync(templatePath, "utf8");

        html = html.replace(/{{name}}/g, "Hassan");
        html = html.replace(/{{amount}}/g, "$250.00");
        html = html.replace(/{{transactionId}}/g, "TXN-2026-0001");
        html = html.replace(/{{status}}/g, "Completed");
        html = html.replace(/{{date}}/g, new Date().toLocaleString());

        // SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Verify SMTP
        await transporter.verify();

        // Image paths
        const logoPath = path.join(
            process.cwd(),
            "public",
            "images",
            "logo.png"
        );

        const bannerPath = path.join(
            process.cwd(),
            "public",
            "images",
            "banner.jpg"
        );

        if (!fs.existsSync(logoPath)) {
            throw new Error(`Logo not found: ${logoPath}`);
        }

        if (!fs.existsSync(bannerPath)) {
            throw new Error(`Banner not found: ${bannerPath}`);
        }

        // Send email
        await transporter.sendMail({

            from: `"Simple Email Sender" <${process.env.MAIL_FROM}>`,

            to: email,

            subject: "🎉 Transaction Successful",

            html,

            attachments: [
  {
    filename: "logo.png",
    path: logoPath,
    cid: "logo",
    contentDisposition: "inline",
    contentType: "image/png"
  },
  {
    filename: "banner.jpg",
    path: bannerPath,
    cid: "banner",
    contentDisposition: "inline",
    contentType: "image/jpeg"
  }
]

        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Email sent successfully!"
            })
        };

    } catch (error) {

        console.error("========== EMAIL ERROR ==========");
        console.error(error);
        console.error("================================");

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: error.message
            })
        };

    }

};