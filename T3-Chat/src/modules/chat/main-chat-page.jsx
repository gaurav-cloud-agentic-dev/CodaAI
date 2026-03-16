"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  AlertCircle, Code, GraduationCap, PenTool,
  Coffee, Crown, ChevronDown, Paperclip, ImageIcon,
  FileText, Video,
} from "lucide-react";
import ModelSelector from "./model-selector";
import { useInitializeChat } from "./hooks/chat";
import { useChatStore } from "./store/chat-store";
import { toast } from "sonner";
import { useLanguage } from "./LanguageSettings";

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
.mcp-root .mcp-card:active { transform: translateY(-1px); }
.mcp-root .mcp-icon { transition: transform 0.22s cubic-bezier(.34,1.56,.64,1); }
.mcp-root .mcp-card:hover .mcp-icon { transform: scale(1.13) translateY(-2px); }

.mcp-root .mcp-glass { transition: box-shadow 0.2s ease, background 0.2s ease; }
.mcp-root .mcp-glass:focus-within {
  background: rgba(255,255,255,0.82) !important;
  box-shadow: 0 0 0 2px rgba(59,158,255,0.22), 0 0 0 6px rgba(59,158,255,0.06),
    0 20px 56px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1) !important;
}
.mcp-root .mcp-glass textarea::placeholder { color: rgba(0,0,0,0.32); font-weight: 400; }

.mcp-root .mcp-tbtn {
  border-radius: 9px; border: none; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.14s, transform 0.14s;
}
.mcp-root .mcp-tbtn:hover { background: rgba(0,0,0,0.04) !important; transform: scale(1.1); }
.mcp-root .mcp-tbtn:active { transform: scale(0.9); }

.mcp-root .mcp-mbtn { cursor: pointer; border: none; transition: background 0.14s; }
.mcp-root .mcp-mbtn:hover { }

.mcp-root .mcp-send { border: none; transition: transform 0.16s cubic-bezier(.34,1.56,.64,1), box-shadow 0.16s, width 0.2s cubic-bezier(.16,1,.3,1), border-radius 0.2s; }
.mcp-root .mcp-send:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 14px 36px rgba(59,158,255,0.5) !important; }
.mcp-root .mcp-send:active:not(:disabled) { transform: scale(0.93); }

.mcp-root .mcp-upgrade { border: none; cursor: pointer; transition: transform 0.14s, box-shadow 0.14s; }
.mcp-root .mcp-upgrade:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(0,0,0,0.28) !important; }

@keyframes mcp-dot-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
.mcp-root .mcp-dot { animation: mcp-dot-blink 3s ease-in-out infinite; }

@keyframes mcp-loader { to { transform: rotate(360deg); } }
.mcp-root .mcp-spin { animation: mcp-loader 1s linear infinite; }

/* Hide scrollbar completely */
.mcp-root ::-webkit-scrollbar { display: none; }
.mcp-root { scrollbar-width: none; -ms-overflow-style: none; }

.mcp-root .mcp-div {
  display: flex; align-items: center; gap: 14px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(0,0,0,0.18);
}
.mcp-root .mcp-div::before, .mcp-root .mcp-div::after {
  content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.06);
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

const CARDS = [
  { icon: Code,          label: "Write code",      prompt: "Help me build a React component" },
  { icon: GraduationCap, label: "Learn something",  prompt: "Explain quantum computing"       },
  { icon: PenTool,       label: "Create content",   prompt: "Draft a blog post about AI"      },
  { icon: Coffee,        label: "Get advice",       prompt: "Suggest healthy meal plans"      },
];

const Card = ({ item, index, onClick }) => {
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
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.90)",
        borderRadius: 18,
        padding: "16px 18px 16px",   // reduced from 24px 22px 22px
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
        display: "flex", flexDirection: "column", gap: 10,  // reduced gap from 16
      }}
    >
      <div className="mcp-icon" style={{
       width: 38, height: 38, borderRadius: 12,
       background: "transparent",
       display: "flex", alignItems: "center", justifyContent: "center",
      }}>
       <Icon style={{ width: 20, height: 20, color: "rgba(0,0,0,0.72)" }} strokeWidth={1.8} />
      </div>
      <div>
        <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.7)", lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}>
          {item.label}
        </p>
        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 400, color: "rgba(0,0,0,0.34)", lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
          {item.prompt}
        </p>
      </div>
    </motion.button>
  );
};

