import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

export async function POST(request) {
  try {
    const { email, userName, provider } = await request.json();

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verification.create({
      data: {
        identifier: email,
        value: verificationCode,
        expiresAt,
      },
    });

    const result = await sendVerificationEmail(email, userName, verificationCode);

    if (result.success) {
      return NextResponse.json({ success: true, email });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}