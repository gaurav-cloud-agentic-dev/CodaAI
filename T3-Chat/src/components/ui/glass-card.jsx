"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}