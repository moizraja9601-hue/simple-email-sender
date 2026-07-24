require("dotenv").config();

const express = require("express");
const path = require("path");
const { sendMail } = require("./utils/mailSender");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Send Email API
app.post("/send-email", async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        await sendMail(email);

        res.json({
            success: true,
            message: "Email sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send email."
        });

    }

});

// Start Server
app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log(`🚀 Server Running`);
    console.log(`http://localhost:${PORT}`);
    console.log("--------------------------------");

});