"use client";

import { motion } from "framer-motion";

export default function StopButton({ onStop }) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onStop}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)",
        boxShadow: "0 6px 22px rgba(59,158,255,0.45), 0 2px 6px rgba(59,158,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
        flexShrink: 0,
        transition: "box-shadow 0.14s, transform 0.14s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(59,158,255,0.55)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 22px rgba(59,158,255,0.45), 0 2px 6px rgba(59,158,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)";
      }}
    >
      {/* Stop square — white on blue */}
      <div style={{
        width: 11, height: 11, borderRadius: 3,
        background: "#fff",
      }} />
    </motion.button>
  );
}