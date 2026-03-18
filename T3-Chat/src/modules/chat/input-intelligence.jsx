"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, AlertCircle, ChevronRight, X, Wand2 } from "lucide-react";

// ─── Inject styles ─────────────────────────────────────────────────────────
const STYLES = `
  .ii-wrap {
    position: relative;
    display: block;
    width: 100%;
  }
  .ii-ghost {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    padding: 18px 22px 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
    color: transparent;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 1;
  }
  .ii-ghost-completion {
    color: rgba(0,0,0,0.28);
  }
  .ii-textarea {
    position: relative;
    z-index: 2;
    background: transparent !important;
    caret-color: #3B9EFF;
    display: block !important;
    width: 100% !important;
  }
`;

function useStyles() {
  useEffect(() => {
    const id = "input-intelligence-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);
}

// ─── Gemini API call ───────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 80,
          },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

// ─── Get next word/phrase suggestion from Gemini ───────────────────────────
async function getGeminiSuggestion(text) {
  if (!text || text.trim().length < 4) return null;

  const prompt = `You are helping autocomplete a chat message someone is typing to an AI assistant.

Current text: "${text}"

Predict the next 3-5 words they will type to complete their thought.
Rules:
- Return ONLY the next few words (the completion), not the full sentence
- Do not repeat any words already in the current text
- Keep it natural and conversational
- If the text already ends a complete sentence, return exactly: DONE
- No quotes, no punctuation at end, no explanation
- Maximum 5 words

Next words:`;

  const result = await callGemini(prompt);
  if (!result || result === "DONE" || result.length < 2) return null;

  const cleaned = result
    .replace(/^["'\-\*]+|["'\-\*]+$/g, "")
    .replace(/^(Next words:|completion:|Completion:)/i, "")
    .replace(/\n.*/s, "")
    .trim();

  if (cleaned.length < 2 || cleaned.length > 50) return null;
  return cleaned;
}

// ─── Grammar + spelling check from Gemini ─────────────────────────────────
async function getGeminiCorrections(text) {
  if (!text || text.trim().length < 8) return [];

  const prompt = `Check this text for spelling and grammar errors:

"${text}"

List up to 3 real errors found. For each, use this exact format:
TYPE|WRONG|CORRECT|FIX DESCRIPTION

TYPE must be exactly "spelling" or "grammar"
WRONG is the exact wrong word/phrase from the text
CORRECT is the fixed version
FIX DESCRIPTION is a short label (max 4 words)

Example output:
spelling|recieve|receive|Spelling: recieve
grammar|i went|I went|Capitalize: i

If there are NO errors, respond with exactly: NONE
Do not add any other text.`;

  const result = await callGemini(prompt);
  if (!result || result.trim() === "NONE" || result.trim() === "") return [];

  try {
    const lines = result
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.includes("|") && !l.startsWith("#"));

    return lines.slice(0, 3).map((line, i) => {
      const parts = line.split("|");
      if (parts.length < 4) return null;
      const [rawType, original, fixed, desc] = parts.map(p => p.trim());
      const type = rawType.toLowerCase().includes("spell") ? "spelling" : "grammar";
      return {
        id: `gemini-${i}-${Date.now()}`,
        type,
        original,
        fixed,
        message: desc,
        applyFix: (inputText) => {
          try {
            const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escaped, "gi");
            return inputText.replace(regex, fixed);
          } catch {
            return inputText.replace(original, fixed);
          }
        },
      };
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// ─── Loading Dots ──────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "0 2px" }}>
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
          style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "rgba(0,0,0,0.22)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Correction Pill ──────────────────────────────────────────────────────
function CorrectionPill({ item, onAccept, onDismiss }) {
  const isSpelling = item.type === "spelling";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 4 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 8px 3px 7px",
        borderRadius: 99,
        background: isSpelling ? "rgba(239,68,68,0.07)" : "rgba(59,158,255,0.07)",
        border: isSpelling ? "1px solid rgba(239,68,68,0.18)" : "1px solid rgba(59,158,255,0.18)",
        flexShrink: 0, cursor: "pointer",
        transition: "background 0.14s",
        userSelect: "none",
      }}
      onClick={() => onAccept(item)}
      onMouseEnter={e => {
        e.currentTarget.style.background = isSpelling
          ? "rgba(239,68,68,0.13)" : "rgba(59,158,255,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isSpelling
          ? "rgba(239,68,68,0.07)" : "rgba(59,158,255,0.07)";
      }}
    >
      {isSpelling
        ? <AlertCircle style={{ width: 10, height: 10, color: "#EF4444", flexShrink: 0 }} />
        : <CheckCircle style={{ width: 10, height: 10, color: "#3B9EFF", flexShrink: 0 }} />
      }
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: isSpelling ? "#DC2626" : "#1A7AF0",
        fontFamily: "'Inter', sans-serif",
        whiteSpace: "nowrap",
        maxWidth: 160,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {item.message}
      </span>
      <ChevronRight style={{
        width: 9, height: 9,
        color: isSpelling ? "rgba(220,38,38,0.45)" : "rgba(26,122,240,0.45)",
        flexShrink: 0,
      }} />
      <button
        onClick={e => { e.stopPropagation(); onDismiss(item.id); }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 0, display: "flex", alignItems: "center",
          opacity: 0.45, transition: "opacity 0.12s", marginLeft: 1,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
        onMouseLeave={e => e.currentTarget.style.opacity = "0.45"}
      >
        <X style={{ width: 9, height: 9, color: isSpelling ? "#DC2626" : "#1A7AF0" }} />
      </button>
    </motion.div>
  );
}

// ─── Main Hook ─────────────────────────────────────────────────────────────
export function useInputIntelligence(value, onChange) {
  const [inlineSuggestion, setInlineSuggestion] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingCorrections, setIsLoadingCorrections] = useState(false);

  const suggestionTimer = useRef(null);
  const correctionTimer = useRef(null);
  const lastValue = useRef("");

  // Inline suggestion — fires 650ms after typing stops
  useEffect(() => {
    clearTimeout(suggestionTimer.current);
    setInlineSuggestion(null);

    if (!value || value.trim().length < 4) {
      setIsLoadingSuggestion(false);
      return;
    }

    lastValue.current = value;
    setIsLoadingSuggestion(true);

    suggestionTimer.current = setTimeout(async () => {
      const suggestion = await getGeminiSuggestion(value);
      // Only apply if value hasn't changed while we were waiting
      if (value === lastValue.current) {
        setIsLoadingSuggestion(false);
        if (suggestion) {
          setInlineSuggestion(
            suggestion.startsWith(" ") ? suggestion : " " + suggestion
          );
        }
      }
    }, 450);

    return () => clearTimeout(suggestionTimer.current);
  }, [value]);

  // Corrections — fires 1400ms after typing stops
  useEffect(() => {
    clearTimeout(correctionTimer.current);

    if (!value || value.trim().length < 8) {
      setCorrections([]);
      setIsLoadingCorrections(false);
      return;
    }

    setIsLoadingCorrections(true);

    correctionTimer.current = setTimeout(async () => {
      const results = await getGeminiCorrections(value);
      setIsLoadingCorrections(false);
      const filtered = results.filter(c => !dismissed.has(c.id));
      setCorrections(filtered);
    }, 1400);

    return () => clearTimeout(correctionTimer.current);
  }, [value]); // eslint-disable-line

  // Reset everything when input is cleared
  useEffect(() => {
    if (!value) {
      setDismissed(new Set());
      setInlineSuggestion(null);
      setCorrections([]);
      setIsLoadingSuggestion(false);
      setIsLoadingCorrections(false);
    }
  }, [value]);

  // Tab = accept suggestion, Escape = dismiss
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Tab" && inlineSuggestion) {
      e.preventDefault();
      onChange(value + inlineSuggestion);
      setInlineSuggestion(null);
      setIsLoadingSuggestion(false);
    }
    if (e.key === "Escape") {
      setInlineSuggestion(null);
    }
  }, [inlineSuggestion, value, onChange]);

  const acceptCorrection = useCallback((item) => {
    const newValue = item.applyFix(value);
    onChange(newValue);
    setDismissed(prev => new Set([...prev, item.id]));
    setCorrections(prev => prev.filter(c => c.id !== item.id));
  }, [value, onChange]);

  const dismissCorrection = useCallback((id) => {
    setDismissed(prev => new Set([...prev, id]));
    setCorrections(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    inlineSuggestion,
    corrections,
    isLoadingSuggestion,
    isLoadingCorrections,
    handleKeyDown,
    acceptCorrection,
    dismissCorrection,
  };
}

// ─── Ghost Text overlay ────────────────────────────────────────────────────
export function GhostSuggestion({ value, suggestion, children }) {
  return (
    <div
      style={{
        position: "relative",
        display: "block",
        width: "100%",
      }}
    >
      {suggestion && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            pointerEvents: "none",
            padding: "18px 22px 10px",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            overflow: "hidden",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        >
          <span style={{ visibility: "hidden", whiteSpace: "pre-wrap" }}>{value}</span>
          <span style={{ color: "rgba(0,0,0,0.28)" }}>{suggestion}</span>
        </div>
      )}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Corrections Bar ──────────────────────────────────────────────────────
export function CorrectionsBar({ corrections, onAccept, onDismiss, isLoading = false }) {
  const hasContent = isLoading || corrections.length > 0;
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ overflow: "hidden" }}
      >
        <div style={{
          padding: "7px 14px 4px",
          display: "flex", alignItems: "center", gap: 6,
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <Wand2 style={{ width: 10, height: 10, color: "rgba(0,0,0,0.28)" }} />
            <span style={{
              fontSize: 9.5, fontWeight: 700,
              color: "rgba(0,0,0,0.28)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              AI
            </span>
          </div>

          {isLoading && corrections.length === 0 ? (
            <LoadingDots />
          ) : (
            <AnimatePresence>
              {corrections.map(item => (
                <CorrectionPill
                  key={item.id}
                  item={item}
                  onAccept={onAccept}
                  onDismiss={onDismiss}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tab Hint ─────────────────────────────────────────────────────────────
export function TabHint({ visible, isLoading = false }) {
  const show = visible || isLoading;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.14 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 7,
            background: isLoading ? "rgba(0,0,0,0.04)" : "rgba(59,158,255,0.08)",
            border: isLoading ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(59,158,255,0.18)",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <>
              <Sparkles style={{ width: 9, height: 9, color: "#3B9EFF" }} />
              <span style={{
                fontSize: 10, fontWeight: 600, color: "#3B9EFF",
                fontFamily: "'Inter', sans-serif",
              }}>
                Tab
              </span>
              <ChevronRight style={{ width: 9, height: 9, color: "rgba(59,158,255,0.5)" }} />
              <span style={{
                fontSize: 10, color: "rgba(59,158,255,0.7)",
                fontFamily: "'Inter', sans-serif",
              }}>
                accept
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}