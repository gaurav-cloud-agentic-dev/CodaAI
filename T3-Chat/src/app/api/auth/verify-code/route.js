import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    console.log("=== VERIFY CODE ===");
    console.log("Verifying code for:", email);
    console.log("Code entered:", code);

    const verification = await db.verification.findFirst({
      where: {
        identifier: email,
        value: code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    console.log("Verification record found:", verification);

    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // ✅ Mark user's email as verified
    console.log("Marking email as verified for:", email);
    const updatedUser = await db.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    console.log("✅ User updated:", updatedUser);

    // Delete the used verification code
    await db.verification.delete({
      where: {
        id: verification.id,
      },
    });

    console.log("✅ Verification code deleted");

    // ✅ NUCLEAR OPTION: Delete ALL sessions to force re-authentication
    await db.session.deleteMany({
      where: {
        userId: updatedUser.id,
      },
    });

    console.log("✅ All sessions deleted - user will need to re-authenticate");

    return NextResponse.json({ success: true, needsReauth: true });
  } catch (error) {
    console.error("Code verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}