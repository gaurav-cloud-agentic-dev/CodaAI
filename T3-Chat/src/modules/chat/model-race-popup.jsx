"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Zap, Check, ChevronDown, RotateCcw, ArrowUp, Activity } from "lucide-react";

// ─── Global styles ────────────────────────────────────────────────────────────
const INJECT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .mr-root * { box-sizing: border-box; }
  .mr-root { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  .mr-mono { font-family: 'ui-monospace', 'SF Mono', monospace; }

  .mr-scroll::-webkit-scrollbar { width: 3px; }
  .mr-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 99px; }
  .mr-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }

  .mr-card {
    position: relative;
    background: rgba(255,255,255,0.65);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 18px;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: default;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .mr-card.clickable { cursor: pointer; }
  .mr-card.clickable:hover {
    border-color: rgba(255,255,255,0.98);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1);
  }
  .mr-card.winner {
    border-color: rgba(0,0,0,0.12) !important;
    background: rgba(255,255,255,0.88) !important;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1) !important;
  }
  .mr-card.selected {
    transform: translateY(-2px);
    box-shadow: 0 0 0 2px rgba(0,0,0,0.18), 0 10px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1) !important;
    border-color: rgba(255,255,255,0.95) !important;
  }
  .mr-card.streaming {
    border-color: rgba(0,0,0,0.10) !important;
  }

  .mr-use-btn {
    width: 100%; padding: 9px 0; border-radius: 10px; border: none;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .mr-use-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .mr-use-btn:active { transform: translateY(0); }

  .mr-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
    white-space: nowrap; font-family: 'Inter', sans-serif;
  }

  @keyframes mr-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .mr-shimmer {
    background: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 75%);
    background-size: 200% auto;
    animation: mr-shimmer 1.8s linear infinite;
  }

  @keyframes mr-cursor-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  .mr-cursor {
    display: inline-block; width: 2px; height: 13px;
    margin-left: 2px; vertical-align: text-bottom;
    animation: mr-cursor-blink 0.65s ease infinite;
  }

  @keyframes mr-live-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.2); }
  }

  @keyframes mr-score-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1);   opacity: 1; }
  }
  .mr-score-pop { animation: mr-score-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
`;

// ─── Model display config — logic unchanged ───────────────────────────────────
const MODEL_DISPLAY = {
  "claude-3-5-sonnet": { short:"Sonnet 4.5",    maker:"Anthropic", accent:"#6366F1", glow:"rgba(99,102,241,0.15)",  icon:"◆" },
  "claude-3-opus":     { short:"Opus 4.5",      maker:"Anthropic", accent:"#7C3AED", glow:"rgba(124,58,237,0.15)", icon:"◆" },
  "gpt-4o":            { short:"GPT-4o",         maker:"OpenAI",    accent:"#059669", glow:"rgba(5,150,105,0.15)",  icon:"●" },
  "gpt-4-turbo":       { short:"o3-mini",        maker:"OpenAI",    accent:"#047857", glow:"rgba(4,120,87,0.14)",   icon:"●" },
  "gemini-1-5-pro":    { short:"Gemini Pro",     maker:"Google",    accent:"#1D4ED8", glow:"rgba(29,78,216,0.15)",  icon:"▲" },
  "gemini-flash":      { short:"Gemini Flash",   maker:"Google",    accent:"#2563EB", glow:"rgba(37,99,235,0.14)",  icon:"▲" },
  "grok-2":            { short:"Grok-3",          maker:"xAI",       accent:"#374151", glow:"rgba(55,65,81,0.15)",   icon:"■" },
  "deepseek-v3":       { short:"DeepSeek V3",    maker:"DeepSeek",  accent:"#0E7490", glow:"rgba(14,116,144,0.15)", icon:"◉" },
  "mistral-large":     { short:"Mistral",         maker:"Mistral",   accent:"#D97706", glow:"rgba(217,119,6,0.14)",  icon:"★" },
  "llama-4":           { short:"Llama 4",         maker:"Meta",      accent:"#7C3AED", glow:"rgba(124,58,237,0.14)", icon:"▼" },
  "deepseek-r1":       { short:"DS R1",           maker:"DeepSeek",  accent:"#0891B2", glow:"rgba(8,145,178,0.14)",  icon:"◉" },
  "llama-4-mvk":       { short:"Llama 4 Mvk",    maker:"Meta",      accent:"#5A7A3E", glow:"rgba(90,122,62,0.15)",  icon:"▼" },
  "llama-4-scout":     { short:"Llama 4 Scout",  maker:"Meta",      accent:"#4A6A35", glow:"rgba(74,106,53,0.14)",  icon:"▼" },
  "llama-3-70b":       { short:"Llama 3.3",       maker:"Meta",      accent:"#3A5A2A", glow:"rgba(58,90,42,0.14)",   icon:"▼" },
  "gemini-pro":        { short:"Gemini 2.5 Pro", maker:"Google",    accent:"#1D4ED8", glow:"rgba(29,78,216,0.15)",  icon:"▲" },
  "gemma-27b":         { short:"Gemma 3",         maker:"Google",    accent:"#2563EB", glow:"rgba(37,99,235,0.14)",  icon:"▲" },
  "mistral-sm":        { short:"Mistral 3.1",     maker:"Mistral",   accent:"#D97706", glow:"rgba(217,119,6,0.14)",  icon:"★" },
  "qwq-32b":           { short:"QwQ 32B",         maker:"Qwen",      accent:"#7C3AED", glow:"rgba(124,58,237,0.14)", icon:"■" },
  "nemotron":          { short:"Nemotron 253B",  maker:"Nvidia",    accent:"#0EA5E9", glow:"rgba(14,165,233,0.14)", icon:"●" },
};

function getDisplay(uiKey, apiMeta) {
  const base = MODEL_DISPLAY[uiKey] ?? {
    short: apiMeta?.short ?? uiKey,
    maker: apiMeta?.provider ?? "Unknown",
    accent: "rgba(0,0,0,0.55)",
    glow:   "rgba(0,0,0,0.08)",
    icon:   "·",
  };
  return { ...base, short: apiMeta?.short ?? base.short, maker: apiMeta?.provider ?? base.maker };
}

const CRITERIA   = ["accuracy", "relevance", "depth", "clarity", "concision"];
const CRIT_LABEL = { accuracy:"ACC", relevance:"REL", depth:"DEP", clarity:"CLR", concision:"CON" };

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots({ accent }) {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"10px 0" }}>
      {[0,1,2].map(i => (
        <motion.div key={i}
          animate={{ opacity:[0.2,1,0.2], scale:[0.8,1.1,0.8] }}
          transition={{ duration:1.1, repeat:Infinity, delay:i*0.2, ease:"easeInOut" }}
          style={{ width:5, height:5, borderRadius:"50%", background:accent }}
        />
      ))}
      <span className="mr-mono" style={{ fontSize:11, color:"rgba(0,0,0,0.28)", marginLeft:6 }}>
        generating…
      </span>
    </div>
  );
}

// ─── Score bars ───────────────────────────────────────────────────────────────
function ScoreBars({ scores, accent }) {
  return (
    <div style={{ display:"flex", gap:8, padding:"8px 14px 6px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
      {CRITERIA.map((c, i) => (
        <div key={c} style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
            <span className="mr-mono" style={{ fontSize:8, color:"rgba(0,0,0,0.30)", letterSpacing:".08em" }}>{CRIT_LABEL[c]}</span>
            <span className="mr-mono" style={{ fontSize:9, color:accent, fontWeight:500 }}>{scores[c] ?? "—"}</span>
          </div>
          <div style={{ height:2.5, borderRadius:99, background:"rgba(0,0,0,0.06)", overflow:"hidden" }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${scores[c] ?? 0}%` }}
              transition={{ duration:0.9, delay:i*0.08, ease:[0.22,1,0.36,1] }}
              style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${accent}88,${accent})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LIVE badge ───────────────────────────────────────────────────────────────
