import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required", isVerified: false },
        { status: 400 }
      );
    }

    // Check if user exists and is verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (user && user.emailVerified) {
      return NextResponse.json({ isVerified: true });
    }

    return NextResponse.json({ isVerified: false });
  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", isVerified: false },
      { status: 500 }
    );
  }
}