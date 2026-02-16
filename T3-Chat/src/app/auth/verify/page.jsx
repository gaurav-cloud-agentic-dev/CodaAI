"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCw } from "lucide-react";

// Gmail Envelope Animation Component
const GmailEnvelope = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Email card that pops out */}
      <motion.div
        className="absolute z-30"
        initial={{ y: 15, opacity: 0 }}
        animate={{
          y: isHovered ? -35 : 15,
          opacity: isHovered ? 1 : 0,
          rotateX: isHovered ? 0 : 20,
          scale: isHovered ? 1 : 0.8
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.4
        }}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-4 w-32 border-2 border-gray-200">
          {/* Gmail logo */}
          <div className="flex justify-center mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.366l8.073-5.873C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
            </svg>
          </div>
          {/* Email lines */}
          <div className="space-y-1.5">
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-5/6"></div>
            <div className="h-1 bg-gray-300 rounded w-4/6"></div>
            <div className="h-1 bg-gray-200 rounded w-3/6"></div>
          </div>
          {/* Verification code preview */}
          <div className="mt-3 text-center">
            <div className="text-xs font-bold text-gray-700">••••••••</div>
          </div>
        </div>
      </motion.div>

      {/* Envelope */}
      <div className="relative w-28 h-20 z-20">
        {/* Envelope back */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg border border-gray-300"
          animate={{
            y: isHovered ? 2 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {/* @Gmail symbol on envelope */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                @
              </span>
              <span className="text-sm font-semibold text-red-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                Gmail
              </span>
            </div>
          </div>
        </motion.div>

        {/* Envelope flap - opens upward */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
          animate={{
            rotateX: isHovered ? -180 : 0,
            z: isHovered ? 15 : 0
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
        >
          <svg width="112" height="50" viewBox="0 0 112 50" className="w-full">
            <path
              d="M 0 0 L 56 38 L 112 0 Z"
              fill="url(#flap-gradient)"
              className="drop-shadow-lg"
            />
            <defs>
              <linearGradient id="flap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Envelope front flap lines */}
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          animate={{
            opacity: isHovered ? 0.3 : 0.5
          }}
        >
          <svg width="112" height="40" viewBox="0 0 112 40" className="w-full">
            <line x1="0" y1="40" x2="56" y2="0" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5"/>
            <line x1="112" y1="40" x2="56" y2="0" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

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
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    const newCode = pastedData.split("");
    
    while (newCode.length < 8) {
      newCode.push("");
    }
    
    setCode(newCode);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 7)]?.focus();
    }
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = "/auth/sign-in?verified=true";
      } else {
        setError(data.error || "Invalid verification code. Please try again.");
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
    setIsResending(true);
    setError("");
    
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
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-700 border-t-transparent rounded-full"
          />
          <p className="text-2xl font-medium text-gray-800">
            Verifying your details...
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Gmail Envelope Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-10"
        >
          <GmailEnvelope />
        </motion.div>

        {/* Title and description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            We have sent a verification code to your email
          </p>
          <p className="text-gray-900 font-medium text-sm mt-1">
            {email}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Please enter the verification code below
          </p>
        </motion.div>

        {/* Verification code inputs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex gap-3 justify-center mb-2" onPaste={handlePaste}>
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
                className="w-12 h-16 text-center text-3xl font-semibold bg-gray-50 text-gray-900 border-b-3 border-gray-300 focus:border-gray-700 focus:bg-white outline-none transition-all duration-200 shadow-sm"
                style={{ 
                  borderBottom: '3px solid',
                  borderRadius: '0',
                  fontFamily: '"Segoe UI", system-ui, sans-serif'
                }}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-xs text-center mt-4"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Verify button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleVerify}
          disabled={code.join("").length !== 8 || isVerifying}
          whileHover={{ scale: code.join("").length === 8 ? 1.02 : 1 }}
          whileTap={{ scale: code.join("").length === 8 ? 0.98 : 1 }}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-all duration-200 shadow-lg disabled:shadow-none"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </motion.button>

        {/* Resend code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Sending..." : "Resend Code"}
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Code expires in 10 minutes
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}