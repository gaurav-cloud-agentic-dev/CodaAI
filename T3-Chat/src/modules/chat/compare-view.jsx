"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, Mic, Plus, ChevronDown, LayoutGrid,
  Check, Trophy, Zap, Brain, Copy, RotateCcw,
} from "lucide-react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const COMPARE_CSS = `
  .cv-scroll::-webkit-scrollbar { width: 3px; }
  .cv-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 99px; }
  .cv-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }

  .cv-card-enter { animation: cv-rise 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
  @keyframes cv-rise { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .cv-typing span {
    display:inline-block; width:5px; height:5px; border-radius:50%;
    background:rgba(0,0,0,0.28); margin:0 2px;
    animation: cv-bounce 1s ease infinite;
  }
  .cv-typing span:nth-child(2) { animation-delay:.15s; }
  .cv-typing span:nth-child(3) { animation-delay:.30s; }
  @keyframes cv-bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

  .cv-rank-1 {
    background: rgba(255,255,255,0.88) !important;
    border-color: rgba(59,158,255,0.28) !important;
    box-shadow: 0 0 0 1px rgba(59,158,255,0.12), 0 4px 24px rgba(0,0,0,0.08) !important;
  }
`;

// ─── Model definitions — logic unchanged ─────────────────────────────────────
const COMPARE_MODELS = [
  { id:"claude-3-5-sonnet", label:"Claude 3.5 Sonnet", maker:"Anthropic", color:"#6366F1", dot:"#818CF8", group:"anthropic" },
  { id:"claude-3-opus",     label:"Claude 3 Opus",     maker:"Anthropic", color:"#7C3AED", dot:"#A78BFA", group:"anthropic" },
  { id:"gpt-4o",            label:"GPT-4o",             maker:"OpenAI",    color:"#059669", dot:"#34D399", group:"openai"    },
  { id:"gpt-4-turbo",       label:"GPT-4 Turbo",        maker:"OpenAI",    color:"#047857", dot:"#6EE7B7", group:"openai"    },
  { id:"gemini-1.5-pro",    label:"Gemini 1.5 Pro",     maker:"Google",    color:"#1D4ED8", dot:"#60A5FA", group:"google"    },
  { id:"gemini-flash",      label:"Gemini 2.0 Flash",   maker:"Google",    color:"#1E40AF", dot:"#93C5FD", group:"google"    },
  { id:"grok-2",            label:"Grok-2",              maker:"xAI",       color:"#374151", dot:"#9CA3AF", group:"xai"       },
  { id:"deepseek-v3",       label:"DeepSeek-V3",         maker:"DeepSeek",  color:"#0E7490", dot:"#22D3EE", group:"deepseek"  },
  { id:"mistral-large",     label:"Mistral Large",       maker:"Mistral",   color:"#D97706", dot:"#FCD34D", group:"mistral"   },
];

const DEFAULT_SELECTED = ["claude-3-5-sonnet","gpt-4o","gemini-1.5-pro","grok-2"];
const SCORES_CRITERIA  = ["Accuracy","Code","Clarity","Depth","Speed"];

// ─── Score simulator — logic unchanged ───────────────────────────────────────
function getScores(modelId, query) {
  const h = (modelId + query).split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const base = { "claude-3-5-sonnet":88,"claude-3-opus":86,"gpt-4o":85,"gpt-4-turbo":83,
                 "gemini-1.5-pro":82,"gemini-flash":78,"grok-2":80,"deepseek-v3":81,"mistral-large":79 };
  const b = base[modelId] || 78;
  return SCORES_CRITERIA.reduce((acc, c, i) => {
    acc[c] = Math.min(99, Math.max(55, b + ((h >> (i * 4)) & 0xf) - 7));
    return acc;
  }, {});
}
function totalScore(scores) {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ─── Helpers — logic unchanged ────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);
  return { copied, copy };
}

// ─── Single response panel ────────────────────────────────────────────────────
function ResponsePanel({ model, response, rank, isLoading, query }) {
  const { copied, copy } = useCopy();
  const scores  = response ? getScores(model.id, query) : null;
  const total   = scores ? totalScore(scores) : null;
  const isWinner = rank === 1;

  return (
    <div
      className={`cv-card-enter flex flex-col overflow-hidden ${isWinner ? "cv-rank-1" : ""}`}
      style={{
        borderRadius: 18,
        border: "1px solid",
        borderColor: isWinner ? "rgba(59,158,255,0.28)" : "rgba(255,255,255,0.88)",
        background: isWinner
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: isWinner
          ? "0 0 0 1px rgba(59,158,255,0.12), 0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)"
          : "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        minHeight: 0, height: "100%",
        animationDelay: `${rank * 0.06}s`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Panel header */}
      <div style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "11px 14px 10px",
        display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        {/* Rank badge */}
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: 10, fontWeight: 700,
          background: isWinner
            ? "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)"
            : "rgba(0,0,0,0.06)",
          color: isWinner ? "#fff" : "rgba(0,0,0,0.45)",
          boxShadow: isWinner ? "0 2px 8px rgba(59,158,255,0.38)" : "none",
        }}>
          {isWinner ? <Trophy style={{ width: 10, height: 10 }} /> : rank}
        </div>

        {/* Color dot + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: model.dot }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.78)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {model.label}
          </span>
          <span style={{ fontSize: 9.5, color: "rgba(0,0,0,0.32)", flexShrink: 0 }}>{model.maker}</span>
        </div>

        {/* Score */}
        {total && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: model.color }}>{total}</span>
            <span style={{ fontSize: 9, color: "rgba(0,0,0,0.28)" }}>/100</span>
          </div>
        )}

        {/* Copy */}
        {response && (
          <button
            onClick={() => copy(response)}
            style={{
              width: 24, height: 24, borderRadius: 8, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer", transition: "background 0.14s",
              background: copied ? "rgba(16,185,129,0.10)" : "rgba(255,255,255,0.65)",
              border: "1px solid",
              borderColor: copied ? "rgba(16,185,129,0.25)" : "rgba(0,0,0,0.08)",
            }}
          >
            {copied
              ? <Check style={{ width: 11, height: 11, color: "#059669" }} />
              : <Copy style={{ width: 11, height: 11, color: "rgba(0,0,0,0.40)" }} />
            }
          </button>
        )}
      </div>

      {/* Score bars */}
      {scores && (
        <div style={{
          display: "flex", gap: 8, padding: "8px 14px",
          borderBottom: "1px solid rgba(0,0,0,0.05)", flexShrink: 0,
        }}>
          {SCORES_CRITERIA.map(c => (
            <div key={c} style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: "rgba(0,0,0,0.32)", marginBottom: 3, fontWeight: 500 }}>
                {c.slice(0, 3)}
              </div>
              <div style={{ height: 3, borderRadius: 99, overflow: "hidden", background: "rgba(0,0,0,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scores[c]}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 99, background: model.color }}
                />
              </div>
              <div style={{ fontSize: 8, fontFamily: "monospace", marginTop: 2, color: model.color }}>
                {scores[c]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response body */}
      <div className="cv-scroll" style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
              background: `${model.color}18`,
              border: `1px solid ${model.color}40`,
            }}>
              <Brain style={{ width: 10, height: 10, color: model.color }} />
            </div>
            <div className="cv-typing" style={{ paddingTop: 4 }}>
              <span /><span /><span />
            </div>
          </div>
        ) : response ? (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
              background: `${model.color}18`,
              border: `1px solid ${model.color}40`,
            }}>
              <Brain style={{ width: 10, height: 10, color: model.color }} />
            </div>
            <p style={{
              margin: 0, fontSize: 12.5, lineHeight: 1.65,
              color: "rgba(0,0,0,0.72)", whiteSpace: "pre-wrap",
              fontFamily: "'Inter', sans-serif",
            }}>
              {response}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.22)", fontFamily: "'Inter', sans-serif" }}>
              Waiting…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Model picker — logic unchanged ──────────────────────────────────────────
function ModelPicker({ selected, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {COMPARE_MODELS.map(m => {
        const on = selected.includes(m.id);
        return (
          <button
            key={m.id}
            onClick={() => {
              if (on && selected.length <= 2) return;
              onChange(on ? selected.filter(x => x !== m.id) : [...selected, m.id].slice(0, 6));
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.15s",
              background: on ? `${m.color}14` : "rgba(255,255,255,0.65)",
              border: `1px solid ${on ? m.color + "45" : "rgba(0,0,0,0.08)"}`,
              color: on ? m.color : "rgba(0,0,0,0.55)",
              opacity: !on && selected.length >= 6 ? 0.4 : 1,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: on ? m.dot : "rgba(0,0,0,0.20)" }} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main CompareView ─────────────────────────────────────────────────────────
export default function CompareView({ onClose }) {
  const [query,      setQuery]      = useState("");
  const [selected,   setSelected]   = useState(DEFAULT_SELECTED);
  const [responses,  setResponses]  = useState({});
  const [loading,    setLoading]    = useState({});
  const [hasRun,     setHasRun]     = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);
  const styleRef    = useRef(false);

  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const id = "compare-view-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = COMPARE_CSS;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [query]);

  const runComparison = useCallback(async () => {
    if (!query.trim() || Object.values(loading).some(Boolean)) return;
    setHasRun(true);
    setResponses({});
    const initLoading = {};
    selected.forEach(id => initLoading[id] = true);
    setLoading(initLoading);

    const prompt = `You are evaluating how different AI models would respond to this user query. Provide realistic, genuinely helpful responses that each model would give.

USER QUERY:
"""
${query}
"""

For each model listed, write the response that model would actually give. Be realistic about each model's strengths.
Respond ONLY in JSON, no markdown fences:
{
  "responses": {
    "claude-3-5-sonnet": "full response here...",
    "claude-3-opus": "full response here...",
    "gpt-4o": "full response here...",
    "gpt-4-turbo": "full response here...",
    "gemini-1.5-pro": "full response here...",
    "gemini-flash": "full response here...",
    "grok-2": "full response here...",
    "deepseek-v3": "full response here...",
    "mistral-large": "full response here..."
  }
}

Only include responses for these models: ${selected.join(", ")}
Keep each response focused and 3-6 sentences. Show genuine differences in style, depth, and approach between models.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data  = await res.json();
      const raw   = data.content?.map(b => b.text || "").join("") || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const entries = Object.entries(parsed.responses || {});
      entries.forEach(([id, text], i) => {
        setTimeout(() => {
          setResponses(prev => ({ ...prev, [id]: text }));
          setLoading(prev => ({ ...prev, [id]: false }));
        }, i * 180);
      });
    } catch (err) {
      console.error(err);
      const fallback = {};
      selected.forEach(id => fallback[id] = false);
      setLoading(fallback);
    }
  }, [query, selected]);

  const rankedModels = selected
    .map(id => ({
      model: COMPARE_MODELS.find(m => m.id === id),
      response: responses[id] || null,
      isLoading: loading[id] || false,
    }))
    .filter(x => x.model)
    .sort((a, b) => {
      if (!a.response && !b.response) return 0;
      if (!a.response) return 1;
      if (!b.response) return -1;
      return totalScore(getScores(b.model.id, query)) - totalScore(getScores(a.model.id, query));
    });

  const cols = rankedModels.length <= 2 ? 2 : rankedModels.length <= 4 ? 2 : 3;

  const isRunning = Object.values(loading).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        zIndex: 40,
        fontFamily: "'Inter', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Background layers — same 3-layer system ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "#EBEBEB" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "60%", height: "65%", borderRadius: "50%", background: "rgba(199,210,254,0.18)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", top: "-15%", right: "-15%", width: "55%", height: "60%", borderRadius: "50%", background: "rgba(186,230,253,0.15)", filter: "blur(110px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(221,214,254,0.14)", filter: "blur(105px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(253,213,200,0.12)", filter: "blur(105px)" }} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(255,255,255,0.62)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }} />

      {/* All content above bg */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>

        {/* ── Top bar ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px", flexShrink: 0,
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}>
          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.92)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
            }}>
              <LayoutGrid style={{ width: 15, height: 15, color: "rgba(0,0,0,0.55)" }} />
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.82)" }}>Compare Models</span>
              <span style={{ fontSize: 10.5, color: "rgba(0,0,0,0.35)", marginLeft: 8 }}>
                {selected.length} models
              </span>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Model picker toggle */}
          <button
            onClick={() => setShowPicker(p => !p)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
              background: showPicker ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.65)",
              border: `1px solid ${showPicker ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)"}`,
              color: "rgba(0,0,0,0.62)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
              transition: "all 0.14s",
            }}
          >
            <ChevronDown style={{
              width: 12, height: 12,
              transform: showPicker ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }} />
            Models
          </button>

          {/* Reset */}
          {hasRun && (
            <button
              onClick={() => { setResponses({}); setHasRun(false); setQuery(""); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.08)",
                color: "rgba(0,0,0,0.55)", transition: "background 0.14s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
            >
              <RotateCcw style={{ width: 12, height: 12 }} />
              Reset
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 10, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.08)",
              transition: "background 0.14s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
          >
            <X style={{ width: 15, height: 15, color: "rgba(0,0,0,0.55)" }} />
          </button>
        </div>

        {/* ── Model picker panel ── */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ overflow: "hidden", flexShrink: 0 }}
            >
              <div style={{
                padding: "12px 20px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.50)",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.35)",
                  marginBottom: 10, fontFamily: "'Inter', sans-serif",
                }}>
                  Select models to compare (2–6)
                </div>
                <ModelPicker selected={selected} onChange={setSelected} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input bar ── */}
        <div style={{
          flexShrink: 0, padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.45)",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
            {/* Textarea wrapper */}
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{
                borderRadius: 18,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.92)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
                overflow: "hidden",
              }}>
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Paste your code, error, or question… all models will respond simultaneously"
                  rows={1}
                  style={{
                    width: "100%", padding: "12px 18px",
                    background: "transparent", border: "none", outline: "none",
                    resize: "none", fontSize: 13.5, fontWeight: 400,
                    lineHeight: 1.6, color: "rgba(0,0,0,0.72)",
                    fontFamily: "'Inter', sans-serif",
                    caretColor: "#3B9EFF",
                    maxHeight: 120, minHeight: 44, boxSizing: "border-box",
                  }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runComparison(); } }}
                />
                {/* Model chips */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    {selected.map(id => {
                      const m = COMPARE_MODELS.find(x => x.id === id);
                      return m ? (
                        <div key={id} style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "2px 7px", borderRadius: 6,
                          fontSize: 9.5, fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                          background: `${m.color}12`,
                          color: m.color,
                          border: `1px solid ${m.color}28`,
                        }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: m.dot }} />
                          {m.label.split(" ")[0]}
                        </div>
                      ) : null;
                    })}
                  </div>
                  <span style={{ fontSize: 9.5, color: "rgba(0,0,0,0.25)", fontFamily: "monospace" }}>
                    Enter to run
                  </span>
                </div>
              </div>
            </div>

            {/* Run button */}
            <motion.button
              onClick={runComparison}
              disabled={!query.trim() || isRunning}
              whileHover={query.trim() && !isRunning ? { scale: 1.04 } : {}}
              whileTap={query.trim() && !isRunning ? { scale: 0.96 } : {}}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0 20px", height: 48, borderRadius: 14,
                border: "none", cursor: query.trim() && !isRunning ? "pointer" : "not-allowed",
                fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                flexShrink: 0, alignSelf: "flex-end",
                background: query.trim() && !isRunning
                  ? "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)"
                  : "rgba(0,0,0,0.07)",
                color: query.trim() && !isRunning ? "#fff" : "rgba(0,0,0,0.35)",
                boxShadow: query.trim() && !isRunning
                  ? "0 6px 22px rgba(59,158,255,0.42), inset 0 1px 0 rgba(255,255,255,0.28)"
                  : "none",
                opacity: !query.trim() && !isRunning ? 0.5 : 1,
                transition: "all 0.16s",
              }}
            >
              {isRunning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                  }}
                />
              ) : (
                <Zap style={{ width: 15, height: 15 }} />
              )}
              {isRunning ? "Running…" : "Run All"}
            </motion.button>
          </div>
        </div>

        {/* ── Response grid ── */}
        <div style={{ flex: 1, overflow: "hidden", padding: 14 }}>
          {!hasRun ? (
            // Empty state
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(255,255,255,0.92)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
              }}>
                <LayoutGrid style={{ width: 24, height: 24, color: "rgba(0,0,0,0.30)" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.50)", fontFamily: "'Inter', sans-serif" }}>
                  Send a query to compare all models
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.30)", fontFamily: "'Inter', sans-serif" }}>
                  Responses appear side-by-side, ranked by score
                </p>
              </div>
              {/* Preview model chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                {selected.map(id => {
                  const m = COMPARE_MODELS.find(x => x.id === id);
                  return m ? (
                    <div key={id} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 10px", borderRadius: 10,
                      fontSize: 11.5, fontFamily: "'Inter', sans-serif",
                      background: `${m.color}10`, color: m.color,
                      border: `1px solid ${m.color}28`,
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: m.dot }} />
                      {m.label}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : (
            <div style={{
              height: "100%", display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 12,
            }}>
              {rankedModels.map(({ model, response, isLoading }, idx) => (
                <ResponsePanel
                  key={model.id}
                  model={model}
                  response={response}
                  rank={idx + 1}
                  isLoading={isLoading}
                  query={query}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}