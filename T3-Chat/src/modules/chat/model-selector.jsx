"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Star, Eye, Info, X, Check, Wrench, Zap, Sparkles, FileText, Crown, SlidersHorizontal, Heart, ChevronDown } from "lucide-react";
import { useTheme, getDarkTokens } from "./theme-context";

// ── Light tokens ──────────────────────────────────────────────────────────────
const T = {
  text:      "rgba(0,0,0,0.82)",
  textMid:   "rgba(0,0,0,0.68)",
  textSub:   "rgba(0,0,0,0.52)",
  textDim:   "rgba(0,0,0,0.40)",
  textFaint: "rgba(0,0,0,0.28)",
  border:    "rgba(0,0,0,0.07)",
  borderMd:  "rgba(0,0,0,0.12)",
  borderHov: "rgba(0,0,0,0.18)",
};

// ── Dark token helper ─────────────────────────────────────────────────────────
const D = {
  text:      "#FFFFFF",
  textMid:   "rgba(255,255,255,0.72)",
  textSub:   "rgba(255,255,255,0.52)",
  textDim:   "rgba(255,255,255,0.35)",
  textFaint: "rgba(255,255,255,0.22)",
  border:    "rgba(255,255,255,0.07)",
  borderMd:  "rgba(255,255,255,0.12)",
  borderHov: "rgba(255,255,255,0.18)",
};

const getT = isDark => isDark ? D : T;

const glassPanel = (isDark) => isDark
  ? {
      background: "#1C1C1C",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.85)",
    }
  : {
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(48px)",
      WebkitBackdropFilter: "blur(48px)",
      border: "1px solid rgba(255,255,255,0.95)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
    };

const STYLES = (isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .ms * { box-sizing: border-box; }
  .ms { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

  .ms-scroll::-webkit-scrollbar { width: 3px; }
  .ms-scroll::-webkit-scrollbar-track { background: transparent; }
  .ms-scroll::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}; border-radius: 99px; }
  .ms-scroll { scrollbar-width: thin; scrollbar-color: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"} transparent; }

  .ms-row { position: relative; }
  .ms-row::before {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 2px; border-radius: 99px;
    background: linear-gradient(180deg, ${isDark ? "rgba(255,255,255,0.50), rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25), rgba(0,0,0,0.15)"});
    opacity: 0; transition: opacity 0.18s ease;
  }
  .ms-row:hover::before  { opacity: 0.45; }
  .ms-row.ms-sel::before { opacity: 1; }

  @keyframes ms-pulse { 0%,100%{opacity:.5} 50%{opacity:.25} }
  .ms-skel {
    background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
    animation: ms-pulse 1.5s ease infinite;
    border-radius: 8px;
  }

  .ms-search { font-family: 'Inter', -apple-system, sans-serif; outline: none; }

  .ms-tag {
    display: inline-flex; align-items: center; gap: 2px;
    padding: 1px 5px; border-radius: 3px;
    font-size: 8.5px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    font-family: 'Inter', -apple-system, sans-serif;
    flex-shrink: 0; line-height: 1.4;
  }
  .ms-tag-free  { background: rgba(16,185,129,0.10); color: #059669; border: 1px solid rgba(16,185,129,0.20); }
  .ms-tag-mid   { background: ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}; color: ${isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.52)"}; border: 1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}; }
  .ms-tag-ctx   { background: ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}; color: ${isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.55)"}; border: 1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}; }
  .ms-tag-sel   { background: ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)"}; color: ${isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.60)"}; border: 1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)"}; }
  .ms-tag-liked { background: rgba(236,72,153,0.10); color: #be185d; border: 1px solid rgba(236,72,153,0.22); }

  .ms-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 99px;
    font-size: 11px; font-weight: 600;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
    cursor: default;
  }
  ${isDark ? `
  .ms-pill {
    background: rgba(255,255,255,0.08) !important;
    border-color: rgba(255,255,255,0.14) !important;
    color: rgba(255,255,255,0.88) !important;
  }
  .ms-pill:hover {
    background: rgba(255,255,255,0.14) !important;
    border-color: rgba(255,255,255,0.24) !important;
    color: #FFFFFF !important;
    transform: translateY(-1px);
  }` : `.ms-pill:hover { filter: brightness(0.95); }`}

  .ms-tab {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 99px; border: none; cursor: pointer;
    font-size: 12px; font-weight: 600;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: all 0.18s ease;
  }
  .ms-tab-active {
    background: ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.95)"};
    color: ${isDark ? "#FFFFFF" : "rgba(0,0,0,0.78)"};
    box-shadow: ${isDark ? "0 2px 12px rgba(0,0,0,0.40)" : "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)"};
    border: 1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,1)"};
  }
  .ms-tab-inactive {
    background: ${isDark ? "transparent" : "rgba(255,255,255,0.52)"};
    color: ${isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)"};
    border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)"};
  }
  .ms-tab-inactive:hover {
    background: ${isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)"};
    border-color: ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"};
  }

  .ms-upgrade {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 11px; cursor: pointer;
    background: ${isDark ? "rgba(255,255,255,0.92)" : "rgba(15,15,22,0.85)"};
    color: ${isDark ? "#1A1A1A" : "#fff"}; font-size: 12px; font-weight: 700;
    font-family: 'Inter', -apple-system, sans-serif;
    letter-spacing: 0.045em; text-transform: uppercase;
    border: ${isDark ? "1px solid rgba(255,255,255,0.18)" : "none"};
    box-shadow: ${isDark ? "0 4px 16px rgba(255,255,255,0.10), 0 1px 4px rgba(0,0,0,0.30)" : "0 4px 16px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.07)"};
    transition: all 0.2s ease; white-space: nowrap;
  }
  .ms-upgrade:hover {
    background: ${isDark ? "#FFFFFF" : "rgba(15,15,22,0.94)"};
    box-shadow: ${isDark ? "0 6px 22px rgba(255,255,255,0.18)" : "0 6px 22px rgba(0,0,0,0.26)"};
    transform: scale(1.04);
  }

  .ms-cta {
    width: 100%; padding: 15px 0; border-radius: 14px; border: none; cursor: pointer;
    background: ${isDark ? "rgba(255,255,255,0.92)" : "rgba(15,15,22,0.82)"};
    color: ${isDark ? "#1A1A1A" : "#fff"}; font-size: 14.5px; font-weight: 700;
    font-family: 'Inter', -apple-system, sans-serif;
    letter-spacing: 0.01em;
    box-shadow: ${isDark
      ? "0 4px 20px rgba(255,255,255,0.12), 0 1px 4px rgba(0,0,0,0.30)"
      : "0 4px 16px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.07)"};
    transition: all 0.22s ease; display: block;
  }
  .ms-cta:hover {
    background: ${isDark ? "#FFFFFF" : "rgba(15,15,22,0.94)"};
    box-shadow: ${isDark
      ? "0 6px 28px rgba(255,255,255,0.22), 0 2px 8px rgba(0,0,0,0.30)"
      : "0 8px 24px rgba(0,0,0,0.26)"};
    transform: translateY(-1px) scale(1.012);
  }
  .ms-cta:active { transform: translateY(0px) scale(0.99); }

  .ms-filter-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 10px 14px; border-radius: 11px; cursor: pointer;
    background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)"};
    border: 1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"};
    color: ${isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.58)"}; font-size: 12px; font-weight: 600;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: all 0.18s ease; white-space: nowrap;
    box-shadow: ${isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,1)"};
  }
  .ms-filter-btn:hover, .ms-filter-btn.active {
    background: ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"};
    border-color: ${isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,1)"};
  }

  .ms-close-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.72)"};
    border: 1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"};
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    box-shadow: ${isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,1)"};
  }
  .ms-close-btn:hover {
    background: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.95)"};
    border-color: ${isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,1)"};
  }
