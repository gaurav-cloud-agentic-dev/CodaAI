"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Copy, Check, Pencil, RefreshCw, X, CornerDownLeft,
  Sparkles, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTheme } from "./theme-context";

const ease   = { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.15 };
const fast   = { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.08 };
const spring = { type: "spring", stiffness: 700, damping: 40, mass: 0.5 };

const fmtTime = (d) => format(new Date(d), "MMM d · h:mm a");

function useInputRingStyles(isDark) {
  useEffect(() => {
    const id = "chat-form-input-ring-styles";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = `
      .chat-form-input-ring { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
      .chat-form-input-ring:focus-within {
        box-shadow: 0 0 0 2px rgba(${isDark ? "255,255,255,0.18" : "59,158,255,0.22"}),
          0 0 0 6px rgba(${isDark ? "255,255,255,0.05" : "59,158,255,0.06"}),
          0 20px 56px rgba(0,0,0,${isDark ? "0.40" : "0.06"}),
          inset 0 1px 0 rgba(255,255,255,${isDark ? "0.05" : "1"}) !important;
        border-color: ${isDark ? "rgba(255,255,255,0.22)" : "rgba(59,158,255,0.35)"} !important;
      }
      .chat-form-edit-ta::placeholder { color: ${isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)"}; }
      .chat-form-edit-ta::-webkit-scrollbar { width: 3px; }
      .chat-form-edit-ta::-webkit-scrollbar-thumb {
        background: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"}; border-radius: 99px;
      }
    `;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, [isDark]);
}

function useCopyText() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Clipboard access denied"); }
  }, []);
  return { copied, copy };
}

