import { betterFetch } from "@better-fetch/fetch";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  console.log("=== MIDDLEWARE TRIGGERED ===");
  console.log("Path:", pathname);

  // Allow auth pages to load
  if (pathname.startsWith("/auth/")) {
    console.log("Auth page, allowing through");
    return NextResponse.next();
  }

  // Check session for protected pages
  if (pathname === "/") {
    console.log("Home page access attempt");

    const { data: session } = await betterFetch("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    console.log("Session data:", session);
    console.log("Has session:", !!session);
    console.log("emailVerified:", session?.user?.emailVerified);

    // No session - redirect to sign in
    if (!session) {
      console.log("❌ No session, redirecting to sign-in");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Has session but not verified - redirect to verification
    if (session.user.emailVerified === false) {
      console.log("❌ Email not verified, redirecting to verification page");
      return NextResponse.redirect(
        new URL(`/auth/verify?email=${encodeURIComponent(session.user.email)}`, request.url)
      );
    }

    console.log("✅ User verified, allowing access to home");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};