"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassButton({ 
  children, 
  className, 
  variant = "default",
  ...props 
}) {
  const variants = {
    default: "bg-white/60 backdrop-blur-md border border-white/30 shadow-glass hover:bg-white/80",
    primary: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-[0_4px_20px_0_rgba(59,130,246,0.3)] border-0",
    ghost: "bg-white/30 backdrop-blur-sm hover:bg-white/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-full font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}