`;

function useStyles(css, id) {
  useEffect(() => {
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    // Replace existing to pick up theme changes
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    document.head.appendChild(el);
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, [css]);
}

const COMPANY_META = {
  anthropic:    { name:"Anthropic", icon:"/icons/anthropic.png", accent:"rgba(0,0,0,0.52)", emoji:"◈" },
  openai:       { name:"OpenAI",    icon:"/icons/openai.png",    accent:"rgba(0,0,0,0.52)", emoji:"◎" },
  google:       { name:"Google",    icon:"/icons/google.png",    accent:"rgba(0,0,0,0.52)", emoji:"◇" },
  "meta-llama": { name:"Meta",      icon:"/icons/meta.png",      accent:"rgba(0,0,0,0.52)", emoji:"∞" },
  "x-ai":       { name:"xAI",       icon:"/icons/xai.png",       accent:"rgba(0,0,0,0.52)", emoji:"𝕏" },
  deepseek:     { name:"DeepSeek",  icon:"/icons/deepseek.png",  accent:"rgba(0,0,0,0.52)", emoji:"◈" },
};
const ALLOWED = Object.keys(COMPANY_META);

const FEATURES = [
  { icon:Eye,      label:"Vision",       color:"#059669", bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.18)" },
  { icon:Wrench,   label:"Tool Use",     color:"rgba(0,0,0,0.58)", bg:"rgba(0,0,0,0.04)", border:"rgba(0,0,0,0.09)" },
  { icon:FileText, label:"PDF Support",  color:"#7c3aed", bg:"rgba(124,58,237,0.08)",  border:"rgba(124,58,237,0.18)" },
  { icon:Zap,      label:"Fast",         color:"rgba(0,0,0,0.58)", bg:"rgba(0,0,0,0.04)", border:"rgba(0,0,0,0.09)" },
  { icon:Sparkles, label:"Reasoning",    color:"#be185d", bg:"rgba(190,24,93,0.08)",   border:"rgba(190,24,93,0.18)" },
  { icon:FileText, label:"Long Context", color:"rgba(0,0,0,0.58)", bg:"rgba(0,0,0,0.04)", border:"rgba(0,0,0,0.09)" },
];

const PRICE_FILTERS = ["All", "FREE", "$", "$$", "$$$"];

const getCo    = id  => id.split("/")[0]?.toLowerCase() || "other";
const getMeta  = c   => COMPANY_META[c] || { name:c, icon:null, accent:"rgba(0,0,0,0.52)", emoji:"◇" };
const getFeats = id  => { const h=id.split("").reduce((a,c)=>a+c.charCodeAt(0),0); return [FEATURES[h%6],FEATURES[(h+2)%6],FEATURES[(h+4)%6]]; };
const getBench = id  => {
  const h=id.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return [
    { label:"Intelligence", icon:"🧠", value:42+(h%44),      lightColor:"rgba(0,0,0,0.62)",  darkColor:"#A78BFA" },
    { label:"Speed",        icon:"⚡", value:36+((h*3)%48),  lightColor:"rgba(0,0,0,0.62)",  darkColor:"#34D399" },
    { label:"Context",      icon:"📚", value:30+((h*7)%52),  lightColor:"rgba(0,0,0,0.62)",  darkColor:"#60A5FA" },
    { label:"Value",        icon:"💎", value:45+((h*11)%42), lightColor:"rgba(0,0,0,0.62)",  darkColor:"#F472B6" },
  ];
};
const getPricingInfo = model => {
  if (!model.pricing) return null;
  const p = parseFloat(model.pricing.prompt||0);
  if (p===0)    return { label:"FREE", cls:"ms-tag-free" };
  if (p<0.0001) return { label:"$",   cls:"ms-tag-mid"  };
  if (p<0.001)  return { label:"$$",  cls:"ms-tag-mid"  };
  return              { label:"$$$", cls:"ms-tag-mid"   };
};
const matchesPriceFilter = (model, filter) => {
  if (filter === "All") return true;
  const p = getPricingInfo(model);
  return p?.label === filter;
};

function CoIcon({ company, size=36, isDark }) {
  const meta = getMeta(company);
  return (
    <div style={{
      width:size, height:size, borderRadius:size*0.26, flexShrink:0, overflow:"hidden",
      // Always use a bright white background in dark mode so logos are legible
      background: isDark ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.92)",
      border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.95)",
      boxShadow: isDark
        ? "0 2px 8px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,1)"
        : "0 1px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      {meta.icon
        ? <img src={meta.icon} alt={meta.name} style={{ width:size*0.52, height:size*0.52, objectFit:"contain" }} />
        : <span style={{ fontSize:size*0.4, color:"rgba(0,0,0,0.60)" }}>{meta.emoji}</span>
      }
    </div>
  );
}

// ── Model Row ─────────────────────────────────────────────────────────────────
function ModelRow({ model, isSelected, isFav, isLiked, onSelect, onToggleFav, onToggleLike, onInfo, isDark }) {
  const [hov, setHov] = useState(false);
  const tk = getT(isDark);
  const pricing = getPricingInfo(model);

  return (
    <motion.div
      initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
      className={`ms-row ${isSelected?"ms-sel":""}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={onSelect}
      style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"8px 12px 8px 14px", borderRadius:10,
        cursor:"pointer",
        background: isSelected
          ? (isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)")
          : hov
            ? (isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.75)")
            : (isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.40)"),
        border:"1px solid",
        borderColor: isSelected
          ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,1)")
          : hov
            ? (isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.95)")
            : (isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)"),
        boxShadow: isSelected
          ? (isDark ? "0 2px 14px rgba(0,0,0,0.30)" : "0 2px 14px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)")
          : hov
            ? (isDark ? "0 1px 6px rgba(0,0,0,0.20)" : "0 1px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)")
            : (isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,0.7)"),
        transition:"all 0.15s ease",
      }}
    >
      {/* Star */}
      <motion.button whileHover={{scale:1.28}} whileTap={{scale:0.78}}
        onClick={e=>{e.stopPropagation();onToggleFav();}}
        style={{ border:"none", background:"none", padding:2, cursor:"pointer", flexShrink:0 }}>
        <Star size={11}
          fill={isFav?"#f59e0b":"none"}
          color={isFav?"#f59e0b":hov?(isDark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.35)"):(isDark?"rgba(255,255,255,0.20)":"rgba(0,0,0,0.18)")}
          strokeWidth={1.8} />
      </motion.button>

      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:2 }}>
          <span style={{ fontSize:12.5, fontWeight:600, color: isSelected ? tk.text : hov ? tk.text : tk.textMid, letterSpacing:"-0.01em", transition:"color 0.15s" }}>
            {model.name}
          </span>
          {pricing && <span className={`ms-tag ${pricing.cls}`}>{pricing.label}</span>}
          {model.context_length>100000 && <span className="ms-tag ms-tag-ctx">128K+</span>}
          {isSelected && <span className="ms-tag ms-tag-sel"><Check size={7} strokeWidth={3}/> Active</span>}
          {isLiked && <span className="ms-tag ms-tag-liked">♥ Liked</span>}
        </div>
        <p style={{ fontSize:10.5, color:tk.textFaint, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", lineHeight:1.4 }}>
          {model.description||"No description available"}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
        <motion.button whileHover={{scale:1.2}} whileTap={{scale:0.8}}
          onClick={e=>{e.stopPropagation();onToggleLike();}}
          style={{
            width:24, height:24, borderRadius:6, border:"none", flexShrink:0,
            background: isLiked?"rgba(236,72,153,0.10)":"transparent",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            opacity: isLiked ? 1 : hov ? 0.8 : 0.35,
            transition:"all 0.15s",
          }}>
          <Heart size={11} fill={isLiked?"#be185d":"none"} color={isLiked?"#be185d":(isDark?"rgba(255,255,255,0.55)":"rgba(0,0,0,0.35)")} strokeWidth={2} />
        </motion.button>
        <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.88}}
          onClick={e=>{e.stopPropagation();onInfo();}}
          style={{
            width:24, height:24, borderRadius:6, border:"none", flexShrink:0,
            background: hov||isSelected ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.82)") : "transparent",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            opacity: hov||isSelected ? 1 : 0.2, transition:"all 0.15s",
          }}>
          <Info size={11} color={isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.48)"} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Info Dialog ───────────────────────────────────────────────────────────────
