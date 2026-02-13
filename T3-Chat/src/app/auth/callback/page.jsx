"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for session to load
      if (isPending) return;

      try {
        // Check if we have a session
        if (!session?.user?.email) {
          console.error("No session found");
          setError("Authentication failed. No session found.");
          setStatus("error");
          return;
        }

        console.log("Session found:", session.user.email);

        // Check if user's email is already verified
        setStatus("checking");
        const checkResponse = await fetch("/api/auth/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!checkResponse.ok) {
          throw new Error(`Check verification failed: ${checkResponse.status}`);
        }

        const checkData = await checkResponse.json();
        console.log("Verification check:", checkData);

        if (checkData.isVerified) {
          // User is already verified, redirect to home
          setStatus("verified");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        }

        // User needs verification - send email
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
          throw new Error(`Verification email failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Verification email result:", data);

        if (data.success) {
          // Redirect to verification page
          setStatus("redirecting");
          setTimeout(() => {
            router.push(`/auth/verify?email=${encodeURIComponent(session.user.email)}`);
          }, 1000);
        } else {
          setError(data.error || "Failed to send verification email.");
          setStatus("error");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError(err.message || "An error occurred. Please try again.");
        setStatus("error");
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
          <p className="text-amber-800 dark:text-amber-200">
            {error}
          </p>
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
        </motion.p>
      </motion.div>
    </section>
  );
}