function LiveBadge({ accent }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:4,
      padding:"2px 8px", borderRadius:99,
      background:"rgba(255,255,255,0.65)",
      border:"1px solid rgba(0,0,0,0.08)",
      boxShadow:"inset 0 1px 0 rgba(255,255,255,1)",
      flexShrink:0,
    }}>
      <div style={{ width:5, height:5, borderRadius:"50%", background:accent, animation:"mr-live-pulse 1s ease infinite" }}/>
      <span className="mr-mono" style={{ fontSize:9, color:accent, fontWeight:600, letterSpacing:".04em" }}>LIVE</span>
    </div>
  );
}

// ─── Model card ───────────────────────────────────────────────────────────────
function ModelCard({ uiKey, rank, tokens, isDone, apiMeta, isWinner, isSelected, onSelect }) {
  const d        = getDisplay(uiKey, apiMeta);
  const hasScore = !!apiMeta?.overall;
  const canClick = isDone && hasScore;
  const streaming = !isDone && tokens.length > 0;
  const isLoading = !isDone && tokens.length === 0;

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:20, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.35, delay:Math.min(rank*0.06, 0.4), ease:[0.22,1,0.36,1] }}
      className={["mr-card", canClick?"clickable":"", isWinner?"winner":"", isSelected?"selected":"", streaming?"streaming":""].filter(Boolean).join(" ")}
      onClick={() => canClick && onSelect(uiKey)}
    >
      {/* Top accent line — neutral for winner, model color for streaming */}
      {(isWinner || isSelected || streaming) && (
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:2.5, zIndex:2,
          background: isWinner || isSelected
            ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), rgba(0,0,0,0.25), rgba(0,0,0,0.15), transparent)"
            : `linear-gradient(90deg,transparent,${d.accent}88,${d.accent},${d.accent}88,transparent)`,
          opacity: streaming ? 0.5 : 0.7,
        }}/>
      )}

      {/* Winner subtle glow */}
      {isWinner && (
        <div style={{
          position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
          background:"radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.03) 0%, transparent 65%)",
        }}/>
      )}

      {/* Header */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", alignItems:"center", gap:8,
        padding:"11px 14px 9px",
        borderBottom:"1px solid rgba(0,0,0,0.06)",
      }}>
        {/* Rank box */}
        <div style={{
          width:26, height:26, borderRadius:8, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          background: isWinner ? "rgba(0,0,0,0.82)" : "rgba(255,255,255,0.72)",
          border: isWinner ? "none" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isWinner
            ? "0 2px 8px rgba(0,0,0,0.18)"
            : "inset 0 1px 0 rgba(255,255,255,1)",
        }}>
          {!isDone
            ? <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}
                style={{width:10,height:10,borderRadius:"50%",border:"2px solid rgba(0,0,0,0.08)",borderTopColor:"rgba(0,0,0,0.45)"}}/>
            : <span style={{ fontSize:isWinner?11:10, fontWeight:700, fontFamily:"monospace", color:isWinner?"#fff":"rgba(0,0,0,0.45)" }}>
                {isWinner ? "★" : hasScore ? rank : "·"}
              </span>
          }
        </div>

        <span style={{ fontSize:11, color:d.accent, flexShrink:0, opacity:0.7 }}>{d.icon}</span>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontSize:13, fontWeight:700,
            color:"rgba(0,0,0,0.80)",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            letterSpacing:"-0.01em", fontFamily:"'Inter',sans-serif",
          }}>
            {d.short}
          </div>
          <div className="mr-mono" style={{ fontSize:9.5, color:"rgba(0,0,0,0.35)", marginTop:1 }}>{d.maker}</div>
        </div>

        {streaming && <LiveBadge accent={d.accent}/>}

        {isDone && hasScore && (
          <div className="mr-score-pop" style={{ display:"flex", alignItems:"flex-end", gap:1, flexShrink:0 }}>
            <span style={{ fontSize:22, fontWeight:700, color:"rgba(0,0,0,0.75)", lineHeight:1, fontFamily:"monospace", letterSpacing:"-0.03em" }}>
              {apiMeta.overall}
            </span>
            <span className="mr-mono" style={{ fontSize:9, color:"rgba(0,0,0,0.25)", marginBottom:2 }}>/100</span>
          </div>
        )}

        {isSelected && (
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:400,damping:20}}
            style={{
              width:20, height:20, borderRadius:"50%",
              background:"rgba(0,0,0,0.82)",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              boxShadow:"0 2px 8px rgba(0,0,0,0.18)",
            }}>
            <Check size={11} color="#fff" strokeWidth={3}/>
          </motion.div>
        )}
      </div>

      {/* Score bars */}
      {isDone && apiMeta?.scores && <ScoreBars scores={apiMeta.scores} accent={d.accent}/>}

      {/* Response body */}
      <div className="mr-scroll" style={{ position:"relative", zIndex:1, flex:1, overflowY:"auto", padding:"10px 14px", minHeight:90 }}>
        {isLoading ? (
          <div className="mr-shimmer" style={{ borderRadius:8, padding:"2px 0" }}>
            <TypingDots accent="rgba(0,0,0,0.35)"/>
          </div>
        ) : tokens.length > 0 ? (
          <p style={{
            fontSize:12.5, lineHeight:1.78, margin:0, whiteSpace:"pre-wrap", fontWeight:400,
            color: isDone ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.52)",
            fontFamily:"'Inter',sans-serif",
          }}>
            {tokens}
            {streaming && <span className="mr-cursor" style={{ background:"rgba(0,0,0,0.45)" }}/>}
          </p>
        ) : (
          <p className="mr-mono" style={{ fontSize:11, color:"rgba(0,0,0,0.22)", textAlign:"center", marginTop:16 }}>standby…</p>
        )}
      </div>

      {/* CTA */}
      {isDone && hasScore && (
        <div style={{ position:"relative", zIndex:1, padding:"8px 14px 12px", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
          {isSelected ? (
            <div style={{
              width:"100%", padding:"8px 0", borderRadius:10, textAlign:"center",
              background:"rgba(0,0,0,0.06)",
              border:"1px solid rgba(0,0,0,0.12)",
              fontSize:11, fontWeight:700, color:"rgba(0,0,0,0.55)",
              letterSpacing:".06em", textTransform:"uppercase",
              fontFamily:"'Inter',sans-serif",
            }}>
              ✓ Selected
            </div>
          ) : (
            <button
              className="mr-use-btn"
              onClick={e => { e.stopPropagation(); onSelect(uiKey); }}
              style={{
                background:"rgba(15,15,22,0.85)",
                color:"#fff",
                boxShadow:"0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              Use this response
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main popup ───────────────────────────────────────────────────────────────
export default function ModelRacePopup({ query, onClose, onUseResponse }) {
  const [modelInfos, setModelInfos] = useState([]);
  const [tokenMap,   setTokenMap]   = useState({});
  const [doneMap,    setDoneMap]    = useState({});
  const [scoreMap,   setScoreMap]   = useState({});
  const [rankMap,    setRankMap]    = useState({});
  const [selected,   setSelected]   = useState(null);
  const [phase,      setPhase]      = useState("running");
  const [showAll,    setShowAll]    = useState(false);
  const [errMsg,     setErrMsg]     = useState("");
  const styleRef = useRef(false);
  const abortRef = useRef(null);

  useEffect(() => {
    // Force re-inject with new ID to flush old amber-tinted CSS
    const OLD_ID = "mr-global-css";
    const NEW_ID = "mr-global-css-v3";
    const old = document.getElementById(OLD_ID);
    if (old) old.remove();
    if (!document.getElementById(NEW_ID)) {
      const el = document.createElement("style");
      el.id = NEW_ID; el.textContent = INJECT_CSS;
      document.head.appendChild(el);
    }
    styleRef.current = true;
  }, []);

  useEffect(() => { if (query) runAll(); return () => abortRef.current?.abort(); }, []);

  const runAll = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setModelInfos([]); setTokenMap({}); setDoneMap({});
    setScoreMap({}); setRankMap({}); setSelected(null);
    setPhase("running"); setErrMsg("");

    try {
      const res = await fetch("/api/model-race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error ?? `HTTP ${res.status}`);
      }
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buf     = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let ev; try { ev = JSON.parse(line.slice(6)); } catch { continue; }
          switch (ev.type) {
            case "start":
              setModelInfos(ev.models ?? []);
              setTokenMap(Object.fromEntries((ev.models ?? []).map(m => [m.uiKey, ""])));
              break;
            case "token":
              setTokenMap(p => ({ ...p, [ev.uiKey]: (p[ev.uiKey] ?? "") + ev.token }));
              break;
            case "done":
              setDoneMap(p  => ({ ...p, [ev.uiKey]: true }));
              setScoreMap(p => ({ ...p, [ev.uiKey]: { scores: ev.scores, overall: ev.overall } }));
              break;
            case "ranked":
              const rm = {};
              (ev.results ?? []).forEach(r => { rm[r.uiKey] = r.rank; });
              setRankMap(rm);
              setPhase("ranked");
              break;
            case "error":
              setDoneMap(p => ({ ...p, [ev.uiKey]: true }));
              break;
          }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("[ModelRacePopup]", err);
      setErrMsg(err.message ?? "Race failed. Check OPENROUTER_API_KEY.");
      setPhase("ranked");
    }
  }, [query]);

  const handleSelect = useCallback((uiKey) => { setSelected(uiKey); setPhase("selected"); }, []);
  const handleSend   = useCallback(() => {
    if (!selected) return;
    const text  = tokenMap[selected] ?? "";
    const model = modelInfos.find(m => m.uiKey === selected);
    onUseResponse(text, { id: selected, ...(model ?? {}) });
    onClose();
  }, [selected, tokenMap, modelInfos, onUseResponse, onClose]);

  function buildApiMeta(uiKey) {
    const sc = scoreMap[uiKey]; if (!sc) return null;
    const m  = modelInfos.find(x => x.uiKey === uiKey);
    return { ...sc, short: m?.short, provider: m?.provider };
  }

  const sorted     = [...modelInfos].sort((a, b) => (scoreMap[b.uiKey]?.overall ?? -1) - (scoreMap[a.uiKey]?.overall ?? -1));
  const top5       = sorted.slice(0, 5);
  const display    = showAll ? sorted : top5;
  const winner     = top5[0];
  const doneCount  = Object.values(doneMap).filter(Boolean).length;
  const totalCount = modelInfos.length;
  const cols       = display.length <= 3 ? display.length : display.length <= 4 ? 2 : 3;
  const winnerD    = winner ? getDisplay(winner.uiKey, scoreMap[winner.uiKey]) : null;

  return (
    <motion.div
      className="mr-root"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.22 }}
      style={{ position:"fixed", inset:0, zIndex:50, display:"flex", flexDirection:"column" }}
    >
      {/* ── Background — same 3-layer frosted glass as main page ── */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:0, background:"#EBEBEB" }}/>
      <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:1, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-15%", width:"60%", height:"65%", borderRadius:"50%", background:"rgba(199,210,254,0.18)", filter:"blur(100px)" }}/>
        <div style={{ position:"absolute", top:"-15%", right:"-15%", width:"55%", height:"60%", borderRadius:"50%", background:"rgba(186,230,253,0.15)", filter:"blur(110px)" }}/>
        <div style={{ position:"absolute", bottom:"-10%", left:"-10%", width:"50%", height:"55%", borderRadius:"50%", background:"rgba(221,214,254,0.14)", filter:"blur(105px)" }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"50%", height:"55%", borderRadius:"50%", background:"rgba(253,213,200,0.12)", filter:"blur(105px)" }}/>
      </div>
      <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:2, background:"rgba(255,255,255,0.62)", backdropFilter:"blur(40px)", WebkitBackdropFilter:"blur(40px)" }}/>

      {/* All UI above bg */}
      <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", height:"100%" }}>

        {/* ── Top bar ── */}
        <motion.div
          initial={{ y:-16, opacity:0 }} animate={{ y:0, opacity:1 }}
          transition={{ delay:0.05, duration:0.3, ease:[0.22,1,0.36,1] }}
          style={{
            display:"flex", alignItems:"center", gap:12,
            padding:"0 20px", height:62, flexShrink:0,
            borderBottom:"1px solid rgba(0,0,0,0.07)",
            background:"rgba(255,255,255,0.60)",
            backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          }}
        >
          {/* Icon + title */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{
              width:36, height:36, borderRadius:11,
              background:"rgba(15,15,22,0.85)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <Zap size={16} color="#fff" fill="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"rgba(0,0,0,0.82)", letterSpacing:"-0.02em" }}>
                Model Race
              </div>
              <div className="mr-mono" style={{ fontSize:9.5, color:"rgba(0,0,0,0.38)", marginTop:1 }}>
                {phase === "running"
                  ? totalCount > 0 ? `${doneCount}/${totalCount} done · scoring live…` : "starting race…"
                  : phase === "ranked" ? `${top5.length} best · neutral judge scored`
                  : "response selected ✓"}
              </div>
            </div>
          </div>

          {/* Query preview */}
          <div style={{
            flex:1, padding:"7px 14px", borderRadius:99,
            background:"rgba(255,255,255,0.72)",
            border:"1px solid rgba(255,255,255,0.92)",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,1)",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          }}>
            <span className="mr-mono" style={{ fontSize:11.5, color:"rgba(0,0,0,0.25)" }}>❝ </span>
            <span style={{ fontSize:12, color:"rgba(0,0,0,0.55)", fontStyle:"italic" }}>
              {query.length > 90 ? query.slice(0, 90) + "…" : query}
            </span>
          </div>

          {/* Live progress */}
          {phase === "running" && totalCount > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
              <Activity size={12} color="rgba(0,0,0,0.45)" style={{ animation:"mr-live-pulse 1s ease infinite" }}/>
              <div style={{ width:90, height:2.5, borderRadius:99, background:"rgba(0,0,0,0.07)", overflow:"hidden" }}>
                <motion.div
                  animate={{ width:`${(doneCount / Math.max(totalCount,1)) * 100}%` }}
                  transition={{ duration:0.4 }}
                  style={{ height:"100%", background:"rgba(0,0,0,0.35)", borderRadius:99 }}
                />
              </div>
              <span className="mr-mono" style={{ fontSize:9.5, color:"rgba(0,0,0,0.35)" }}>{doneCount}/{totalCount}</span>
            </div>
          )}

          {/* Winner badge */}
          <AnimatePresence>
            {(phase === "ranked" || phase === "selected") && winner && scoreMap[winner.uiKey] && winnerD && (
              <motion.div
                initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                style={{
                  display:"flex", alignItems:"center", gap:7,
                  padding:"7px 14px", borderRadius:99, flexShrink:0,
                  background:"rgba(255,255,255,0.72)",
                  border:"1px solid rgba(0,0,0,0.10)",
                  boxShadow:"0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                <Trophy size={11} color="rgba(0,0,0,0.55)"/>
                <span style={{ fontSize:11, fontWeight:700, color:"rgba(0,0,0,0.72)" }}>{winnerD.short}</span>
                <span className="mr-mono" style={{ fontSize:10, color:"rgba(0,0,0,0.35)" }}>{scoreMap[winner.uiKey].overall}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Send to chat */}
          <AnimatePresence>
            {phase === "selected" && selected && (
              <motion.button
                initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                onClick={handleSend}
                style={{
                  display:"flex", alignItems:"center", gap:7,
                  padding:"9px 20px", borderRadius:10, border:"none", cursor:"pointer", flexShrink:0,
                  background:"rgba(15,15,22,0.85)",
                  color:"#fff", fontSize:12, fontWeight:700,
                  boxShadow:"0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                  letterSpacing:"0.01em",
                }}
              >
                <ArrowUp size={13}/> Send to Chat
              </motion.button>
            )}
          </AnimatePresence>

          {/* Re-run */}
          <button onClick={runAll} title="Re-run"
            style={{
              width:36, height:36, borderRadius:10, cursor:"pointer", flexShrink:0,
              background:"rgba(255,255,255,0.65)",
              border:"1px solid rgba(0,0,0,0.08)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"inset 0 1px 0 rgba(255,255,255,1)",
              transition:"background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,0.88)"}
            onMouseOut={e  => e.currentTarget.style.background="rgba(255,255,255,0.65)"}
          >
            <RotateCcw size={13} color="rgba(0,0,0,0.50)"/>
          </button>

          {/* Close */}
          <button onClick={onClose} title="Close"
            style={{
              width:36, height:36, borderRadius:10, cursor:"pointer", flexShrink:0,
              background:"rgba(255,255,255,0.65)",
              border:"1px solid rgba(0,0,0,0.08)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"inset 0 1px 0 rgba(255,255,255,1)",
              transition:"background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background="rgba(239,68,68,0.08)"}
            onMouseOut={e  => e.currentTarget.style.background="rgba(255,255,255,0.65)"}
          >
            <X size={14} color="rgba(0,0,0,0.50)"/>
          </button>
        </motion.div>

        {/* ── Ranking strip ── */}
        <AnimatePresence>
          {(phase !== "running" || Object.keys(scoreMap).length > 0) && (
            <motion.div
              initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              transition={{duration:0.25}}
              style={{ flexShrink:0, borderBottom:"1px solid rgba(0,0,0,0.06)", background:"rgba(255,255,255,0.45)", overflow:"hidden" }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 20px", overflowX:"auto" }}>
                <span className="mr-mono" style={{ fontSize:9, color:"rgba(0,0,0,0.28)", letterSpacing:".14em", textTransform:"uppercase", flexShrink:0 }}>
                  {phase === "running" ? "LIVE ·" : "TOP 5 ·"}
                </span>
                {top5.map((m, i) => {
                  const d = getDisplay(m.uiKey, scoreMap[m.uiKey]);
                  const sc = scoreMap[m.uiKey];
                  const isActive = selected === m.uiKey;
                  return (
                    <motion.button key={m.uiKey}
                      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                      className="mr-pill"
                      onClick={() => sc && handleSelect(m.uiKey)}
                      style={{
                        background: isActive ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.65)",
                        border:`1px solid ${isActive ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.88)"}`,
                        color: isActive ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.55)",
                        cursor: sc ? "pointer" : "default",
                        opacity: doneMap[m.uiKey] ? 1 : 0.55,
                        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      <span style={{ color:d.accent, fontSize:9 }}>{d.icon}</span>
                      <span style={{ fontSize:10 }}>#{i+1}</span>
                      <span style={{ fontWeight:600 }}>{d.short}</span>
                      {sc && <span className="mr-mono" style={{ fontSize:10, opacity:0.7 }}>{sc.overall}</span>}
                      {!doneMap[m.uiKey] && (
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}
                          style={{width:8,height:8,borderRadius:"50%",border:"1.5px solid rgba(0,0,0,0.10)",borderTopColor:"rgba(0,0,0,0.45)"}}/>
                      )}
                      {isActive && <Check size={9} strokeWidth={3}/>}
                    </motion.button>
                  );
                })}
                <div style={{ flex:1 }}/>
                {sorted.length > 5 && (
                  <button className="mr-pill" onClick={() => setShowAll(p => !p)}
                    style={{
                      background:"rgba(255,255,255,0.65)",
                      border:"1px solid rgba(255,255,255,0.88)",
                      color:"rgba(0,0,0,0.45)", flexShrink:0,
                      boxShadow:"inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    <ChevronDown size={10} style={{ transform:showAll?"rotate(180deg)":"none", transition:"transform .2s" }}/>
                    {showAll ? "Show Top 5" : `All ${sorted.length}`}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {errMsg && (
          <div style={{ padding:"10px 20px", background:"rgba(239,68,68,0.08)", borderBottom:"1px solid rgba(239,68,68,0.18)", fontSize:12, color:"rgba(185,28,28,0.9)", fontFamily:"monospace" }}>
            ⚠ {errMsg}
          </div>
        )}

        {/* ── Card grid ── */}
        <div style={{ flex:1, overflow:"hidden", padding:"14px 20px 16px" }}>
          {modelInfos.length === 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"1fr 1fr", gap:10, height:"100%" }}>
              {Array.from({ length:6 }).map((_, i) => (
                <motion.div key={i}
                  initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className="mr-card mr-shimmer"
                >
                  <div style={{ padding:"11px 14px 9px", borderBottom:"1px solid rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:"rgba(0,0,0,0.05)" }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ height:10, width:"55%", borderRadius:4, background:"rgba(0,0,0,0.06)", marginBottom:5 }}/>
                      <div style={{ height:8,  width:"35%", borderRadius:4, background:"rgba(0,0,0,0.04)" }}/>
                    </div>
                  </div>
                  <div style={{ padding:"12px 14px", flex:1 }}>
                    {[80,60,90,50].map((w,j) => (
                      <div key={j} style={{ height:8, width:`${w}%`, borderRadius:4, background:"rgba(0,0,0,0.05)", marginBottom:8 }}/>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {modelInfos.length > 0 && (
            <div style={{
              display:"grid",
              gridTemplateColumns:`repeat(${cols},1fr)`,
              gridAutoRows: display.length > cols
                ? `calc(${Math.ceil(display.length/cols) === 1 ? "100" : "50"}% - ${Math.ceil(display.length/cols) === 1 ? "0" : "6"}px)`
                : "1fr",
              gap:10, height:"100%",
            }}>
              {display.map((m, idx) => (
                <ModelCard
                  key={m.uiKey}
                  uiKey={m.uiKey}
                  rank={rankMap[m.uiKey] ?? idx + 1}
                  tokens={tokenMap[m.uiKey] ?? ""}
                  isDone={!!doneMap[m.uiKey]}
                  apiMeta={buildApiMeta(m.uiKey)}
                  isWinner={(phase === "ranked" || phase === "selected") && idx === 0 && !!scoreMap[m.uiKey]}
                  isSelected={selected === m.uiKey}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}