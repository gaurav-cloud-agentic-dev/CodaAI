"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, User, ExternalLink, ChevronDown, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const SCROLLBAR_CSS = `
  html, body { overflow: hidden !important; height: 100% !important; }

  /* Custom scrollbar track — creative vertical timeline style */
  .chat-viewport::-webkit-scrollbar {
    width: 6px;
  }
  .chat-viewport::-webkit-scrollbar-track {
    background: transparent;
  }
  .chat-viewport::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(251,191,36,0.0) 0%,
      rgba(217,119,6,0.5) 30%,
      rgba(234,88,12,0.7) 60%,
      rgba(217,119,6,0.5) 80%,
      rgba(251,191,36,0.0) 100%
    );
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .chat-viewport::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      rgba(251,191,36,0.2) 0%,
      rgba(217,119,6,0.8) 40%,
      rgba(234,88,12,1) 60%,
      rgba(217,119,6,0.8) 80%,
      rgba(251,191,36,0.2) 100%
    );
  }
  /* Firefox */
  .chat-viewport {
    scrollbar-width: thin;
    scrollbar-color: rgba(217,119,6,0.5) transparent;
  }
`;

function useInjectStyles(css, id) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
}

const ease = [0.25, 0.46, 0.45, 0.94];

export default function SharedChatView({ conversation }) {
  useInjectStyles(SCROLLBAR_CSS, "shared-chat-styles");

  const viewportRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(conversation.messages.length > 3);
  const [atBottom, setAtBottom] = useState(false);

  const formatMessageTime = (date) => format(new Date(date), "MMM d, h:mm a");

  // Track scroll position for progress indicator
  const handleScroll = () => {
    const el = viewportRef.current;
    if (!el) return;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(isNaN(progress) ? 0 : progress);
    setAtBottom(progress > 0.95);
    if (el.scrollTop > 40) setShowScrollHint(false);
  };

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  };

  const msgCount = conversation.messages.length;

  return (
    <div
      className="flex flex-col bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 dark:from-amber-950 dark:via-orange-950/60 dark:to-yellow-950"
      style={{
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Ambient background layers ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main orb */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 65%)" }}
        />
        {/* Secondary accent */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ background: "radial-gradient(circle, rgba(234,88,12,0.4) 0%, transparent 65%)" }}
        />
      </div>

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", ease, duration: 0.4 }}
        className="flex-shrink-0 relative z-20 px-5 py-3.5 border-b border-amber-200/50 dark:border-amber-800/50 bg-white/60 dark:bg-amber-950/60 backdrop-blur-xl"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Left — brand + conversation info */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5, delay: 0.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-white font-bold text-base">C</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "tween", ease, duration: 0.35, delay: 0.15 }}
              className="min-w-0"
            >
              <h1 className="text-sm font-bold text-amber-950 dark:text-amber-100 truncate leading-tight">
                {conversation.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  {conversation.user?.name ?? "Anonymous"}
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-500 dark:text-amber-500 flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5" />
                  {msgCount} {msgCount === 1 ? "message" : "messages"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right — CTA */}
          <motion.a
            href="/"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "tween", ease, duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-amber-200/50 dark:shadow-amber-900/50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Try CodaAI
          </motion.a>
        </div>

        {/* Scroll progress bar — spans full header width at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-100/60 dark:bg-amber-800/40">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 origin-left"
            style={{ scaleX: scrollProgress }}
            transition={{ type: "tween", duration: 0.05 }}
          />
        </div>
      </motion.header>

      {/* ── Message viewport — only this scrolls ── */}
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="chat-viewport flex-1 overflow-y-auto overflow-x-hidden relative z-10"
        style={{ minHeight: 0 }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-4 w-full">

          {/* Conversation date stamp */}
          {conversation.messages[0]?.createdAt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-800 to-transparent" />
              <span className="text-[10px] text-amber-500 dark:text-amber-500 font-medium flex items-center gap-1 px-2 py-1 bg-amber-100/60 dark:bg-amber-900/40 rounded-full">
                <Clock className="w-2.5 h-2.5" />
                {format(new Date(conversation.messages[0].createdAt), "MMMM d, yyyy")}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-800 to-transparent" />
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {conversation.messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, x: msg.role === "user" ? 8 : -8 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  type: "tween",
                  ease: [0.22, 1, 0.36, 1],
                  duration: 0.38,
                  delay: Math.min(index * 0.05, 0.35),
                }}
                className={`flex items-end gap-2.5 w-full ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3, delay: Math.min(index * 0.05, 0.35) + 0.06 }}
                  className="flex-shrink-0 mb-1"
                >
                  {msg.role === "assistant" ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : conversation.user?.image ? (
                    <Image
                      src={conversation.user.image}
                      alt={conversation.user.name ?? "User"}
                      width={32}
                      height={32}
                      className="rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* Bubble */}
                <div
                  className={`flex flex-col min-w-0 ${msg.role === "user" ? "items-end" : "items-start"}`}
                  style={{ maxWidth: "calc(100% - 52px)" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: "tween", duration: 0.15 }}
                    className={`rounded-2xl px-4 py-3 break-words shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-br-md shadow-amber-200/40 dark:shadow-amber-900/40"
                        : "bg-white/95 dark:bg-amber-900/70 text-amber-950 dark:text-amber-100 border border-amber-100/80 dark:border-amber-800/60 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </motion.div>

                  {msg.createdAt && (
                    <span className="text-[10px] text-amber-400/70 dark:text-amber-600/70 mt-1 px-1">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* ── Scroll-to-bottom hint ── */}
      <AnimatePresence>
        {showScrollHint && !atBottom && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "tween", ease, duration: 0.2 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-amber-800/80 dark:bg-amber-700/80 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg hover:bg-amber-700 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Scroll to see more
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", ease, duration: 0.35, delay: 0.25 }}
        className="flex-shrink-0 relative z-20 px-5 py-4 border-t border-amber-200/50 dark:border-amber-800/50 bg-white/60 dark:bg-amber-950/60 backdrop-blur-xl"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-1">
          <p className="text-xs text-amber-500/80 dark:text-amber-400/70 text-center">
            This is a shared conversation — messages are view‑only.
          </p>

          <motion.a
            href="/"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-amber-200/50 dark:shadow-amber-900/50"
          >
            Start your own chat with CodaAI
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </motion.footer>
    </div>
  );
}