import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const MAIL_USER = process.env.GMAIL_USER;
const MAIL_PASS = process.env.GMAIL_PASS;
const MAIL_TO = process.env.CONTACT_EMAIL || "rathodhardik0914@gmail.com";

if (!MAIL_USER || !MAIL_PASS) {
  console.warn(
    "Missing GMAIL_USER or GMAIL_PASS in environment. Contact form email sending will not work."
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

app.use(express.json());

app.post("/api/contact", async (req, res) => {
  if (!MAIL_USER || !MAIL_PASS) {
    return res.status(500).json({
      message:
        "Email server is not configured. Set GMAIL_USER and GMAIL_PASS in .env.",
    });
  }

  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  try {
    await transporter.sendMail({
      from: `InteriorAI Contact <${MAIL_USER}>`,
      to: MAIL_TO,
      replyTo: email,
      subject: `InteriorAI Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return res.status(500).json({ message: "Unable to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API server listening on http://127.0.0.1:${PORT}`);
});
