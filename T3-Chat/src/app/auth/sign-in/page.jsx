"use client";

import { signIn, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const roles = [
  { text: "developers", status: "Debugging..." },
  { text: "shippers", status: "Innovating..." },
  { text: "builders", status: "Creating..." },
  { text: "makers", status: "Deploying..." },
];

export default function Page() {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isClearing, setIsClearing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Clear any existing session when landing on sign-in page
    const clearSession = async () => {
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
  }, [session]);

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
      // Force Google to show account picker
      fetchOptions: {
        onRequest: (context) => {
          // Add prompt parameter to OAuth URL
          const url = new URL(context.url);
          url.searchParams.set('prompt', 'select_account');
          context.url = url.toString();
        },
      },
    });
  } catch (error) {
    setIsLoadingGoogle(false);
    console.error("Google sign-in error:", error);
  }
};

  // Show loading while clearing session
  if (isClearing) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full"
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 px-4 overflow-hidden">
      
      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-8 max-w-4xl w-full"
      >

        {/* Status Badge */}
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

        {/* Main Heading with Animated Word */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight flex flex-nowrap items-center justify-center gap-4 whitespace-nowrap">
            <span className="text-amber-950 dark:text-amber-100">Built for</span>
            <span className="text-amber-700 dark:text-amber-400 flex items-center gap-3">
              <svg 
                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" 
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
                  className="inline-block min-w-[240px] md:min-w-[280px] lg:min-w-[350px] text-left"
                >
                  {roles[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-amber-900 dark:text-amber-100 text-base md:text-lg max-w-2xl leading-relaxed font-normal tracking-wide"
        >
          Where intelligence meets conversation. Crafted for those who demand precision, 
          elegance, and performance at scale.
        </motion.p>

        {/* Sign In Buttons - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-row gap-4 mt-8 w-full max-w-lg justify-center"
        >
          {/* GitHub Sign In */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full px-4 py-3 flex flex-row justify-center items-center gap-2 bg-amber-800 dark:bg-amber-900 border border-amber-900/30 dark:border-amber-800/30 hover:bg-amber-700 dark:hover:bg-amber-800 transition-all duration-300 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    width={20} 
                    height={20}
                    className="invert brightness-0"
                  />
                  <span className="font-semibold text-white">
                    GitHub
                  </span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Google Sign In */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full px-4 py-3 flex flex-row justify-center items-center gap-2 bg-amber-800 dark:bg-amber-900 border border-amber-900/30 dark:border-amber-800/30 hover:bg-amber-700 dark:hover:bg-amber-800 transition-all duration-300 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    width={20} 
                    height={20}
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