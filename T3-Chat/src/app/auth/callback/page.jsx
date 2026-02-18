"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";

// Bar Graph Bouncing Ball Animation - for "Sending Verification Code"
const BouncingBallBars = () => {
  const bars = [
    { height: 40, delay: 0 },
    { height: 65, delay: 0.1 },
    { height: 50, delay: 0.2 },
    { height: 80, delay: 0.3 },
    { height: 55, delay: 0.4 },
    { height: 70, delay: 0.5 },
    { height: 45, delay: 0.6 },
  ];

  const [activebar, setActiveBar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar((prev) => (prev + 1) % bars.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-3 h-24 px-4">
        {bars.map((bar, index) => (
          <div key={index} className="relative flex flex-col items-center">
            {/* Bouncing Ball */}
            <motion.div
              className="w-4 h-4 rounded-full bg-amber-700 shadow-lg mb-1"
              animate={{
                y: activebar === index ? [0, -(bar.height + 20), 0] : 0,
                scale: activebar === index ? [1, 0.85, 1] : 1,
                backgroundColor: activebar === index ? "#92400e" : "#d97706",
              }}
              transition={{
                duration: 0.4,
                ease: activebar === index ? [0.22, 1, 0.36, 1] : "easeOut",
              }}
              style={{ position: "relative", zIndex: 10 }}
            />
            {/* Bar */}
            <motion.div
              className="rounded-t-lg w-7"
              style={{ height: bar.height }}
              animate={{
                backgroundColor:
                  activebar === index ? "#92400e" : "#d97706",
                scaleY: activebar === index ? [1, 1.05, 1] : 1,
                boxShadow:
                  activebar === index
                    ? "0 -4px 12px rgba(146, 64, 14, 0.5)"
                    : "none",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>
      <div className="text-center space-y-1">
        <p
          className="text-xl font-semibold text-amber-950 dark:text-amber-100"
          style={{
            fontFamily:
              '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Sending Verification Code
        </p>
        <p
          className="text-sm text-amber-700 dark:text-amber-400"
          style={{
            fontFamily:
              '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Preparing your secure code...
        </p>
      </div>
    </div>
  );
};

// Three Dots Bouncing - for "Checking / Processing"
const ThreeDotsAnimation = ({ label }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-amber-700 dark:bg-amber-500"
            animate={{
              y: [0, -22, 0],
              scale: [1, 1.15, 1],
              backgroundColor: ["#b45309", "#d97706", "#b45309"],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p
        className="text-xl font-semibold text-amber-950 dark:text-amber-100"
        style={{
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {label}
      </p>
    </div>
  );
};

// Redirecting Animation - Paper plane flying
const RedirectingAnimation = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Flying paper plane with trail */}
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Trail dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-600"
            animate={{
              x: [60 - i * 16, -20],
              opacity: [0.8 - i * 0.15, 0],
              scale: [1 - i * 0.1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Paper Plane */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          animate={{
            x: [-20, 180],
            y: [0, -8, 0, 8, 0],
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{
            x: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-700 dark:text-amber-400"
          >
            <motion.path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </svg>
        </motion.div>
      </div>

      <div className="text-center space-y-1">
        <p
          className="text-xl font-semibold text-amber-950 dark:text-amber-100"
          style={{
            fontFamily:
              '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Redirecting to Verification
        </p>
        <p
          className="text-sm text-amber-700 dark:text-amber-400"
          style={{
            fontFamily:
              '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Taking you to the next step...
        </p>
      </div>
    </div>
  );
};

// Success animation
const SuccessAnimation = ({ label }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.svg
          className="w-10 h-10 text-amber-700 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.svg>
      </motion.div>
      <p
        className="text-xl font-semibold text-amber-950 dark:text-amber-100"
        style={{
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isPending) {
        console.log("Session is pending...");
        return;
      }

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

        hasProcessed.current = true;

        console.log("=== CALLBACK HANDLER ===");
        console.log("Session user:", session.user);

        const accountResponse = await fetch("/api/auth/get-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        const accountData = await accountResponse.json();
        console.log("Account data:", accountData);

        if (accountData.provider === "github") {
          console.log(
            "✅ GitHub OAuth - setting verified and redirecting to home"
          );

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

        console.log("📧 Google OAuth - forcing unverified status first");

        await fetch("/api/auth/force-unverified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        console.log("✅ Forced emailVerified to false");

        setStatus("checking");
        const checkResponse = await fetch("/api/auth/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!checkResponse.ok) {
          const errorText = await checkResponse.text();
          console.error("Check verification response:", errorText);
          throw new Error(
            `Check verification failed: ${checkResponse.status}`
          );
        }

        const checkData = await checkResponse.json();
        console.log("Verification check result:", checkData);

        if (checkData.isVerified) {
          console.log(
            "✅ Returning verified user (from node page), redirecting to home"
          );
          setStatus("verified");
          setTimeout(() => {
            router.push("/");
          }, 1000);
          return;
        }

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
            router.push(
              `/auth/verify?email=${encodeURIComponent(session.user.email)}`
            );
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
        hasProcessed.current = false;
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.div>
          <h1
            className="text-2xl font-bold text-amber-950 dark:text-amber-100"
            style={{
              fontFamily:
                '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            Authentication Error
          </h1>
          <p
            className="text-amber-800 dark:text-amber-300"
            style={{
              fontFamily:
                '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/auth/sign-in")}
            className="px-8 py-3 bg-amber-800 hover:bg-amber-700 text-white rounded-2xl font-semibold transition-all shadow-lg"
            style={{
              fontFamily:
                '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          {/* Processing */}
          {status === "processing" && (
            <ThreeDotsAnimation label="Processing authentication..." />
          )}

          {/* Checking */}
          {status === "checking" && (
            <ThreeDotsAnimation label="Checking verification status..." />
          )}

          {/* Sending - Bar Graph with Bouncing Ball */}
          {status === "sending" && <BouncingBallBars />}

          {/* Redirecting - Paper Plane */}
          {status === "redirecting" && <RedirectingAnimation />}

          {/* Verified */}
          {status === "verified" && (
            <SuccessAnimation label="Welcome back! Redirecting..." />
          )}

          {/* Success */}
          {status === "success" && (
            <SuccessAnimation label="Authentication successful! Redirecting..." />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}