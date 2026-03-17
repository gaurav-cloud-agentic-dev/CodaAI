"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Link, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ease = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.2 };

export default function ShareModal({ isOpen, onClose, shareUrl, onShare, onUnshare, isShared }) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    await onShare();
    setIsSharing(false);
  };

  const handleUnshare = async () => {
    await onUnshare();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.22)",
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* Centering wrapper */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 51,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, pointerEvents: "none",
          }}>
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={ease}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 440,
                pointerEvents: "auto",
                borderRadius: 22, overflow: "hidden",
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(48px)", WebkitBackdropFilter: "blur(48px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                background: "rgba(255,255,255,0.55)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(59,158,255,0.10)",
                    border: "1px solid rgba(59,158,255,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Share2 style={{ width: 17, height: 17, color: "#3B9EFF" }} />
                  </div>
                  <h3 style={{
                    margin: 0, fontSize: 17, fontWeight: 700,
                    color: "rgba(0,0,0,0.82)", letterSpacing: "-0.01em",
                  }}>
                    Share Conversation
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: 9, cursor: "pointer",
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                >
                  <X style={{ width: 15, height: 15, color: "rgba(0,0,0,0.50)" }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "20px 24px 24px" }}>
                {!isShared ? (
                  // ── Before sharing ──
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 16px", borderRadius: 14,
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.82)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}>
                      <Globe style={{ width: 18, height: 18, color: "rgba(0,0,0,0.45)", flexShrink: 0, marginTop: 1 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.72)" }}>
                          Share this conversation
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.42)", lineHeight: 1.55 }}>
                          Anyone with the link will be able to view this conversation. Your name will be visible.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleShare}
                      disabled={isSharing}
                      style={{
                        width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
                        cursor: isSharing ? "not-allowed" : "pointer",
                        background: isSharing
                          ? "rgba(0,0,0,0.07)"
                          : "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)",
                        color: isSharing ? "rgba(0,0,0,0.35)" : "#fff",
                        fontSize: 13, fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        opacity: isSharing ? 0.6 : 1,
                        boxShadow: isSharing ? "none" : "0 6px 22px rgba(59,158,255,0.40), inset 0 1px 0 rgba(255,255,255,0.28)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!isSharing) e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,158,255,0.52), inset 0 1px 0 rgba(255,255,255,0.28)"; }}
                      onMouseLeave={e => { if (!isSharing) e.currentTarget.style.boxShadow = "0 6px 22px rgba(59,158,255,0.40), inset 0 1px 0 rgba(255,255,255,0.28)"; }}
                    >
                      {isSharing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{
                              width: 16, height: 16,
                              border: "2px solid rgba(0,0,0,0.15)",
                              borderTopColor: "rgba(0,0,0,0.45)",
                              borderRadius: "50%",
                            }}
                          />
                          Generating link...
                        </>
                      ) : (
                        <>
                          <Link style={{ width: 16, height: 16 }} />
                          Create Share Link
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  // ── After sharing ──
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 16px", borderRadius: 14,
                      background: "rgba(34,197,94,0.07)",
                      border: "1px solid rgba(34,197,94,0.20)",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: "rgba(34,197,94,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                      }}>
                        <Check style={{ width: 12, height: 12, color: "#16A34A" }} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.72)" }}>
                          Link created successfully!
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.42)", lineHeight: 1.55 }}>
                          Share this link with anyone to let them view your conversation.
                        </p>
                      </div>
                    </div>

                    {/* Share URL */}
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        style={{
                          width: "100%", padding: "11px 48px 11px 14px",
                          borderRadius: 12, boxSizing: "border-box",
                          background: "rgba(255,255,255,0.60)",
                          border: "1px solid rgba(0,0,0,0.09)",
                          fontSize: 12.5, color: "rgba(0,0,0,0.65)",
                          fontFamily: "'Inter', sans-serif", outline: "none",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}
                      />
                      <button
                        onClick={handleCopy}
                        style={{
                          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                          width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                          background: "rgba(255,255,255,0.72)",
                          border: "1px solid rgba(0,0,0,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 0.14s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.95)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.72)"}
                      >
                        {copied
                          ? <Check style={{ width: 13, height: 13, color: "#16A34A" }} strokeWidth={2.5} />
                          : <Copy style={{ width: 13, height: 13, color: "rgba(0,0,0,0.50)" }} />
                        }
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={handleCopy}
                        style={{
                          flex: 1, padding: "10px 0", borderRadius: 11, border: "none", cursor: "pointer",
                          background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)",
                          color: "#fff", fontSize: 13, fontWeight: 600,
                          fontFamily: "'Inter', sans-serif",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                          boxShadow: "0 6px 22px rgba(59,158,255,0.40), inset 0 1px 0 rgba(255,255,255,0.28)",
                          transition: "box-shadow 0.14s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,158,255,0.52), inset 0 1px 0 rgba(255,255,255,0.28)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 22px rgba(59,158,255,0.40), inset 0 1px 0 rgba(255,255,255,0.28)"}
                      >
                        <Copy style={{ width: 14, height: 14 }} />
                        Copy Link
                      </button>
                      <button
                        onClick={handleUnshare}
                        style={{
                          padding: "10px 18px", borderRadius: 11, border: "none", cursor: "pointer",
                          background: "rgba(255,255,255,0.65)",
                          border: "1px solid rgba(0,0,0,0.09)",
                          fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.65)",
                          fontFamily: "'Inter', sans-serif",
                          transition: "background 0.14s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                      >
                        Unshare
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}