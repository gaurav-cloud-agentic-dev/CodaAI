"use client";

import { signIn, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";

const roles = [
  { text: "developers", status: "Debugging..." },
  { text: "shippers", status: "Innovating..." },
  { text: "builders", status: "Creating..." },
  { text: "makers", status: "Deploying..." },
];

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isClearing, setIsClearing] = useState(true);

  const wasVerified = searchParams.get("verified") === "true";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clearSession = async () => {
      if (wasVerified) {
        console.log("✅ User just verified!");
        setIsClearing(false);
        return;
      }

      if (session?.user) {
        console.log("Clearing existing session...");
        try {
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                console.log("Session cleared");
              },
            },
          });
        } catch (error) {
          console.error("Error clearing session:", error);
        }
      }
      setIsClearing(false);
    };

    clearSession();
  }, [session, wasVerified]);

  const handleGithubSignIn = async () => {
    setIsLoadingGithub(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/auth/callback",
      });
    } catch (error) {
      setIsLoadingGithub(false);
      console.error("GitHub sign-in error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });
    } catch (error) {
      setIsLoadingGoogle(false);
      console.error("Google sign-in error:", error);
    }
  };

  if (isClearing) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full"
          />
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
            Verifying
          </p>
        </div>
      </section>
    );
  }

  if (wasVerified) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4 py-8 overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Circles */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200/20 dark:bg-yellow-800/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b08_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/40 dark:bg-amber-600/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-5xl relative z-10">
          
          {/* Workflow Nodes */}
          <div className="flex items-center justify-center gap-0 relative">
            
            {/* Node 1: Sign In */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div
                initial={{ borderColor: "#d1d5db" }}
                animate={{ borderColor: "#10b981" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 w-64 border-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">Sign In</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Verified Successfully</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className="text-gray-900 dark:text-gray-100">Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Provider</span>
                        <span className="text-gray-900 dark:text-gray-100">Google</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Arrow 1 */}
            <motion.div 
              className="relative w-24 h-1 mx-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-green-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div
                className="absolute -right-2 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
              >
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Node 2: Email Verification */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <motion.div
                initial={{ borderColor: "#d1d5db" }}
                animate={{ borderColor: "#10b981" }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 w-64 border-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">Email Verification</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Verified Successfully</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className="text-gray-900 dark:text-gray-100">Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Code</span>
                        <span className="text-gray-900 dark:text-gray-100">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Arrow 2 */}
            <motion.div 
              className="relative w-24 h-1 mx-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-amber-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 2.5 }}
                style={{ transformOrigin: "left" }}
              />
              <motion.div
                className="absolute -right-2 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.3 }}
              >
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Node 3: One Last Step */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="relative"
            >
              <motion.div
                initial={{ borderColor: "#d1d5db" }}
                animate={{ borderColor: "#f59e0b" }}
                transition={{ duration: 0.8, delay: 3.3 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 w-64 border-4"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">One Last Step</h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Ready to Launch</p>
                  </div>
                </div>
                
                {/* Get Started Button */}
                <Button
                  onClick={async () => {
                    console.log("✅ User verified, creating authenticated session...");
                    setIsLoadingGoogle(true);
                    
                    // Sign in with Google to create a fresh verified session
                    await signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    });
                  }}
                  disabled={isLoadingGoogle}
                  className="w-full py-3 px-4 bg-amber-900 hover:bg-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingGoogle ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Launching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                      <span>Get Started</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Powered by CodaAI • Your journey begins now
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4 overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-8 max-w-5xl w-full"
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={roles[currentIndex].status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-700/30 bg-amber-950/20 dark:bg-amber-950/30 dark:border-amber-800/40 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 rounded-full bg-amber-600"
            />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
              {roles[currentIndex].status}
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight flex flex-nowrap items-center justify-center gap-5">
            <span className="text-amber-950 dark:text-amber-100">Built for</span>
            <span className="text-amber-700 dark:text-amber-400 flex items-center gap-3">
              <svg 
                className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[currentIndex].text}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="inline-block min-w-[280px] md:min-w-[360px] lg:min-w-[420px] text-left"
                >
                  {roles[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-amber-900 dark:text-amber-100 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed font-normal tracking-wide"
        >
          Where intelligence meets conversation. Crafted for those who demand precision, 
          elegance, and performance at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-row gap-5 mt-8 w-full max-w-xl justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full px-5 py-3 flex flex-row justify-center items-center gap-3 bg-amber-800 dark:bg-amber-900 border border-amber-900/30 dark:border-amber-800/30 hover:bg-amber-700 dark:hover:bg-amber-800 transition-all duration-300 shadow-sm text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGithubSignIn}
              disabled={isLoadingGithub || isLoadingGoogle}
            >
              {isLoadingGithub ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="font-semibold text-white">
                    Authenticating...
                  </span>
                </>
              ) : (
                <>
                  <Image 
                    src="/Github.png" 
                    alt="Github" 
                    width={22} 
                    height={22}
                    className="invert brightness-0"
                  />
                  <span className="font-semibold text-white">
                    GitHub
                  </span>
                </>
              )}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full px-5 py-3 flex flex-row justify-center items-center gap-3 bg-amber-800 dark:bg-amber-900 border border-amber-900/30 dark:border-amber-800/30 hover:bg-amber-700 dark:hover:bg-amber-800 transition-all duration-300 shadow-sm text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleSignIn}
              disabled={isLoadingGithub || isLoadingGoogle}
            >
              {isLoadingGoogle ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="font-semibold text-white">
                    Authenticating...
                  </span>
                </>
              ) : (
                <>
                  <Image 
                    src="/Google-Logo.png" 
                    alt="Google" 
                    width={22} 
                    height={22}
                  />
                  <span className="font-semibold text-white">
                    Google
                  </span>
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}