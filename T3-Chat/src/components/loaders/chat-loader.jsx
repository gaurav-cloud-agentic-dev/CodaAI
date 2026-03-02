// Place this file at: src/components/loaders/chat-loader.jsx
"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const BOUNCY = { type: "spring", stiffness: 400, damping: 18 };

const ChatLoader = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...BOUNCY, delay: i * 0.1 }}
          className={`flex gap-3 ${i % 2 === 1 ? "justify-end" : "justify-start"}`}
        >
          {/* Assistant avatar */}
          {i % 2 === 0 && (
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md"
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
          )}

          {/* Bubble skeleton */}
          <div className={`flex flex-col gap-2 ${i % 2 === 1 ? "items-end" : "items-start"} max-w-[65%]`}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              className={`rounded-2xl px-4 py-3 ${
                i % 2 === 1
                  ? "bg-amber-300/40 dark:bg-amber-700/40 rounded-br-sm"
                  : "bg-white/70 dark:bg-amber-900/50 border border-amber-200/60 dark:border-amber-700/60 rounded-bl-sm"
              }`}
              style={{ width: i === 0 ? "280px" : i === 2 ? "220px" : "160px" }}
            >
              <div className="space-y-2">
                {[...Array(i === 0 ? 3 : 2)].map((_, j) => (
                  <motion.div
                    key={j}
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: j * 0.15 + i * 0.1, ease: "easeInOut" }}
                    className="h-2.5 rounded-full bg-amber-300/60 dark:bg-amber-600/40"
                    style={{ width: j === (i === 0 ? 2 : 1) ? "65%" : "100%" }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Timestamp skeleton */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
              className="h-2 w-16 rounded-full bg-amber-200/50 dark:bg-amber-700/40 mx-1"
            />
          </div>

          {/* User avatar */}
          {i % 2 === 1 && (
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-700 dark:bg-amber-600 flex items-center justify-center shadow-md"
            >
              <span className="text-white text-xs font-bold">GS</span>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Typing dots indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...BOUNCY, delay: 0.35 }}
        className="flex gap-3 justify-start"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white dark:bg-amber-900/80 border border-amber-200 dark:border-amber-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div className="flex gap-1.5 items-center h-4">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.7, repeat: Infinity, delay, ease: "easeInOut" }}
                className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatLoader;