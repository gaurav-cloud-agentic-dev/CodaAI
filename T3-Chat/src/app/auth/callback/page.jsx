"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false); // ✅ Add this to prevent duplicate processing

  useEffect(() => {
    const handleCallback = async () => {
      if (isPending) {
        console.log("Session is pending...");
        return;
      }

      // ✅ Prevent duplicate processing
      if (hasProcessed.current) {
        console.log("Already processed, skipping...");
        return;
      }

      try {
        if (!session?.user?.email) {
          console.error("No session found");
          setError("Authentication failed. No session found.");
          setStatus("error");
          return;
        }

        // ✅ Mark as processed immediately
        hasProcessed.current = true;

        console.log("=== CALLBACK HANDLER ===");
        console.log("Session user:", session.user);

        // Check which OAuth provider was used
        const accountResponse = await fetch("/api/auth/get-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        const accountData = await accountResponse.json();
        console.log("Account data:", accountData);

        // If GitHub OAuth, set emailVerified to true and go directly to home
        if (accountData.provider === "github") {
          console.log("✅ GitHub OAuth - setting verified and redirecting to home");
          
          // Ensure emailVerified is true for GitHub users
          await fetch("/api/auth/set-verified", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id }),
          });
          
          setStatus("success");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        }

        // For Google OAuth - FORCE unverified first, then check
        console.log("📧 Google OAuth - forcing unverified status first");

        // STEP 1: Always force to unverified initially
        await fetch("/api/auth/force-unverified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        console.log("✅ Forced emailVerified to false");

        // STEP 2: Check if this user was previously verified (has verification record)
        setStatus("checking");
        const checkResponse = await fetch("/api/auth/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!checkResponse.ok) {
          const errorText = await checkResponse.text();
          console.error("Check verification response:", errorText);
          throw new Error(`Check verification failed: ${checkResponse.status}`);
        }

        const checkData = await checkResponse.json();
        console.log("Verification check result:", checkData);

        // If returning user who completed verification before (coming from "Get Started" button)
        if (checkData.isVerified) {
          console.log("✅ Returning verified user (from node page), redirecting to home");
          setStatus("verified");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        }

        // STEP 3: New user - send verification email
        console.log("📧 New user needs verification, sending email...");
        setStatus("sending");
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            userName: session.user.name || "there",
            provider: "oauth",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Verify response error:", errorText);
          throw new Error(`Verification email failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Verification email result:", data);

        if (data.success) {
          console.log("✅ Email sent, redirecting to verification page");
          setStatus("redirecting");
          setTimeout(() => {
            router.push(`/auth/verify?email=${encodeURIComponent(session.user.email)}`);
          }, 1500);
        } else {
          console.error("Email send failed:", data.error);
          setError(data.error || "Failed to send verification email.");
          setStatus("error");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError(err.message || "An error occurred. Please try again.");
        setStatus("error");
        hasProcessed.current = false; // ✅ Reset on error so user can retry
      }
    };

    handleCallback();
  }, [session, isPending, router]);

  if (status === "error") {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 text-center max-w-md"
        >
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            Authentication Error
          </h1>
          <p className="text-amber-800 dark:text-amber-200">{error}</p>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-amber-900 dark:text-amber-100"
        >
          {status === "processing" && "Processing authentication..."}
          {status === "checking" && "Checking verification status..."}
          {status === "sending" && "Sending verification code..."}
          {status === "redirecting" && "Redirecting to verification..."}
          {status === "verified" && "Welcome back! Redirecting..."}
          {status === "success" && "Authentication successful! Redirecting..."}
        </motion.p>
      </motion.div>
    </section>
  );
}