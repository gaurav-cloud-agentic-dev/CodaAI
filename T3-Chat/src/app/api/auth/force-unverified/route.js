import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    console.log("Force setting emailVerified to false for user:", userId);

    await db.user.update({
      where: { id: userId },
      data: { emailVerified: false },
    });

    console.log("✅ Successfully updated user");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error forcing unverified:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}