"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassInput({ className, icon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
      )}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={cn(
          "w-full px-4 py-3 rounded-2xl",
          "bg-white/50 backdrop-blur-lg border border-white/30",
          "shadow-inner focus:bg-white/70 focus:border-white/50",
          "transition-all duration-200 outline-none",
          "placeholder:text-gray-400",
          icon && "pl-12",
          className
        )}
        {...props}
      />
    </div>
  );
}