import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log("Checking verification for email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required", isVerified: false },
        { status: 400 }
      );
    }

    // Check if user exists and is verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        emailVerified: true,
        id: true,
        email: true 
      },
    });

    console.log("User found:", user);

    // Check if emailVerified is set (either DateTime or true for old boolean values)
    if (user && user.emailVerified) {
      console.log("User is verified:", user.emailVerified);
      return NextResponse.json({ isVerified: true });
    }

    console.log("User is NOT verified");
    return NextResponse.json({ isVerified: false });
  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", isVerified: false },
      { status: 500 }
    );
  }
}