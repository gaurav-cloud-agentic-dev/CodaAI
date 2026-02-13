import { betterFetch } from "@better-fetch/fetch";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  // Allow sign-in page to be accessed freely
  if (request.nextUrl.pathname === "/auth/sign-in") {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // Protect home page
  if (request.nextUrl.pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (!session.user.emailVerified) {
      return NextResponse.redirect(
        new URL(`/auth/verify?email=${encodeURIComponent(session.user.email)}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/sign-in"],
};