// ─── Edit Bar ─────────────────────────────────────────────────────────────────
function EditBar({ initialValue, onSave, onCancel }) {
  const { isDark } = useTheme();
  useInputRingStyles(isDark);

  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);
  const charLimit = 100000;
  const remaining = charLimit - value.length;
  const overLimit = remaining < 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, []);

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!overLimit && value.trim()) onSave(value.trim()); }
    if (e.key === "Escape") onCancel();
  };

  const wrapBg      = isDark ? "#252525"                        : "rgba(255,255,255,0.82)";
  const wrapBorder  = isDark ? "rgba(255,255,255,0.10)"         : "rgba(255,255,255,0.95)";
  const wrapShadow  = isDark
    ? "0 8px 32px rgba(0,0,0,0.50), 0 2px 8px rgba(0,0,0,0.30)"
    : "0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)";
  const labelColor  = isDark ? "rgba(255,255,255,0.35)"         : "rgba(0,0,0,0.35)";
  const dividerBg   = isDark ? "rgba(255,255,255,0.08)"         : "rgba(0,0,0,0.06)";
  const textColor   = isDark ? "rgba(255,255,255,0.88)"         : "rgba(0,0,0,0.78)";
  const progressBg  = isDark ? "rgba(255,255,255,0.08)"         : "rgba(0,0,0,0.06)";
  const hintColor   = isDark ? "rgba(255,255,255,0.28)"         : "rgba(0,0,0,0.28)";
  const cancelBg    = isDark ? "rgba(255,255,255,0.08)"         : "rgba(255,255,255,0.65)";
  const cancelBorder= isDark ? "rgba(255,255,255,0.10)"         : "rgba(0,0,0,0.08)";
  const cancelText  = isDark ? "rgba(255,255,255,0.60)"         : "rgba(0,0,0,0.55)";
  const cancelHover = isDark ? "rgba(255,255,255,0.14)"         : "rgba(255,255,255,0.88)";
  const disabledBg  = isDark ? "rgba(255,255,255,0.07)"         : "rgba(0,0,0,0.07)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 3 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 3 }}
      transition={ease}
      style={{ width: "100%" }}
    >
      <div
        className="chat-form-input-ring"
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          background: wrapBg,
          backdropFilter: isDark ? "none" : "blur(40px)",
          WebkitBackdropFilter: isDark ? "none" : "blur(40px)",
          border: `1px solid ${wrapBorder}`,
          boxShadow: wrapShadow,
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)"
            : "linear-gradient(90deg, transparent, rgba(59,158,255,0.4), transparent)",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Pencil style={{ width: 11, height: 11, color: labelColor }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: labelColor,
              fontFamily: "'Inter', sans-serif",
            }}>
              Editing Message
            </span>
          </div>
          <div style={{ flex: 1, height: 1, background: dividerBg }} />
          <span style={{
            fontSize: 10, fontFamily: "monospace",
            color: overLimit ? "#EF4444" : remaining < 100 ? (isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)") : (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)"),
            transition: "color 0.15s",
          }}>
            {remaining.toLocaleString()}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          className="chat-form-edit-ta"
          style={{
            width: "100%", background: "transparent",
            padding: "8px 16px", fontSize: 14, fontWeight: 400,
            color: textColor, outline: "none", resize: "none",
            lineHeight: 1.6, minHeight: 40, overflowY: "auto",
            boxSizing: "border-box", border: "none",
            caretColor: isDark ? "#FFFFFF" : "#3B9EFF",
            fontFamily: "'Inter', sans-serif",
          }}
          placeholder="Edit your message…"
        />

        <div style={{
          height: 2, margin: "0 16px 12px",
          borderRadius: 99, background: progressBg, overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${Math.min((value.length / charLimit) * 100, 100)}%` }}
            transition={fast}
            style={{
              height: "100%", borderRadius: 99,
              background: overLimit ? "#EF4444" : "linear-gradient(90deg, #60BFFF, #3B9EFF)",
            }}
          />
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px 14px",
        }}>
          <p style={{ fontSize: 10, color: hintColor, fontFamily: "'Inter', sans-serif", margin: 0 }}>
            <kbd style={{ fontFamily: "monospace" }}>Enter</kbd> to save ·{" "}
            <kbd style={{ fontFamily: "monospace" }}>Esc</kbd> to cancel
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={fast}
              onClick={onCancel}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 10, cursor: "pointer",
                background: cancelBg,
                border: `1px solid ${cancelBorder}`,
                fontSize: 12, fontWeight: 500, color: cancelText,
                fontFamily: "'Inter', sans-serif", transition: "background 0.14s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = cancelHover}
              onMouseLeave={e => e.currentTarget.style.background = cancelBg}
            >
              <X style={{ width: 12, height: 12 }} />
              Cancel
            </motion.button>

            <motion.button
              whileHover={!overLimit && value.trim() ? { scale: 1.02 } : {}}
              whileTap={!overLimit && value.trim() ? { scale: 0.97 } : {}}
              transition={fast}
              onClick={() => !overLimit && value.trim() && onSave(value.trim())}
              disabled={overLimit || !value.trim()}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 10, border: "none",
                fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                cursor: !overLimit && value.trim() ? "pointer" : "not-allowed",
                background: !overLimit && value.trim()
                  ? "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)"
                  : disabledBg,
                color: !overLimit && value.trim() ? "#fff" : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)"),
                boxShadow: !overLimit && value.trim()
                  ? "0 4px 14px rgba(59,158,255,0.38), inset 0 1px 0 rgba(255,255,255,0.28)"
                  : "none",
                opacity: overLimit || !value.trim() ? 0.5 : 1,
                transition: "all 0.15s",
              }}
            >
              <CornerDownLeft style={{ width: 12, height: 12 }} />
              Save Edit
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Action Pill ──────────────────────────────────────────────────────────────
function ActionPill({ icon, onClick, active = false, disabled = false, isDark }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 26, height: 26, borderRadius: 7,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        border: "none",
        background: hovered
          ? (isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)")
          : "transparent",
        color: active
          ? "#059669"
          : hovered
            ? (isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.70)")
            : (isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)"),
        transition: "background 0.12s ease, color 0.12s ease",
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
}

// ─── User Message ─────────────────────────────────────────────────────────────
// ── CHANGE 1: added onEditStart, onEditEnd to props ──────────────────────────
export function UserMessage({ message, onEdit, onRefresh, isRefreshing = false, onEditStart, onEditEnd }) {
  const { isDark } = useTheme();
  useInputRingStyles(isDark);

  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [expanded, setExpanded]       = useState(false);

  const editBarRef = useRef(null);

  useEffect(() => {
    if (!isEditing) return;
    setTimeout(() => {
      editBarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [isEditing]);

  const { copied, copy } = useCopyText();
  const hoverTimer       = useRef(null);

  const isLong = message.content.split("\n").length >= 50 || message.content.length > 1800;
  const displayContent = isLong && !expanded
    ? message.content.split("\n").slice(0, 10).join("\n")
    : message.content;

  const handleMouseEnter = () => { hoverTimer.current = setTimeout(() => setShowActions(true), 20); };
  const handleMouseLeave = () => { clearTimeout(hoverTimer.current); if (!isEditing) setShowActions(false); };

  // ── CHANGE 2: call onEditEnd in both save and cancel ─────────────────────
  const handleSaveEdit = (newContent) => {
    onEdit?.(message.id, newContent);
    setIsEditing(false);
    setShowActions(false);
    onEditEnd?.();
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowActions(false);
    onEditEnd?.();
  };

  const bubbleBg     = isDark ? "#2E2E2E"                        : "rgba(255,255,255,0.82)";
  const bubbleBorder = isDark ? "rgba(255,255,255,0.08)"         : "rgba(255,255,255,0.95)";
  const bubbleShadow = showActions
    ? (isDark
        ? "0 0 0 2px rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.35)"
        : "0 0 0 2px rgba(59,158,255,0.12), 0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)")
    : (isDark
        ? "0 2px 10px rgba(0,0,0,0.30)"
        : "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)");
  const msgTextColor  = isDark ? "rgba(255,255,255,0.88)"        : "rgba(0,0,0,0.78)";
  const dateColor     = showActions
    ? (isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.42)")
    : (isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0, width: "100%" }}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            ref={editBarRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fast}
            style={{ width: "100%", maxWidth: "75%", scrollMarginTop: "24px" }}
          >
            <EditBar
              initialValue={message.content}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          </motion.div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: "75%" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 18, borderBottomRightRadius: 5,
                padding: "10px 16px 10px",
                wordBreak: "break-word", cursor: "default", userSelect: "text",
                background: bubbleBg,
                backdropFilter: isDark ? "none" : "blur(20px)",
                WebkitBackdropFilter: isDark ? "none" : "blur(20px)",
                border: `1px solid ${bubbleBorder}`,
                boxShadow: bubbleShadow,
                transition: "box-shadow 0.22s ease",
              }}
            >
              <p style={{
                margin: 0, fontSize: 14, color: msgTextColor,
                whiteSpace: "pre-wrap", lineHeight: 1.65, fontWeight: 400,
                fontFamily: "'Inter', sans-serif",
              }}>
                {displayContent}
              </p>

              {isLong && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    marginTop: 6, background: "none", border: "none",
                    cursor: "pointer", padding: 0,
                    fontSize: 11.5, fontWeight: 600,
                    color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.42)",
                    fontFamily: "'Inter', sans-serif",
                    transition: "color 0.14s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.70)"}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.42)"}
                >
                  {expanded ? "Show less ↑" : "Show more ↓"}
                </button>
              )}

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "flex-start",
                gap: 2, marginTop: 6, minHeight: 22,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 0,
                  opacity: showActions ? 1 : 0,
                  pointerEvents: showActions ? "auto" : "none",
                  transition: "opacity 0.15s ease",
                }}>
                  <ActionPill
                    isDark={isDark}
                    icon={
                      <motion.span
                        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                        transition={isRefreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                        style={{ display: "inline-flex" }}
                      >
                        <RefreshCw style={{ width: 13, height: 13 }} />
                      </motion.span>
                    }
                    onClick={() => onRefresh?.(message.id)}
                    disabled={isRefreshing}
                  />
                  {/* ── CHANGE 3: call onEditStart when pencil is clicked ── */}
                  <ActionPill
                    isDark={isDark}
                    icon={<Pencil style={{ width: 13, height: 13 }} />}
                    onClick={() => { setIsEditing(true); setShowActions(false); onEditStart?.(); }}
                  />
                  <ActionPill
                    isDark={isDark}
                    icon={copied
                      ? <Check style={{ width: 13, height: 13 }} />
                      : <Copy  style={{ width: 13, height: 13 }} />
                    }
                    active={copied}
                    onClick={() => copy(message.content)}
                  />
                </div>

                {message.createdAt && (
                  <span style={{
                    fontSize: 10, fontWeight: 500,
                    color: dateColor,
                    fontFamily: "'Inter', sans-serif",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap", userSelect: "none", marginLeft: 4,
                    transition: "color 0.15s",
                  }}>
                    {fmtTime(message.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Message Section Refresh Button ──────────────────────────────────────────
export function MessageSectionRefresh({ onRefresh, isRefreshing = false }) {
  const { isDark } = useTheme();

  const bg        = isDark
    ? (isRefreshing ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.07)")
    : (isRefreshing ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.75)");
  const hoverBg   = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.92)";
  const border    = isDark ? "rgba(255,255,255,0.08)"  : "rgba(255,255,255,0.90)";
  const textColor = isDark ? "rgba(255,255,255,0.40)"  : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.35)"  : "rgba(0,0,0,0.40)";
  const shadow    = isDark ? "none"
    : (isRefreshing ? "none" : "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)");

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 16px", borderRadius: 99,
          cursor: isRefreshing ? "not-allowed" : "pointer",
          fontSize: 11.5, fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          background: bg,
          border: `1px solid ${border}`,
          color: textColor,
          boxShadow: shadow,
          backdropFilter: isDark ? "none" : "blur(12px)",
          WebkitBackdropFilter: isDark ? "none" : "blur(12px)",
          opacity: isRefreshing ? 0.7 : 1,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { if (!isRefreshing) e.currentTarget.style.background = hoverBg; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg; }}
      >
        <motion.span
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          style={{ display: "inline-flex", color: iconColor }}
        >
          <RefreshCw style={{ width: 13, height: 13 }} />
        </motion.span>
        {isRefreshing ? "Refreshing…" : "Refresh messages"}
      </button>
    </div>
  );
}

// ─── Chat Form (main export) ──────────────────────────────────────────────────
export default function ChatForm({
  messages = [],
  onEditMessage,
  onRefreshMessage,
  onRefreshSection,
  isSectionRefreshing = false,
  refreshingMessageId = null,
}) {
  const { isDark } = useTheme();
  useInputRingStyles(isDark);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <MessageSectionRefresh onRefresh={onRefreshSection} isRefreshing={isSectionRefreshing} />
      <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "8px 16px" }}>
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div
              key={msg.id || `msg-${index}`}
              style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                width: "100%", flexDirection: "row-reverse",
              }}
            >
              <div style={{ flexShrink: 0, marginBottom: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDark ? "#2E2E2E" : "rgba(255,255,255,0.72)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)"}`,
                  boxShadow: isDark ? "none" : "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>U</span>
                </div>
              </div>
              <UserMessage
                message={msg}
                onEdit={onEditMessage}
                onRefresh={onRefreshMessage}
                isRefreshing={refreshingMessageId === msg.id}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}