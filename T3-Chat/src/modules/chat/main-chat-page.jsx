"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  AlertCircle, Code, GraduationCap, PenTool,
  Coffee, ChevronDown, Sun, Moon,
} from "lucide-react";
import ModelSelector from "./model-selector";
import { useInitializeChat } from "./hooks/chat";
import { useChatStore } from "./store/chat-store";
import { toast } from "sonner";
import { useLanguage } from "./LanguageSettings";
import { useInputIntelligence, CorrectionsBar, TabHint } from "./input-intelligence";
import FileUploadManager, { FilePreviewStrip, useFileUpload } from "./file-upload-manager";
import { useTheme, DarkModeStyles, getDarkTokens } from "./theme-context";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.mcp-root .mcp-card {
  transition: transform 0.22s cubic-bezier(.16,1,.3,1), box-shadow 0.22s ease, background 0.22s ease;
  cursor: pointer; text-align: left; border: none; outline: none;
}
.mcp-root .mcp-card:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,0.88) !important;
  border-color: rgba(255,255,255,0.98) !important;
  box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1) !important;
}
.mcp-root.dark .mcp-card:hover {
  transform: translateY(-2px);
  background: #2E2E2E !important;
  border-color: rgba(255,255,255,0.08) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.50) !important;
}
.mcp-root .mcp-card:active { transform: translateY(-1px); }
.mcp-root .mcp-icon { transition: transform 0.22s cubic-bezier(.34,1.56,.64,1); }
.mcp-root .mcp-card:hover .mcp-icon { transform: scale(1.13) translateY(-2px); }

.mcp-root .mcp-glass { transition: box-shadow 0.2s ease, background 0.2s ease; }
.mcp-root .mcp-glass:focus-within {
  box-shadow: 0 0 0 2px rgba(59,158,255,0.22), 0 0 0 6px rgba(59,158,255,0.06),
    0 20px 56px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1) !important;
}
.mcp-root.dark .mcp-glass:focus-within {
  box-shadow: 0 0 0 2px rgba(255,255,255,0.18), 0 0 0 6px rgba(255,255,255,0.04),
    0 20px 56px rgba(0,0,0,0.50) !important;
  border-color: rgba(255,255,255,0.30) !important;
}
.mcp-root .mcp-glass textarea::placeholder { color: rgba(0,0,0,0.32); font-weight: 400; }
.mcp-root.dark .mcp-glass textarea::placeholder { color: rgba(255,255,255,0.22); font-weight: 400; }

.mcp-root .mcp-tbtn {
  border-radius: 9px; border: none; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.14s, transform 0.14s;
}
.mcp-root .mcp-tbtn:hover { background: rgba(0,0,0,0.04) !important; transform: scale(1.1); }
.mcp-root.dark .mcp-tbtn:hover { background: rgba(255,255,255,0.06) !important; }
.mcp-root .mcp-tbtn:active { transform: scale(0.9); }

.mcp-root .mcp-mbtn { cursor: pointer; border: none; transition: background 0.14s; }

.mcp-root .mcp-send { border: none; transition: transform 0.16s cubic-bezier(.34,1.56,.64,1), box-shadow 0.16s, width 0.2s cubic-bezier(.16,1,.3,1), border-radius 0.2s; }
.mcp-root .mcp-send:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 14px 36px rgba(59,158,255,0.5) !important; }
.mcp-root .mcp-send:active:not(:disabled) { transform: scale(0.93); }

@keyframes mcp-dot-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
.mcp-root .mcp-dot { animation: mcp-dot-blink 3s ease-in-out infinite; }

@keyframes mcp-loader { to { transform: rotate(360deg); } }
.mcp-root .mcp-spin { animation: mcp-loader 1s linear infinite; }

.mcp-root ::-webkit-scrollbar { display: none; }
.mcp-root { scrollbar-width: none; -ms-overflow-style: none; }

