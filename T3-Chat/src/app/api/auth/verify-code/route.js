import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email,
        value: code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Mark user's email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used verification code
    await prisma.verification.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Code verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}