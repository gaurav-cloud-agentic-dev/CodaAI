"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, User, ExternalLink, ChevronDown, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const SCROLLBAR_CSS = `
  html, body { overflow: hidden !important; height: 100% !important; }
  .chat-viewport::-webkit-scrollbar { width: 4px; }
  .chat-viewport::-webkit-scrollbar-track { background: transparent; }
  .chat-viewport::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 99px; }
  .chat-viewport::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.32); }
  .chat-viewport { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }
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
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
        height: "100vh", overflow: "hidden", position: "relative",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* ── Background layers ── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, background: "#EBEBEB" }}
      />
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}
      >
        <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "60%", height: "65%", borderRadius: "50%", background: "rgba(199,210,254,0.18)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", top: "-15%", right: "-15%", width: "55%", height: "60%", borderRadius: "50%", background: "rgba(186,230,253,0.15)", filter: "blur(110px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(221,214,254,0.14)", filter: "blur(105px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(253,213,200,0.12)", filter: "blur(105px)" }} />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "rgba(255,255,255,0.62)",
          backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        }}
      />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", ease, duration: 0.4 }}
        style={{
          flexShrink: 0, position: "relative", zIndex: 20,
          padding: "14px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5, delay: 0.1 }}
              style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800, color: "rgba(0,0,0,0.78)", letterSpacing: "-0.02em" }}>
                C
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "tween", ease, duration: 0.35, delay: 0.15 }}
              style={{ minWidth: 0 }}
            >
              <h1 style={{
                margin: 0, fontSize: 14, fontWeight: 700,
                color: "rgba(0,0,0,0.82)", letterSpacing: "-0.01em",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {conversation.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: "rgba(0,0,0,0.42)", fontWeight: 500 }}>
                  {conversation.user?.name ?? "Anonymous"}
                </span>
                <span style={{
                  width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(0,0,0,0.20)", display: "inline-block",
                }} />
                <span style={{
                  fontSize: 11, color: "rgba(0,0,0,0.35)",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <MessageSquare style={{ width: 10, height: 10 }} />
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flexShrink: 0,
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px", borderRadius: 11,
              background: "rgba(15,15,22,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff", fontSize: 12, fontWeight: 600,
              textDecoration: "none", letterSpacing: "0.01em",
              boxShadow: "0 4px 16px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <ExternalLink style={{ width: 13, height: 13 }} />
            Try CodaAI
          </motion.a>
        </div>

        {/* Scroll progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 2, background: "rgba(0,0,0,0.05)",
        }}>
          <motion.div
            style={{
              height: "100%", originX: 0,
              background: "linear-gradient(90deg, #60BFFF, #3B9EFF, #1A7AF0)",
              scaleX: scrollProgress,
            }}
            transition={{ type: "tween", duration: 0.05 }}
          />
        </div>
      </motion.header>

      {/* ── Message viewport ── */}
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="chat-viewport"
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          position: "relative", zIndex: 10, minHeight: 0,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 32px", width: "100%" }}>

          {/* Date stamp */}
          {conversation.messages[0]?.createdAt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
            >
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
              <span style={{
                fontSize: 10.5, color: "rgba(0,0,0,0.38)", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 12px", borderRadius: 99,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(255,255,255,0.90)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                fontFamily: "'Inter', sans-serif",
              }}>
                <Clock style={{ width: 10, height: 10 }} />
                {format(new Date(conversation.messages[0].createdAt), "MMMM d, yyyy")}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
            </motion.div>
          )}

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {conversation.messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, x: msg.role === "user" ? 8 : -8 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  type: "tween", ease: [0.22, 1, 0.36, 1],
                  duration: 0.38, delay: Math.min(index * 0.05, 0.35),
                }}
                style={{
                  display: "flex", alignItems: "flex-end", gap: 10, width: "100%",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "tween", ease: [0.22, 1, 0.36, 1],
                    duration: 0.3, delay: Math.min(index * 0.05, 0.35) + 0.06,
                  }}
                  style={{ flexShrink: 0, marginBottom: 4 }}
                >
                  {msg.role === "assistant" ? (
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.90)",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Bot style={{ width: 14, height: 14, color: "rgba(0,0,0,0.45)" }} />
                    </div>
                  ) : conversation.user?.image ? (
                    <Image
                      src={conversation.user.image}
                      alt={conversation.user.name ?? "User"}
                      width={30}
                      height={30}
                      style={{ borderRadius: "50%", boxShadow: "0 1px 6px rgba(0,0,0,0.10)" }}
                    />
                  ) : (
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "rgba(255,255,255,0.72)",
                      border: "1px solid rgba(255,255,255,0.90)",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <User style={{ width: 14, height: 14, color: "rgba(0,0,0,0.50)" }} />
                    </div>
                  )}
                </motion.div>

                {/* Bubble */}
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  minWidth: 0, maxWidth: "calc(100% - 52px)",
                }}>
                  <div style={{
                    padding: "11px 16px",
                    borderRadius: 18,
                    borderBottomRightRadius: msg.role === "user" ? 5 : 18,
                    borderBottomLeftRadius: msg.role === "user" ? 18 : 5,
                    background: msg.role === "user"
                      ? "rgba(255,255,255,0.88)"
                      : "rgba(255,255,255,0.68)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: msg.role === "user"
                      ? "0 2px 14px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)"
                      : "0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                    wordBreak: "break-word",
                  }}>
                    <p style={{
                      margin: 0, fontSize: 14, lineHeight: 1.65,
                      color: "rgba(0,0,0,0.78)",
                      whiteSpace: "pre-wrap",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {msg.content}
                    </p>
                  </div>
                  {msg.createdAt && (
                    <span style={{
                      fontSize: 10.5, color: "rgba(0,0,0,0.28)",
                      marginTop: 4, paddingLeft: 4, paddingRight: 4,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ height: 16 }} />
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
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: "absolute", bottom: 90,
              left: "50%", transform: "translateX(-50%)",
              zIndex: 30,
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)",
              outline: "1px solid rgba(255,255,255,0.95)",
              fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.60)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <ChevronDown style={{ width: 14, height: 14 }} />
            Scroll to see more
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", ease, duration: 0.35, delay: 0.25 }}
        style={{
          flexShrink: 0, position: "relative", zIndex: 20,
          padding: "14px 24px",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <p style={{
            margin: 0, fontSize: 11.5, color: "rgba(0,0,0,0.35)",
            textAlign: "center", fontFamily: "'Inter', sans-serif",
          }}>
            This is a shared conversation — messages are view‑only.
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "10px 22px", borderRadius: 12,
              background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)",
              color: "#fff", fontSize: 13, fontWeight: 600,
              textDecoration: "none", letterSpacing: "0.01em",
              boxShadow: "0 6px 22px rgba(59,158,255,0.40), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
          >
            Start your own chat with CodaAI
            <ExternalLink style={{ width: 13, height: 13 }} />
          </motion.a>
        </div>
      </motion.footer>
    </div>
  );
}