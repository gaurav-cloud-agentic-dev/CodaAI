require('dotenv').config();

async function testEmail() {
  console.log("Testing email configuration...");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
  console.log("EMAIL_PASSWORD length:", process.env.EMAIL_PASSWORD?.length);

  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log("\nVerifying connection...");
    await transporter.verify();
    console.log("✅ Connection verified!");

    console.log("\nSending test email...");
    const info = await transporter.sendMail({
      from: `"CodaAI Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      html: "<h1>Test Code: 12345678</h1>",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
}

testEmail();