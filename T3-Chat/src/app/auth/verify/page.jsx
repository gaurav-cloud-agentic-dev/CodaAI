"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCw } from "lucide-react";

// ── Creative Verifying Animation — Morphing DNA Helix ───────────────────────
const VerifyingAnimation = () => {
  const dots = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* DNA Helix */}
      <div className="relative w-24 h-40 flex items-center justify-center">
        {dots.map((i) => {
          const offset = (i / dots.length) * Math.PI * 2;
          return (
            <div key={i} className="absolute w-full flex justify-between items-center"
              style={{ top: `${(i / (dots.length - 1)) * 100}%` }}
            >
              {/* Left dot */}
              <motion.div
                className="w-4 h-4 rounded-full bg-amber-700 shadow-md"
                animate={{
                  x: [0, 28, 0, -28, 0],
                  scale: [1, 1.3, 0.7, 1.3, 1],
                  opacity: [1, 0.7, 0.3, 0.7, 1],
                  backgroundColor: ["#b45309", "#d97706", "#f59e0b", "#d97706", "#b45309"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />

              {/* Connecting line */}
              <motion.div
                className="flex-1 mx-1 h-px"
                animate={{
                  opacity: [0.6, 0.1, 0.6],
                  scaleX: [1, 0.2, 1],
                  backgroundColor: ["#d97706", "#fbbf24", "#d97706"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                style={{ background: "#d97706" }}
              />

              {/* Right dot */}
              <motion.div
                className="w-4 h-4 rounded-full bg-amber-500 shadow-md"
                animate={{
                  x: [0, -28, 0, 28, 0],
                  scale: [0.7, 1.3, 1, 1.3, 0.7],
                  opacity: [0.3, 0.7, 1, 0.7, 0.3],
                  backgroundColor: ["#f59e0b", "#d97706", "#b45309", "#d97706", "#f59e0b"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            </div>
          );
        })}

        {/* Ambient glow behind */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-200 blur-2xl"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Bouncing dots */}
      <div className="flex items-end gap-2 h-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-700"
            animate={{
              y: [0, -18, 0],
              backgroundColor: ["#b45309", "#f59e0b", "#b45309"],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <p
        className="text-xl font-semibold text-amber-950 dark:text-amber-100"
        style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        Verifying your details...
      </p>
    </div>
  );
};

// ── Gmail Envelope ────────────────────────────────────────────────────────────
const GmailEnvelope = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover popup card */}
      <motion.div
        className="absolute z-30"
        initial={{ y: 5, opacity: 0 }}
        animate={{
          y: isHovered ? -32 : 5,
          opacity: isHovered ? 1 : 0,
          rotateX: isHovered ? 0 : 20,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-2.5 w-24 border border-amber-100">
          <div className="flex justify-center mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.366l8.073-5.873C21.69 2.28 24 3.434 24 5.457z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-amber-200 rounded w-full" />
            <div className="h-0.5 bg-amber-200 rounded w-4/5" />
            <div className="h-0.5 bg-amber-100 rounded w-3/5" />
            <div className="h-0.5 bg-amber-100 rounded w-2/5" />
          </div>
          <div className="mt-1.5 text-center">
            <div className="text-[9px] font-bold text-amber-900">••••••••</div>
          </div>
        </div>
      </motion.div>

      {/* Envelope body */}
      <div className="relative w-28 h-20 z-20">
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full bg-white rounded-xl shadow-lg border border-amber-100"
          animate={{ y: isHovered ? 2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-bold text-red-600" style={{ fontFamily: "Arial, sans-serif" }}>@</span>
              <span className="text-sm font-semibold text-red-600" style={{ fontFamily: "Arial, sans-serif" }}>Gmail</span>
            </div>
          </div>
        </motion.div>

        {/* Flap */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          animate={{ rotateX: isHovered ? -180 : 0, z: isHovered ? 15 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <svg width="112" height="50" viewBox="0 0 112 50" className="w-full">
            <path d="M 0 0 L 56 38 L 112 0 Z" fill="url(#flap-amber)" />
            <defs>
              <linearGradient id="flap-amber" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 w-full"
          animate={{ opacity: isHovered ? 0.3 : 0.5 }}
        >
          <svg width="112" height="40" viewBox="0 0 112 40" className="w-full">
            <line x1="0" y1="40" x2="56" y2="0" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
            <line x1="112" y1="40" x2="56" y2="0" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");
    if (value && index < 7) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    const newCode = pasted.split("");
    while (newCode.length < 8) newCode.push("");
    setCode(newCode);
    if (pasted.length > 0)
      inputRefs.current[Math.min(pasted.length, 7)]?.focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 8) {
      setError("Please enter the complete verification code");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await response.json();
      if (data.success) {
        await new Promise((r) => setTimeout(r, 1500));
        window.location.href = "/auth/sign-in?verified=true";
      } else {
        setError(data.error || "Invalid verification code. Please try again.");
        setIsVerifying(false);
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Verification failed. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName: "there", provider: "resend" }),
      });
      const data = await response.json();
      if (data.success) {
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // ── Verifying screen ────────────────────────────────────────────────────────
  if (isVerifying) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <VerifyingAnimation />
        </motion.div>
      </section>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Gmail Envelope */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <GmailEnvelope />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h1
            className="text-2xl font-bold text-amber-950 dark:text-amber-100 mb-3"
            style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            Confirm Email
          </h1>
          <p
            className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed"
            style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            Please enter the 8-digit code sent to
          </p>
          <p
            className="text-amber-950 dark:text-amber-100 font-semibold text-sm mt-1"
            style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            {email}
          </p>
        </motion.div>

        {/* Code inputs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mb-8"
        >
          <div className="flex gap-2 justify-center mb-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-16 text-center text-3xl font-semibold bg-white/70 text-amber-950 border-2 border-amber-200 focus:border-amber-800 outline-none transition-all duration-200 rounded-2xl hover:border-amber-400 shadow-sm backdrop-blur-sm"
                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-red-600 text-xs text-center mt-4"
                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Resend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <p
            className="text-sm text-amber-800 dark:text-amber-300"
            style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            Haven't got email?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-amber-950 dark:text-amber-100 font-semibold hover:underline transition-all disabled:opacity-50 inline-flex items-center gap-1"
            >
              {isResending && <RotateCw className="w-3 h-3 animate-spin" />}
              Resend Code
            </button>
          </p>
        </motion.div>

        {/* Verify button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleVerify}
          disabled={code.join("").length !== 8 || isVerifying}
          whileHover={{ scale: code.join("").length === 8 ? 1.02 : 1 }}
          whileTap={{ scale: code.join("").length === 8 ? 0.98 : 1 }}
          className="w-full bg-amber-800 hover:bg-amber-700 disabled:bg-amber-200 dark:disabled:bg-amber-900 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
          style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </motion.button>
      </motion.div>
    </section>
  );
}