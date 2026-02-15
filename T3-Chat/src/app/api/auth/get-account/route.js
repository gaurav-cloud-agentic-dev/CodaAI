import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    console.log("Fetching account for user:", userId);

    const account = await db.account.findFirst({
      where: { userId },
      select: { providerId: true },
    });

    if (!account) {
      return NextResponse.json({ provider: "unknown" });
    }

    console.log("Account provider:", account.providerId);

    return NextResponse.json({ provider: account.providerId });
  } catch (error) {
    console.error("Get account error:", error);
    return NextResponse.json(
      { error: "Internal server error", provider: "unknown" },
      { status: 500 }
    );
  }
}