.mcp-root .mcp-div {
  display: flex; align-items: center; gap: 14px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(0,0,0,0.18);
}
.mcp-root.dark .mcp-div { color: rgba(255,255,255,0.20); }
.mcp-root .mcp-div::before, .mcp-root .mcp-div::after {
  content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.06);
}
.mcp-root.dark .mcp-div::before, .mcp-root.dark .mcp-div::after {
  background: rgba(255,255,255,0.06);
}
`;

function useCSS(css) {
  useEffect(() => {
    const id = "mcp-v15";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);
}

// ── Custom ThemeToggle ────────────────────────────────────────────────────────
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [hov, setHov] = useState(false);

  const bg = isDark
    ? (hov ? "#FFFFFF" : "rgba(255,255,255,0.95)")
    : (hov ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.78)");

  const iconColor  = isDark ? "#1A1A1A" : "rgba(0,0,0,0.62)";
  const labelColor = isDark ? "#1A1A1A" : "rgba(0,0,0,0.60)";
  const border     = isDark
    ? "1px solid rgba(255,255,255,0.20)"
    : "1px solid rgba(255,255,255,0.95)";
  const shadow     = isDark
    ? "0 4px 16px rgba(255,255,255,0.12), 0 1px 4px rgba(0,0,0,0.20)"
    : "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)";

  return (
    <motion.button
      onClick={toggleTheme}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileTap={{ scale: 0.92 }}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 16px", borderRadius: 99,
        background: bg, border, boxShadow: shadow,
        cursor: "pointer", fontFamily: "'Inter', sans-serif",
        transition: "background 0.22s ease, box-shadow 0.22s ease",
        overflow: "hidden", position: "relative",
      }}
    >
      {/* Animated icon swap */}
      <div style={{ width: 16, height: 16, position: "relative", flexShrink: 0 }}>
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Sun size={15} color={iconColor} strokeWidth={2.2} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Moon size={15} color={iconColor} strokeWidth={2.2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated label swap */}
      <div style={{ position: "relative", height: 16, overflow: "hidden", minWidth: 32 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "light" : "dark"}
            initial={{ opacity: 0, y: isDark ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isDark ? -10 : 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", top: 0, left: 0,
              fontSize: 12, fontWeight: 600,
              color: labelColor, whiteSpace: "nowrap",
              lineHeight: "16px",
            }}
          >
            {isDark ? "Light" : "Dark"}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

const CARDS = [
  { icon: Code,          label: "Write code",     prompt: "Help me build a React component" },
  { icon: GraduationCap, label: "Learn something", prompt: "Explain quantum computing"       },
  { icon: PenTool,       label: "Create content",  prompt: "Draft a blog post about AI"      },
  { icon: Coffee,        label: "Get advice",      prompt: "Suggest healthy meal plans"      },
];

const Card = ({ item, index, onClick, isDark }) => {
  const Icon = item.icon;
  return (
    <motion.button
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.14 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(item.prompt)}
      className="mcp-card"
      style={{
        width: "100%",
        background: isDark ? "#252525" : "rgba(255,255,255,0.72)",
        backdropFilter: isDark ? "none" : "blur(20px)",
        WebkitBackdropFilter: isDark ? "none" : "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.90)",
        borderRadius: 18,
        padding: "16px 18px",
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.40)"
          : "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      <div className="mcp-icon" style={{
        width: 38, height: 38, borderRadius: 12,
        background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon style={{ width: 20, height: 20, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.72)" }} strokeWidth={1.8} />
      </div>
      <div>
        <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: isDark ? "#FFFFFF" : "rgba(0,0,0,0.7)", lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}>
          {item.label}
        </p>
        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 400, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.34)", lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
          {item.prompt}
        </p>
      </div>
    </motion.button>
  );
};

const MainChatPage = () => {
  useCSS(CSS);
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const dk = getDarkTokens(isDark);

  const [open, setOpen]   = useState(false);
  const [msg, setMsg]     = useState("");
  const [model, setModel] = useState({ id: null, name: null });
  const { files, setFiles, clearFiles, getFilePayload } = useFileUpload();
  const {
    inlineSuggestion, corrections,
    isLoadingSuggestion, isLoadingCorrections,
    handleKeyDown: handleIntelliKeyDown,
    acceptCorrection, dismissCorrection,
  } = useInputIntelligence(msg, (val) => setMsg(val));

  const taRef   = useRef(null);
  const mBtnRef = useRef(null);

  const activeChatId           = useChatStore(s => s.activeChatId);
  const setPendingMessage      = useChatStore(s => s.setPendingMessage);
  const setSidebarOpen         = useChatStore(s => s.setSidebarOpen);
  const initializeChatMutation = useInitializeChat();
  const isLoading              = initializeChatMutation.isPending;

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 130) + "px";
  }, [msg]);

  useEffect(() => {
    if (!activeChatId) {
      setModel({ id: null, name: null });
      setMsg("");
      clearFiles();
    }
  }, [activeChatId]);

  const isHidden = !!activeChatId;
  const handleModelSelect = m => { setModel(m); setOpen(false); };

  const handleSend = async () => {
    if (!msg.trim()) return;
    if (!model?.id) {
      toast.error(t.selectModel, { icon: <AlertCircle size={15} strokeWidth={1.7} /> });
      return;
    }
    if (msg.split("\n").length > 600) {
      toast.error("Message exceeds 600 line limit", { duration: 3000 });
      return;
    }
    const content = msg.trim();
    const filePayload = getFilePayload();
    setMsg("");
    clearFiles();
    setPendingMessage(content, model.id, model.name);
    setSidebarOpen(false);
    await initializeChatMutation.mutateAsync({ content, modelId: model.id, modelName: model.name, files: filePayload });
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = !!msg.trim() && !isLoading;

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        opacity: isHidden ? 0 : 1,
        pointerEvents: isHidden ? "none" : "auto",
        transition: "opacity 0.12s ease",
        zIndex: isHidden ? 0 : 1,
      }}
    >
      <DarkModeStyles isDark={isDark} />
      <div
        className={`mcp-root${isDark ? " dark" : ""}`}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          height: "100%", overflow: "hidden", position: "relative",
          fontFamily: "'Inter', -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Layer A — base bg */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: isDark ? "#1A1A1A" : "#EBEBEB",
        }} />

        {/* Layer B — blobs (light only) */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 1,
          overflow: "hidden", pointerEvents: "none",
        }}>
          {!isDark && <>
            <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "60%", height: "65%", borderRadius: "50%", background: "rgba(199,210,254,0.18)", filter: "blur(100px)" }} />
            <div style={{ position: "absolute", top: "-15%", right: "-15%", width: "55%", height: "60%", borderRadius: "50%", background: "rgba(186,230,253,0.15)", filter: "blur(110px)" }} />
            <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(221,214,254,0.14)", filter: "blur(105px)" }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "55%", borderRadius: "50%", background: "rgba(253,213,200,0.12)", filter: "blur(105px)" }} />
          </>}
        </div>

        {/* Layer C — frost (light only) */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: isDark ? "transparent" : "rgba(255,255,255,0.62)",
          backdropFilter: isDark ? "none" : "blur(40px)",
          WebkitBackdropFilter: isDark ? "none" : "blur(40px)",
        }} />

        {/* HEADER */}
        <header style={{
          flexShrink: 0, position: "relative", zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px 0",
        }}>
          <div style={{ width: 120 }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: 99,
            background: isDark ? dk.freePlanBg : "rgba(255,255,255,0.78)",
            border: isDark ? `1px solid ${dk.freePlanBorder}` : "1px solid rgba(255,255,255,0.95)",
            boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
          }}>
            <span className="mcp-dot" style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22C55E", display: "inline-block", flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: isDark ? dk.freePlanText : "rgba(0,0,0,0.44)", fontFamily: "'Inter', sans-serif" }}>
              {t.freePlan || "Free plan"}
            </span>
          </div>

          {/* Custom ThemeToggle — white in dark, glass in light */}
          <ThemeToggle />
        </header>

        {/* BODY */}
        <main style={{
          flex: 1, overflow: "hidden", position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "16px 32px 0",
        }}>
          <div style={{ width: "100%", maxWidth: 680 }}>

            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.65rem, 3vw, 2.3rem)",
              fontWeight: 700,
              color: isDark ? "#FFFFFF" : "rgba(0,0,0,0.76)",
              textAlign: "center", lineHeight: 1.2,
              letterSpacing: "-0.026em", margin: "0 0 8px",
            }}>
              {t.greeting || "Good afternoon"},{" "}
              <span style={{
                background: "linear-gradient(130deg, #6366F1 0%, #38BDF8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Gaurav
              </span>
            </h1>

            <p style={{
              textAlign: "center", fontSize: 13.5, fontWeight: 400,
              color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.32)", lineHeight: 1.65,
              margin: "0 0 20px", fontFamily: "'Inter', sans-serif",
            }}>
              {t.subtitle || "How can I help you today?"}
            </p>

            <div className="mcp-div" style={{ marginBottom: 10 }}>Quick Start</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CARDS.map((item, i) => (
                <Card key={item.label} item={item} index={i} onClick={p => setMsg(p)} isDark={isDark} />
              ))}
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ flexShrink: 0, position: "relative", zIndex: 20, padding: "20px 32px 20px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>

            <div
              className="mcp-glass"
              style={{
                position: "relative",
                background: isDark ? dk.inputBg : "rgba(255,255,255,0.75)",
                backdropFilter: isDark ? "none" : "blur(32px)",
                WebkitBackdropFilter: isDark ? "none" : "blur(32px)",
                border: isDark ? `1px solid ${dk.inputBorder}` : "1px solid rgba(255,255,255,0.92)",
                borderRadius: 24,
                boxShadow: isDark ? dk.inputShadow : "0 8px 32px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              <FilePreviewStrip files={files} onFilesChange={setFiles} disabled={isLoading} />

              <CorrectionsBar
                corrections={corrections}
                onAccept={acceptCorrection}
                onDismiss={dismissCorrection}
                isLoading={isLoadingCorrections}
              />

              {inlineSuggestion && (
                <div aria-hidden="true" style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  pointerEvents: "none", padding: "18px 22px 10px",
                  fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  color: "transparent", zIndex: 1, boxSizing: "border-box",
                }}>
                  <span style={{ visibility: "hidden" }}>{msg}</span>
                  <span style={{ color: isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.28)" }}>{inlineSuggestion}</span>
                </div>
              )}

              <textarea
                ref={taRef}
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => { handleIntelliKeyDown(e); handleKey(e); }}
                placeholder={t.placeholder || "Type your message…"}
                disabled={isLoading}
                rows={1}
                style={{
                  position: "relative", zIndex: 2,
                  display: "block", width: "100%",
                  padding: "18px 22px 10px",
                  background: "transparent", border: "none", outline: "none",
                  resize: "none", fontSize: 14, fontWeight: 400,
                  lineHeight: 1.6,
                  color: isDark ? "#FFFFFF" : "rgba(0,0,0,0.82)",
                  fontFamily: "'Inter', sans-serif",
                  caretColor: "#3B9EFF",
                  maxHeight: 130, overflowY: "auto", boxSizing: "border-box",
                  scrollbarWidth: "none", msOverflowStyle: "none",
                }}
              />

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "2px 12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FileUploadManager files={files} onFilesChange={setFiles} disabled={isLoading} />

                  <div style={{
                    width: 1, height: 18,
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
                    margin: "0 8px", flexShrink: 0,
                  }} />

                  <TabHint visible={!!inlineSuggestion} isLoading={isLoadingSuggestion} />

                  <button
                    ref={mBtnRef} onClick={() => setOpen(true)} disabled={isLoading}
                    className="mcp-mbtn"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 13px", borderRadius: 10,
                      background: isDark ? dk.modelBtnBg : "rgba(255,255,255,0.65)",
                      border: isDark ? `1px solid ${dk.modelBtnBorder}` : "1px solid rgba(255,255,255,0.88)",
                      color: model.id
                        ? (isDark ? "#FFFFFF" : "rgba(0,0,0,0.72)")
                        : (isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.55)"),
                      fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                      opacity: isLoading ? 0.35 : 1,
                      boxShadow: isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,1)",
                      transition: "background 0.14s, border-color 0.14s",
                    }}
                    onMouseEnter={e => {
                      if (!isLoading) {
                        e.currentTarget.style.background = isDark ? dk.modelBtnHoverBg : "rgba(255,255,255,0.90)";
                        e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDark ? dk.modelBtnBg : "rgba(255,255,255,0.65)";
                      e.currentTarget.style.borderColor = isDark ? dk.modelBtnBorder : "rgba(255,255,255,0.88)";
                    }}
                  >
                    {model.id && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", flexShrink: 0 }} />
                    )}
                    <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {model.id ? model.name : (t.selectModel || "Select Model")}
                    </span>
                    <ChevronDown style={{ width: 11, height: 11, color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.45)", flexShrink: 0 }} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend} disabled={!canSend}
                  className="mcp-send"
                  style={{
                    height: 46,
                    width: canSend ? "auto" : 46,
                    minWidth: 46,
                    padding: canSend ? "0 22px" : 0,
                    borderRadius: 99,
                    cursor: canSend ? "pointer" : "not-allowed",
                    background: canSend
                      ? "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)"
                      : isDark ? "#2E2E2E" : "rgba(0,0,0,0.07)",
                    opacity: canSend ? 1 : 0.40,
                    boxShadow: canSend
                      ? "0 6px 22px rgba(59,158,255,0.45), 0 2px 6px rgba(59,158,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                      : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 7, flexShrink: 0,
                  }}
                >
                  {isLoading ? (
                    <div className="mcp-spin" style={{
                      width: 17, height: 17,
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                    }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <p style={{
              textAlign: "center", marginTop: 9,
              fontSize: 11, color: isDark ? dk.disclaimerText : "rgba(0,0,0,0.45)",
              letterSpacing: "0.03em", fontFamily: "'Inter', sans-serif",
            }}>
              {t.disclaimer || "CodaAI can make mistakes. Consider checking important info."}
            </p>
          </div>
        </footer>

        <ModelSelector
          isOpen={open} onClose={() => setOpen(false)}
          selectedModel={model} onSelectModel={handleModelSelect}
          triggerRef={mBtnRef}
        />
      </div>
    </div>
  );
};

export default MainChatPage;