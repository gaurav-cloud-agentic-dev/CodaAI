import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";

// Log configuration on startup
console.log("=== EMAIL CONFIG ===");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASSWORD SET:", !!process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email config error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

export async function sendVerificationEmail(email, userName, verificationCode) {
  console.log("=== SENDING EMAIL ===");
  console.log("To:", email);
  console.log("UserName:", userName);
  console.log("Code:", verificationCode);
  
  try {
    // ✅ ADD AWAIT HERE
    const emailHtml = await render(
      VerificationEmail({ userName, verificationCode })
    );

    console.log("Email HTML rendered, length:", emailHtml.length);

    const mailOptions = {
      from: `"CodaAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your CodaAI verification code 🚀",
      html: emailHtml,
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    console.error("Full error:", error);
    return { success: false, error: error.message };
  }
}

export function generateVerificationCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}