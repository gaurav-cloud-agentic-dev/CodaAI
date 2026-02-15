import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    console.log("Setting emailVerified to true for user:", userId);

    await db.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    console.log("✅ Successfully set emailVerified to true");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set verified error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}