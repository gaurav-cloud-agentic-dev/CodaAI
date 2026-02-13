"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 8);
    const newCode = pastedData.split("");
    
    while (newCode.length < 8) {
      newCode.push("");
    }
    
    setCode(newCode);
    inputRefs.current[7]?.focus();
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
        // Show loading animation and redirect
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.error || "Invalid verification code");
        setIsVerifying(false);
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userName: "there",
          provider: "resend",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setError("");
        alert("A new verification code has been sent to your email!");
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    }
  };

  if (isVerifying) {
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
            Verifying your account...
          </motion.p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="text-3xl font-bold text-amber-950 dark:text-amber-100 mb-2">
            Check your email
          </h1>
          <p className="text-amber-800 dark:text-amber-200">
            We sent a verification code to
          </p>
          <p className="text-amber-900 dark:text-amber-100 font-semibold">
            {email}
          </p>
        </div>

        {/* Code Input */}
        <div className="bg-white dark:bg-amber-950 rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-800">
          <label className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-4 text-center">
            Enter verification code
          </label>
          
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-amber-50 dark:bg-amber-900 border-2 border-amber-300 dark:border-amber-700 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-amber-900 dark:text-amber-100"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 dark:text-red-400 text-sm text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={handleVerify}
            disabled={code.join("").length !== 8}
            className="w-full bg-amber-800 hover:bg-amber-700 text-white py-6 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Code
          </Button>

          <p className="text-center text-sm text-amber-700 dark:text-amber-300 mt-4">
            Code expires in 10 minutes
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-amber-800 dark:text-amber-200 mt-6">
          Didn't receive the code?{" "}
          <button 
            onClick={handleResend}
            className="font-semibold text-amber-900 dark:text-amber-100 hover:underline"
          >
            Resend
          </button>
        </p>
      </motion.div>
    </section>
  );
}