function InfoDialog({ model, onClose, onSelect, isLiked, onToggleLike, isDark }) {
  const co    = getCo(model.id);
  const meta  = getMeta(co);
  const feats = getFeats(model.id);
  const bench = getBench(model.id);
  const pricing = getPricingInfo(model);
  const [ready, setReady] = useState(false);
  const tk = getT(isDark);
  useEffect(()=>{ const t=setTimeout(()=>setReady(true),180); return ()=>clearTimeout(t); },[]);

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:0.2}}
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:70,
        display:"flex", alignItems:"center", justifyContent:"center", padding:20,
        background: isDark ? "rgba(0,0,0,0.70)" : "rgba(0,0,0,0.18)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      }}
    >
      <motion.div
        initial={{opacity:0,scale:0.88,y:30}} animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.88,y:30}}
        transition={{type:"spring",stiffness:420,damping:40}}
        onClick={e=>e.stopPropagation()}
        className="ms ms-scroll"
        style={{
          width:"100%", maxWidth:540,
          maxHeight:"90vh", overflowY:"auto",
          borderRadius:24, ...glassPanel(isDark),
          display:"flex", flexDirection:"column",
        }}
      >
        {/* Header */}
        <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${tk.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <CoIcon company={co} size={50} isDark={isDark} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5 }}>
                <h2 style={{ fontSize:21, fontWeight:700, color:tk.text, lineHeight:1.15, fontFamily:"'Inter',sans-serif" }}>{model.name}</h2>
                {pricing && <span className={`ms-tag ${pricing.cls}`}>{pricing.label}</span>}
                {model.context_length>100000 && <span className="ms-tag ms-tag-ctx">128K+</span>}
              </div>
              <p style={{ fontSize:11.5, color:tk.textSub, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase" }}>{meta.name}</p>
            </div>
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
              onClick={onToggleLike}
              style={{
                width:34, height:34, borderRadius:9,
                background: isLiked?"rgba(236,72,153,0.10)":(isDark?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.75)"),
                border:`1px solid ${isLiked?"rgba(236,72,153,0.25)":(isDark?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.95)")}`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s",
              }}>
              <Heart size={15} fill={isLiked?"#be185d":"none"} color={isLiked?"#be185d":(isDark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.32)")} strokeWidth={2} />
            </motion.button>
            <button className="ms-close-btn" onClick={onClose}>
              <X size={14} color={tk.textMid} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"22px 26px", display:"flex", flexDirection:"column", gap:20, flex:1, overflowY:"auto" }} className="ms-scroll">

          <div style={{ padding:"15px 17px", borderRadius:14, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.72)", border:`1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.95)"}` }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:tk.textDim, marginBottom:9 }}>About</p>
            <p style={{ fontSize:13.5, color:tk.textMid, lineHeight:1.75, fontWeight:400 }}>
              {model.description || `${model.name} is a powerful AI model by ${meta.name}, engineered for complex reasoning, nuanced language understanding, and high-quality generation across a wide range of tasks.`}
            </p>
          </div>

          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:tk.textDim, marginBottom:12 }}>Capabilities</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {feats.map((f,i)=>(
                <motion.div key={i} initial={{opacity:0,scale:0.82}} animate={{opacity:1,scale:1}} transition={{delay:i*0.08}}
                  className="ms-pill" style={{ background:f.bg, border:`1px solid ${f.border}`, color:f.color }}>
                  <f.icon size={12} strokeWidth={2}/>{f.label}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:tk.textDim, marginBottom:12 }}>Specifications</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              {[
                { label:"Provider",  value:meta.name },
                { label:"Developer", value:meta.name },
                { label:"Context",   value:model.context_length?`${(model.context_length/1000).toFixed(0)}K tokens`:"N/A" },
                { label:"Pricing",   value:pricing?.label||"Standard" },
                { label:"Added",     value:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) },
                { label:"Status",    value:"Available" },
              ].map(item=>(
                <div key={item.label} style={{ padding:"11px 14px", borderRadius:10, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.72)", border:`1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.95)"}` }}>
                  <p style={{ fontSize:9.5, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:tk.textDim, marginBottom:5 }}>{item.label}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:tk.text }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:tk.textDim }}>Performance</p>
              <span style={{ fontSize:10, color:tk.textFaint }}>via Artificial Analysis ↗</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {bench.map((b,i)=>{
                const benchColor = isDark ? b.darkColor : b.lightColor;
                const trackColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
                const r=28, circ=2*Math.PI*r;
                const dash=circ*(1-(ready?b.value:0)/100);
                return (
                  <div key={b.label} style={{
                    padding:"14px 8px 11px", borderRadius:12, textAlign:"center",
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.72)",
                    border:`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.95)"}`,
                    boxShadow: isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,1)",
                  }}>
                    <svg width={66} height={66} style={{ display:"block", margin:"0 auto 6px" }}>
                      <circle cx={33} cy={33} r={r} fill="none" stroke={trackColor} strokeWidth={4.5}/>
                      <circle cx={33} cy={33} r={r} fill="none"
                        stroke={benchColor} strokeWidth={4.5}
                        strokeDasharray={circ} strokeDashoffset={dash}
                        strokeLinecap="round" transform="rotate(-90 33 33)"
                        style={{transition:"stroke-dashoffset 0.95s cubic-bezier(0.22,1,0.36,1)"}}/>
                      <text x={33} y={33} textAnchor="middle" fontSize={11} fontWeight="700"
                        fill={isDark ? "#FFFFFF" : benchColor}
                        dominantBaseline="middle" fontFamily="Inter,sans-serif">{b.value}%</text>
                    </svg>
                    <p style={{ fontSize:9.5, fontWeight:600, color: isDark ? "rgba(255,255,255,0.55)" : tk.textSub, letterSpacing:"0.03em" }}>{b.label}</p>
                    <p style={{ fontSize:12, marginTop:3, lineHeight:1 }}>{b.icon}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding:"16px 26px 22px", flexShrink:0, borderTop:`1px solid ${tk.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)" }}>
          <button className="ms-cta" onClick={()=>{ onSelect({id:model.id,name:model.name}); onClose(); }}>
            Use {model.name} →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Sidebar Button ────────────────────────────────────────────────────────────
function SidebarButton({ co, meta, active, isDark, tk, grouped, onClick }) {
  const [hov, setHov] = useState(false);

  const bg = active
    ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)")
    : hov
      ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)")
      : "transparent";

  const nameColor = active
    ? (isDark ? "#FFFFFF" : "rgba(0,0,0,0.88)")
    : hov
      ? (isDark ? "#FFFFFF" : "rgba(0,0,0,0.82)")
      : (isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.52)");

  const countColor = active
    ? (isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.55)")
    : hov
      ? (isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.48)")
      : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)");

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
        padding: "12px 6px", borderRadius: 13, border: "none", cursor: "pointer",
        background: bg,
        outline: `1px solid ${active ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)") : hov ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)") : "transparent"}`,
        boxShadow: active
          ? (isDark ? "0 2px 12px rgba(0,0,0,0.40)" : "0 2px 8px rgba(0,0,0,0.08)")
          : "none",
        transition: "all 0.18s ease", position: "relative",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {active && (
        <motion.div layoutId="sidebar-indicator" style={{
          position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 24, borderRadius: 99,
          background: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.30)",
        }} />
      )}
      <CoIcon company={co} size={40} isDark={isDark} />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: nameColor, marginBottom: 2, transition: "color 0.15s" }}>{meta.name}</p>
        <p style={{ fontSize: 9.5, color: countColor, fontWeight: 500, transition: "color 0.15s" }}>{grouped[co].length} models</p>
      </div>
    </motion.button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const ModelSelector = ({ isOpen, onClose, selectedModel, onSelectModel }) => {
  const { isDark } = useTheme();
  const tk = getT(isDark);

  useStyles(STYLES(isDark), "ms-fixed-v2");

  const [models,      setModels]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [query,       setQuery]       = useState("");
  const [favs,        setFavs]        = useState(() => {
    try { const s=typeof window!=="undefined"&&window.localStorage.getItem("ms-fav-models"); return s?JSON.parse(s):[]; } catch { return []; }
  });
  const [likes,       setLikes]       = useState(() => {
    try { const s=typeof window!=="undefined"&&window.localStorage.getItem("ms-liked-models"); return s?JSON.parse(s):[]; } catch { return []; }
  });
  const [company,     setCompany]     = useState(null);
  const [tab,         setTab]         = useState("browse");
  const [infoModel,   setInfoModel]   = useState(null);
  const [showFilter,  setShowFilter]  = useState(false);
  const [priceFilter, setPriceFilter] = useState("All");
  const [ctxFilter,   setCtxFilter]   = useState(false);

  useEffect(()=>{ if (isOpen) load(); },[isOpen]);

  const load = async () => {
    setLoading(true);
    try {
      const r=await fetch("/api/ai/get-models"); const d=await r.json();
      setModels(d.models||[]);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const toggleFav = id => setFavs(prev => {
    const next = prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
    try { window.localStorage.setItem("ms-fav-models",JSON.stringify(next)); } catch {}
    return next;
  });
  const toggleLike = id => setLikes(prev => {
    const next = prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
    try { window.localStorage.setItem("ms-liked-models",JSON.stringify(next)); } catch {}
    return next;
  });

  const grouped = models.reduce((acc,m)=>{
    const c=getCo(m.id); if(!ALLOWED.includes(c)) return acc;
    if(!acc[c]) acc[c]=[]; acc[c].push(m); return acc;
  },{});

  useEffect(()=>{
    if (isOpen && !company && Object.keys(grouped).length>0)
      setCompany(Object.keys(grouped)[0]);
  },[isOpen,models]);

  const applyFilters = list => list
    .filter(m=>matchesPriceFilter(m,priceFilter))
    .filter(m=>!ctxFilter||m.context_length>100000)
    .filter(m=>m.name.toLowerCase().includes(query.toLowerCase())||m.id.toLowerCase().includes(query.toLowerCase()));

  const filtered = company&&grouped[company] ? applyFilters(grouped[company]) : [];
  const likedModels = likes.length===0 ? [] : models.filter(m=>
    likes.includes(m.id) &&
    (query===""||m.name.toLowerCase().includes(query.toLowerCase())||m.id.toLowerCase().includes(query.toLowerCase()))
  );

  const activeFilters = (priceFilter!=="All"?1:0)+(ctxFilter?1:0);

  if (!isOpen) return null;

  // Dynamic inline style helpers
  const headerBg   = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.60)";
  const sidebarBg  = isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.45)";
  const listBg     = isDark ? "#1E1E1E"                : "rgba(255,255,255,0.28)";
  const footerBg   = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)";
  const inputBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)";
  const inputBorder= isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.95)";
  const filterActiveBg = isDark ? "rgba(255,255,255,0.92)" : "rgba(15,15,22,0.82)";
  const filterActiveColor = isDark ? "#1A1A1A" : "#fff";
  const filterInactiveBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.78)";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration:0.2}} onClick={onClose}
            style={{
              position:"fixed", inset:0, zIndex:50,
              display:"flex", alignItems:"center", justifyContent:"center", padding:16,
              background: isDark ? "rgba(0,0,0,0.70)" : "rgba(0,0,0,0.14)",
              backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
            }}
          >
            <motion.div
              initial={{opacity:0,scale:0.92,y:24}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.92,y:24}}
              transition={{type:"spring",stiffness:380,damping:38}}
              onClick={e=>e.stopPropagation()}
              className="ms"
              style={{
                width:"100%", maxWidth:760,
                borderRadius:24, ...glassPanel(isDark),
                overflow:"hidden", maxHeight:"90vh",
                display:"flex", flexDirection:"column",
              }}
            >
              {/* ── Header ── */}
              <div style={{ padding:"22px 28px 16px", borderBottom:`1px solid ${tk.border}`, flexShrink:0, background: headerBg }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                  <div>
                    <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:tk.textDim, marginBottom:6 }}>✦ Powered by OpenRouter</p>
                    <h2 style={{ fontSize:28, fontWeight:700, color:tk.text, letterSpacing:"-0.022em", lineHeight:1.08, fontFamily:"'Inter',sans-serif" }}>Choose a Model</h2>
                    <p style={{ fontSize:13, color:tk.textFaint, marginTop:4, fontFamily:"'Inter',sans-serif" }}>
                      {models.length>0?`${models.length} models available`:"Loading…"}
                    </p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    <button className="ms-upgrade"><Crown size={12}/> Upgrade</button>
                    <button className="ms-close-btn" onClick={onClose}><X size={15} color={tk.textMid}/></button>
                  </div>
                </div>

                {/* Search + Filter */}
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ position:"relative", flex:1 }}>
                    <Search size={14} color={tk.textFaint} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                    <input className="ms-search" type="text" value={query}
                      onChange={e=>setQuery(e.target.value)}
                      placeholder="Search models…"
                      style={{
                        width:"100%", padding:"11px 16px 11px 40px",
                        borderRadius:11, fontSize:13, fontWeight:400,
                        background: inputBg,
                        border:`1px solid ${inputBorder}`,
                        color:tk.text, boxSizing:"border-box",
                        boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
                        transition:"all 0.2s ease", fontFamily:"'Inter',sans-serif",
                      }}
                      onFocus={e=>{ e.target.style.borderColor=isDark?"rgba(255,255,255,0.70)":"rgba(255,255,255,1)"; e.target.style.boxShadow=isDark?"0 0 0 3px rgba(255,255,255,0.08)":"0 0 0 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)"; }}
                      onBlur={e=>{ e.target.style.borderColor=inputBorder; e.target.style.boxShadow=isDark?"none":"0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)"; }}
                    />
                  </div>
                  <button className={`ms-filter-btn ${showFilter?"active":""}`}
                    onClick={()=>setShowFilter(p=>!p)} style={{ position:"relative" }}>
                    <SlidersHorizontal size={14}/> Filters
                    {activeFilters>0 && (
                      <span style={{
                        position:"absolute", top:-6, right:-6, width:16, height:16, borderRadius:99,
                        background: isDark ? "rgba(255,255,255,0.90)" : "rgba(15,15,22,0.82)",
                        color: isDark ? "#1A1A1A" : "#fff",
                        fontSize:9, fontWeight:700,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>{activeFilters}</span>
                    )}
                  </button>
                </div>

                {/* Filter panel */}
                <AnimatePresence>
                  {showFilter && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                      transition={{duration:0.2}} style={{ overflow:"hidden" }}>
                      <div style={{ paddingTop:12, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:11, fontWeight:600, color:tk.textDim, letterSpacing:"0.06em", textTransform:"uppercase" }}>Price:</span>
                        {PRICE_FILTERS.map(f=>(
                          <button key={f} onClick={()=>setPriceFilter(f)} style={{
                            padding:"5px 12px", borderRadius:99, border:"none", cursor:"pointer",
                            fontSize:11, fontWeight:600,
                            background: priceFilter===f ? filterActiveBg : filterInactiveBg,
                            color: priceFilter===f ? filterActiveColor : tk.textMid,
                            outline: priceFilter===f ? "none" : `1px solid ${isDark?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.92)"}`,
                            fontFamily:"'Inter',sans-serif",
                            boxShadow: priceFilter===f ? "0 2px 8px rgba(0,0,0,0.16)" : (isDark?"none":"inset 0 1px 0 rgba(255,255,255,1)"),
                            transition:"all 0.15s",
                          }}>{f}</button>
                        ))}
                        <div style={{ width:1, height:20, background:tk.border, margin:"0 4px" }} />
                        <button onClick={()=>setCtxFilter(p=>!p)} style={{
                          padding:"5px 12px", borderRadius:99, border:"none", cursor:"pointer",
                          fontSize:11, fontWeight:600,
                          background: ctxFilter ? filterActiveBg : filterInactiveBg,
                          color: ctxFilter ? filterActiveColor : tk.textMid,
                          outline: ctxFilter ? "none" : `1px solid ${isDark?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.92)"}`,
                          fontFamily:"'Inter',sans-serif",
                          boxShadow: ctxFilter ? "0 2px 8px rgba(0,0,0,0.16)" : (isDark?"none":"inset 0 1px 0 rgba(255,255,255,1)"),
                          transition:"all 0.15s",
                        }}>128K+ Context</button>
                        {activeFilters>0 && (
                          <button onClick={()=>{setPriceFilter("All");setCtxFilter(false);}} style={{
                            padding:"5px 12px", borderRadius:99, border:"none", cursor:"pointer",
                            fontSize:11, fontWeight:600, color:tk.textFaint,
                            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                            fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                          }}>✕ Clear</button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tabs */}
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  <button className={`ms-tab ${tab==="browse"?"ms-tab-active":"ms-tab-inactive"}`} onClick={()=>setTab("browse")}>
                    Browse Models
                  </button>
                  <button className={`ms-tab ${tab==="liked"?"ms-tab-active":"ms-tab-inactive"}`} onClick={()=>setTab("liked")}>
                    <Heart size={12} fill={tab==="liked"?(isDark?"#FFFFFF":"rgba(0,0,0,0.68)"):"none"} />
                    Liked {likes.length>0&&`(${likes.length})`}
                  </button>
                </div>
              </div>

              {/* ── Body ── */}
              <div style={{ display:"flex", flex:1, minHeight:0, overflow:"hidden" }}>

                {/* Sidebar */}
                {tab==="browse" && (
                  <div className="ms-scroll" style={{
                    width:130, flexShrink:0, overflowY:"auto",
                    borderRight:`1px solid ${tk.border}`,
                    background: sidebarBg,
                    padding:"12px 8px", display:"flex", flexDirection:"column", gap:4,
                  }}>
                    {loading
                      ? [0,1,2,3].map(i=><div key={i} className="ms-skel" style={{ height:82, animationDelay:`${i*0.12}s` }} />)
                      : Object.keys(grouped).map(co=>{
                        const meta=getMeta(co); const active=company===co;
                        return (
                          <SidebarButton key={co} co={co} meta={meta} active={active}
                            isDark={isDark} tk={tk} grouped={grouped}
                            onClick={()=>setCompany(co)} />
                        );
                      })}
                  </div>
                )}

                {/* Model list */}
                <div className="ms-scroll" style={{ flex:1, overflowY:"auto", background: listBg }}>

                  {tab==="browse" && (
                    loading ? (
                      <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
                        {[0,1,2,3,4,5].map(i=><div key={i} className="ms-skel" style={{ height:52, animationDelay:`${i*0.07}s` }} />)}
                      </div>
                    ) : company ? (
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${tk.border}` }}>
                          <CoIcon company={company} size={40} isDark={isDark} />
                          <div>
                            <h3 style={{ fontSize:17, fontWeight:700, color:tk.text, fontFamily:"'Inter',sans-serif" }}>{getMeta(company).name}</h3>
                            <p style={{ fontSize:11, color:tk.textDim, marginTop:2 }}>{filtered.length} model{filtered.length!==1?"s":""} available</p>
                          </div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                          {filtered.length>0 ? filtered.map((model,idx)=>(
                            <ModelRow key={model.id||idx}
                              model={model}
                              isSelected={model.id===selectedModel?.id}
                              isFav={favs.includes(model.id)}
                              isLiked={likes.includes(model.id)}
                              onSelect={()=>{ onSelectModel({id:model.id,name:model.name}); onClose(); }}
                              onToggleFav={()=>toggleFav(model.id)}
                              onToggleLike={()=>toggleLike(model.id)}
                              onInfo={()=>setInfoModel(model)}
                              isDark={isDark}
                            />
                          )) : (
                            <div style={{ textAlign:"center", padding:"60px 0" }}>
                              <p style={{ fontSize:14, color:tk.textFaint }}>No models match your filters</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null
                  )}

                  {tab==="liked" && (
                    <div style={{ padding:"16px 18px" }}>
                      {loading&&likes.length>0 ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          {likes.slice(0,4).map((_,i)=><div key={i} className="ms-skel" style={{ height:52, animationDelay:`${i*0.07}s` }} />)}
                        </div>
                      ) : likedModels.length===0 ? (
                        <div style={{ textAlign:"center", padding:"60px 20px" }}>
                          <Heart size={36} color={isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.10)"} style={{ margin:"0 auto 14px", display:"block" }} />
                          <p style={{ fontSize:15, fontWeight:600, color:tk.textMid, marginBottom:6 }}>{likes.length>0?"Loading liked models…":"No liked models yet"}</p>
                          <p style={{ fontSize:13, color:tk.textFaint }}>{likes.length>0?"Please wait while models load":"Browse models and click the ♥ heart to save favourites here"}</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${tk.border}` }}>
                            <h3 style={{ fontSize:17, fontWeight:700, color:tk.text, fontFamily:"'Inter',sans-serif" }}>Liked Models</h3>
                            <p style={{ fontSize:11, color:tk.textDim, marginTop:2 }}>{likedModels.length} model{likedModels.length!==1?"s":""}</p>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                            {likedModels.map((model,idx)=>(
                              <ModelRow key={model.id||idx}
                                model={model}
                                isSelected={model.id===selectedModel?.id}
                                isFav={favs.includes(model.id)}
                                isLiked={likes.includes(model.id)}
                                onSelect={()=>{ onSelectModel({id:model.id,name:model.name}); onClose(); }}
                                onToggleFav={()=>toggleFav(model.id)}
                                onToggleLike={()=>toggleLike(model.id)}
                                onInfo={()=>setInfoModel(model)}
                                isDark={isDark}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{
                padding:"10px 24px", flexShrink:0,
                borderTop:`1px solid ${tk.border}`,
                background: footerBg,
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <p style={{ fontSize:10, color:tk.textFaint, letterSpacing:"0.03em", fontFamily:"'Inter',sans-serif" }}>
                  {models.length} models · {favs.length>0?`${favs.length} starred`:""}{favs.length>0&&likes.length>0?" · ":""}{likes.length>0?`${likes.length} liked`:""}{favs.length===0&&likes.length===0?"No favourites yet":""}
                </p>
                {selectedModel?.id && (
                  <p style={{ fontSize:10, color:tk.textMid, fontWeight:700, display:"flex", alignItems:"center", gap:5, fontFamily:"'Inter',sans-serif" }}>
                    <Check size={10} strokeWidth={3}/> {selectedModel.name}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoModel && (
          <InfoDialog
            model={infoModel}
            onClose={()=>setInfoModel(null)}
            onSelect={m=>{ onSelectModel(m); setInfoModel(null); onClose(); }}
            isLiked={likes.includes(infoModel.id)}
            onToggleLike={()=>toggleLike(infoModel.id)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ModelSelector;