const MainChatPage = () => {
  useCSS(CSS);
  const { t } = useLanguage();

  const [open, setOpen]   = useState(false);
  const [msg, setMsg]     = useState("");
  const [model, setModel] = useState({ id: null, name: null });

  const taRef   = useRef(null);
  const mBtnRef = useRef(null);

  const activeChatId           = useChatStore(s => s.activeChatId);
  const setPendingMessage       = useChatStore(s => s.setPendingMessage);
  const initializeChatMutation  = useInitializeChat();
  const isLoading               = initializeChatMutation.isPending;

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 130) + "px";
  }, [msg]);

  if (activeChatId) return null;

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
    setMsg("");
    setPendingMessage(content, model.id, model.name);
    await initializeChatMutation.mutateAsync({ content, modelId: model.id, modelName: model.name });
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = !!msg.trim() && !isLoading;

  return (
    <div
      className="mcp-root"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Inter', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >

      {/* Layer A — Pure neutral grey base */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "#EBEBEB",
      }} />

      {/* Layer B — Very faint colour blobs */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1,
        overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-15%",
          width: "60%", height: "65%", borderRadius: "50%",
          background: "rgba(199,210,254,0.18)",
          filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", top: "-15%", right: "-15%",
          width: "55%", height: "60%", borderRadius: "50%",
          background: "rgba(186,230,253,0.15)",
          filter: "blur(110px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-10%",
          width: "50%", height: "55%", borderRadius: "50%",
          background: "rgba(221,214,254,0.14)",
          filter: "blur(105px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-10%",
          width: "50%", height: "55%", borderRadius: "50%",
          background: "rgba(253,213,200,0.12)",
          filter: "blur(105px)",
        }} />
      </div>

      {/* Layer C — Frosted glass film */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "rgba(255,255,255,0.62)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }} />

      {/* HEADER */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 32px 0",
      }}>
        <div style={{ width: 120 }} />

        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: 99,
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <span className="mcp-dot" style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#22C55E", display: "inline-block", flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.44)" }}>
            {t.freePlan || "Free plan"}
          </span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mcp-upgrade"
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 12,
            background: "rgba(15,15,22,0.85)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.045em",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <Crown style={{ width: 13, height: 13 }} strokeWidth={1.8} />
          {t.upgrade || "UPGRADE"}
        </motion.button>
      </header>

      {/* BODY */}
      <main
        style={{
          flex: 1, overflow: "hidden",   // hidden — no scrollbar at all
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "16px 32px 0",        // no bottom padding — footer handles spacing
        }}
      >
        <div style={{ width: "100%", maxWidth: 680 }}>

          {/* Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.65rem, 3vw, 2.3rem)",   // slightly smaller
              fontWeight: 700, color: "rgba(0,0,0,0.76)",
              textAlign: "center", lineHeight: 1.2,
              letterSpacing: "-0.026em", margin: "0 0 8px",
            }}
          >
            {t.greeting || "Good afternoon"},{" "}
            <span style={{
              background: "linear-gradient(130deg, #6366F1 0%, #38BDF8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Gaurav
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            style={{
              textAlign: "center", fontSize: 13.5, fontWeight: 400,
              color: "rgba(0,0,0,0.32)", lineHeight: 1.65,
              margin: "0 0 20px", fontFamily: "'Inter', sans-serif",
            }}
          >
            {t.subtitle || "How can I help you today?"}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mcp-div" style={{ marginBottom: 10 }}
          >
            Quick Start
          </motion.div>

          {/* Cards — smaller padding, tighter gap */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CARDS.map((item, i) => (
              <Card key={item.label} item={item} index={i} onClick={p => setMsg(p)} />
            ))}
          </div>

        </div>
      </main>

      {/* FOOTER — paddingTop adds the gap between cards and input */}
      <footer style={{
        flexShrink: 0, position: "relative", zIndex: 20,
        padding: "20px 32px 20px",   // 20px top = gap between cards and input
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 680, margin: "0 auto" }}
        >
          {/* Input box */}
          <div
            className="mcp-glass"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.92)",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            <textarea
              ref={taRef}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t.placeholder || "Type your message…"}
              disabled={isLoading}
              rows={1}
              style={{
                display: "block", width: "100%",
                padding: "18px 22px 10px",
                background: "transparent", border: "none", outline: "none",
                resize: "none", fontSize: 14, fontWeight: 400,
                lineHeight: 1.6, color: "rgba(0,0,0,0.82)",
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
                {[
                  { Icon: Paperclip, title: "Attach"   },
                  { Icon: ImageIcon, title: "Image"    },
                  { Icon: FileText,  title: "Document" },
                  { Icon: Video,     title: "Video"    },
                ].map(({ Icon, title }) => (
                  <button key={title} title={title} disabled={isLoading}
                    className="mcp-tbtn"
                    style={{ padding: "9px 10px", opacity: isLoading ? 0.28 : 1 }}
                  >
                    <Icon style={{ width: 18, height: 18, color: "rgba(0,0,0,0.55)" }} strokeWidth={1.65} />
                  </button>
                ))}

                <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.12)", margin: "0 8px", flexShrink: 0 }} />

                <button
                  ref={mBtnRef} onClick={() => setOpen(true)} disabled={isLoading}
                  className="mcp-mbtn"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 13px", borderRadius: 10,
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.88)",
                    color: model.id ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.55)",
                    fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                    opacity: isLoading ? 0.35 : 1,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                    transition: "background 0.14s, box-shadow 0.14s, border-color 0.14s",
                  }}
                  onMouseEnter={e => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.90)";
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)";
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.65)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.88)";
                  }}
                >
                  {model.id && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", flexShrink: 0 }} />
                  )}
                  <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {model.id ? model.name : (t.selectModel || "Select Model")}
                  </span>
                  <ChevronDown style={{ width: 11, height: 11, color: "rgba(0,0,0,0.45)", flexShrink: 0 }} strokeWidth={2.2} />
                </button>
              </div>

              {/* Send button — blue pill */}
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
                    : "rgba(0,0,0,0.07)",
                  opacity: canSend ? 1 : 0.35,
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
            fontSize: 11, color: "rgba(0,0,0,0.82)",
            letterSpacing: "0.03em", fontFamily: "'Inter', sans-serif",
          }}>
            {t.disclaimer || "CodaAI can make mistakes. Consider checking important info."}
          </p>
        </motion.div>
      </footer>

      <ModelSelector
        isOpen={open} onClose={() => setOpen(false)}
        selectedModel={model} onSelectModel={handleModelSelect}
        triggerRef={mBtnRef}
      />
    </div>
  );
};

export default MainChatPage;