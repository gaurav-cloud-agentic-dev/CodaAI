"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Copy, Check, Pencil, RefreshCw, X, CornerDownLeft,
  Sparkles, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// ─── Animation presets ────────────────────────────────────────────────────────
const ease   = { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.15 };
const fast   = { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.08 };
const spring = { type: "spring", stiffness: 700, damping: 40, mass: 0.5 };

// ─── Inject styles ────────────────────────────────────────────────────────────
const INPUT_RING_CSS = `
  .chat-form-input-ring { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
  .chat-form-input-ring:focus-within {
    box-shadow: 0 0 0 2px rgba(59,158,255,0.22), 0 0 0 6px rgba(59,158,255,0.06),
      0 20px 56px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1) !important;
    border-color: rgba(59,158,255,0.35) !important;
  }
  .chat-form-edit-ta::placeholder { color: rgba(0,0,0,0.28); }
  .chat-form-edit-ta::-webkit-scrollbar { width: 3px; }
  .chat-form-edit-ta::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 99px; }
`;

function useInputRingStyles() {
  useEffect(() => {
    const id = "chat-form-input-ring-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id; tag.textContent = INPUT_RING_CSS;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const fmtTime = (d) => format(new Date(d), "MMM d · h:mm a");

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
  useInputRingStyles();
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);
  const charLimit = 4000;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 3 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 3 }}
      transition={ease}
      style={{ width: "100%" }}
    >
      {/* Glass edit container */}
      <div
        className="chat-form-input-ring"
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
        }}
      >
        {/* Top shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(59,158,255,0.4), transparent)",
        }} />

        {/* Header label */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 16px 6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Pencil style={{ width: 11, height: 11, color: "rgba(0,0,0,0.35)" }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(0,0,0,0.35)",
              fontFamily: "'Inter', sans-serif",
            }}>
              Editing Message
            </span>
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
          <span style={{
            fontSize: 10, fontFamily: "monospace",
            color: overLimit ? "#EF4444" : remaining < 100 ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)",
            transition: "color 0.15s",
          }}>
            {remaining.toLocaleString()}
          </span>
        </div>

        {/* Textarea */}
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
            color: "rgba(0,0,0,0.78)", outline: "none", resize: "none",
            lineHeight: 1.6, minHeight: 40, overflowY: "auto",
            boxSizing: "border-box", border: "none",
            caretColor: "#3B9EFF",
            fontFamily: "'Inter', sans-serif",
          }}
          placeholder="Edit your message…"
        />

        {/* Progress bar */}
        <div style={{
          height: 2, margin: "0 16px 12px",
          borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${Math.min((value.length / charLimit) * 100, 100)}%` }}
            transition={fast}
            style={{
              height: "100%", borderRadius: 99,
              background: overLimit
                ? "#EF4444"
                : "linear-gradient(90deg, #60BFFF, #3B9EFF)",
            }}
          />
        </div>

        {/* Action row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px 14px",
        }}>
          <p style={{
            fontSize: 10, color: "rgba(0,0,0,0.28)",
            fontFamily: "'Inter', sans-serif", margin: 0,
          }}>
            <kbd style={{ fontFamily: "monospace" }}>Enter</kbd> to save ·{" "}
            <kbd style={{ fontFamily: "monospace" }}>Esc</kbd> to cancel
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Cancel */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={fast}
              onClick={onCancel}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.55)",
                fontFamily: "'Inter', sans-serif", transition: "background 0.14s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
            >
              <X style={{ width: 12, height: 12 }} />
              Cancel
            </motion.button>

            {/* Save */}
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
                  : "rgba(0,0,0,0.07)",
                color: !overLimit && value.trim() ? "#fff" : "rgba(0,0,0,0.28)",
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

// ─── User Message ─────────────────────────────────────────────────────────────
export function UserMessage({ message, onEdit, onRefresh, isRefreshing = false }) {
  useInputRingStyles();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { copied, copy } = useCopyText();
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setShowActions(true), 20);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    if (!isEditing) setShowActions(false);
  };

  const handleSaveEdit = (newContent) => {
    onEdit?.(message.id, newContent);
    setIsEditing(false);
    setShowActions(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowActions(false);
  };

  return (
    <motion.div layout style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, width: "100%" }}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" style={{ width: "100%", maxWidth: "75%" }} layout>
            <EditBar
              initialValue={message.content}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="bubble"
            layout
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: "75%" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Message bubble — glass white */}
            <motion.div
              layout
              style={{
                position: "relative",
                borderRadius: 18, borderBottomRightRadius: 5,
                padding: "10px 16px",
                wordBreak: "break-word", cursor: "default", userSelect: "text",
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: showActions
                  ? "0 0 0 2px rgba(59,158,255,0.18), 0 6px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)"
                  : "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                transition: "box-shadow 0.22s ease",
              }}
            >
              <p style={{
                margin: 0, fontSize: 14, color: "rgba(0,0,0,0.78)",
                whiteSpace: "pre-wrap", lineHeight: 1.65, fontWeight: 400,
                fontFamily: "'Inter', sans-serif",
              }}>
                {message.content}
              </p>
            </motion.div>

            {/* Meta row: time + actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, paddingLeft: 4, paddingRight: 4 }}>
              {/* Timestamp */}
              {message.createdAt && (
                <motion.div
                  initial={false}
                  animate={{ opacity: showActions ? 0.65 : 0.35 }}
                  transition={fast}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Clock style={{ width: 9, height: 9, color: "rgba(0,0,0,0.35)" }} />
                  <span style={{
                    fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.40)",
                    fontFamily: "'Inter', sans-serif",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {fmtTime(message.createdAt)}
                  </span>
                </motion.div>
              )}

              {/* Action buttons */}
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, x: 4, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 4, scale: 0.95 }}
                    transition={fast}
                    style={{
                      display: "flex", alignItems: "center", gap: 2,
                      padding: "3px 4px", borderRadius: 12,
                      background: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(0,0,0,0.07)",
                      boxShadow: "0 2px 14px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    }}
                  >
                    {/* Copy */}
                    <ActionPill
                      icon={copied
                        ? <Check style={{ width: 11, height: 11 }} />
                        : <Copy style={{ width: 11, height: 11 }} />
                      }
                      label={copied ? "Copied" : "Copy"}
                      active={copied}
                      onClick={() => copy(message.content)}
                    />

                    <span style={{ width: 1, height: 12, background: "rgba(0,0,0,0.08)", flexShrink: 0 }} />

                    {/* Edit */}
                    <ActionPill
                      icon={<Pencil style={{ width: 11, height: 11 }} />}
                      label="Edit"
                      onClick={() => { setIsEditing(true); setShowActions(false); }}
                    />

                    <span style={{ width: 1, height: 12, background: "rgba(0,0,0,0.08)", flexShrink: 0 }} />

                    {/* Retry */}
                    <ActionPill
                      icon={
                        <motion.span
                          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                          transition={isRefreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                          style={{ display: "inline-flex" }}
                        >
                          <RefreshCw style={{ width: 11, height: 11 }} />
                        </motion.span>
                      }
                      label="Retry"
                      onClick={() => onRefresh?.(message.id)}
                      disabled={isRefreshing}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Action Pill ──────────────────────────────────────────────────────────────
function ActionPill({ icon, label, onClick, active = false, disabled = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={fast}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "4px 8px", borderRadius: 8, border: "none",
        minWidth: 0, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontSize: 10.5, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.12s ease",
        background: active
          ? "rgba(16,185,129,0.10)"
          : hovered ? "rgba(59,158,255,0.08)" : "transparent",
        border: active
          ? "1px solid rgba(16,185,129,0.25)"
          : hovered ? "1px solid rgba(59,158,255,0.18)" : "1px solid transparent",
        color: active
          ? "#059669"
          : hovered ? "#1A7AF0" : "rgba(0,0,0,0.48)",
        boxShadow: hovered && !active
          ? "0 1px 6px rgba(59,158,255,0.12)"
          : "none",
      }}
    >
      {icon}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={fast}
            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Message Section Refresh Button ──────────────────────────────────────────
export function MessageSectionRefresh({ onRefresh, isRefreshing = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}
    >
      <motion.button
        whileHover={!isRefreshing ? { scale: 1.02 } : {}}
        whileTap={!isRefreshing ? { scale: 0.97 } : {}}
        transition={spring}
        onClick={onRefresh}
        disabled={isRefreshing}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 16px", borderRadius: 99, border: "none",
          cursor: isRefreshing ? "not-allowed" : "pointer",
          fontSize: 11.5, fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          background: isRefreshing ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.90)",
          color: "rgba(0,0,0,0.45)",
          boxShadow: isRefreshing
            ? "none"
            : "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          opacity: isRefreshing ? 0.7 : 1,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { if (!isRefreshing) e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
        onMouseLeave={e => e.currentTarget.style.background = isRefreshing ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.75)"}
      >
        <motion.span
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          style={{ display: "inline-flex", color: "rgba(0,0,0,0.40)" }}
        >
          <RefreshCw style={{ width: 13, height: 13 }} />
        </motion.span>
        {isRefreshing ? "Refreshing…" : "Refresh messages"}
      </motion.button>
    </motion.div>
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
  useInputRingStyles();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <MessageSectionRefresh onRefresh={onRefreshSection} isRefreshing={isSectionRefreshing} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 16px" }}>
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div
              key={msg.id || `msg-${index}`}
              style={{ display: "flex", alignItems: "flex-end", gap: 8, width: "100%", flexDirection: "row-reverse" }}
            >
              {/* Avatar */}
              <div style={{ flexShrink: 0, marginBottom: 24 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.55)" }}>U</span>
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