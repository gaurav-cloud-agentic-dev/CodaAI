import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email, userName, verificationCode) {

  const emailHtml = await render(
    VerificationEmail({ userName, verificationCode })
  );

  const mailOptions = {
    from: `"CodaAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CodaAI verification code 🚀",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export function generateVerificationCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}