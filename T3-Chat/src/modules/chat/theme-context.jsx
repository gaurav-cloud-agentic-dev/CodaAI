"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

// ─── Theme Context ─────────────────────────────────────────────────────────
const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("coda-theme") === "dark";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem("coda-theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// ─── Theme Toggle Button ───────────────────────────────────────────────────
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 12,
        cursor: "pointer",
        background: isDark ? "#2E2E2E" : "rgba(15,15,22,0.85)",
        border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.50)"
          : "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
        transition: "all 0.18s ease",
        minWidth: 38,
        justifyContent: "center",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? "#3A3A3A" : "rgba(15,15,22,0.95)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? "#2E2E2E" : "rgba(15,15,22,0.85)";
      }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Sun style={{ width: 13, height: 13, color: "#FCD34D" }} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#FCD34D", letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" }}>
              LIGHT
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Moon style={{ width: 13, height: 13, color: "#fff" }} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" }}>
              DARK
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Anti-flash script — add <ThemeScript /> inside <head> in layout.tsx ────
// This runs before React hydrates to prevent white flash on dark mode reload.
export function ThemeScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      (function() {
        try {
          var t = localStorage.getItem('coda-theme');
          if (t === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
          }
        } catch(e) {}
      })();
    `}} />
  );
}

// ─── Dark theme CSS ────────────────────────────────────────────────────────
// NOTE: Only injects pseudo-selector & hover overrides that can't be done inline.
// Background layers use inline styles in each component — no class overrides needed.
export function DarkModeStyles({ isDark }) {
  return (
    <style key={isDark ? "dms-dark" : "dms-light"}>{`
      /* Scrollbars */
      .cv-scroll::-webkit-scrollbar-thumb {
        background: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} !important;
      }
      ::-webkit-scrollbar-thumb {
        background: ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)"} !important;
      }

      /* Chat input focus ring */
      .cv-input-wrap:focus-within {
        box-shadow:
          0 0 0 2px rgba(${isDark ? "255,255,255,0.18" : "59,158,255,0.22"}),
          0 0 0 6px rgba(${isDark ? "255,255,255,0.05" : "59,158,255,0.06"}),
          0 20px 56px rgba(0,0,0,${isDark ? "0.40" : "0.06"})${isDark ? "" : ", inset 0 1px 0 rgba(255,255,255,1)"} !important;
        border-color: ${isDark ? "rgba(255,255,255,0.22)" : "rgba(59,158,255,0.35)"} !important;
      }
      .cv-input-wrap textarea::placeholder {
        color: ${isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.32)"} !important;
      }

      /* Main-chat glass input focus ring */
      .mcp-root.dark .mcp-glass:focus-within {
        box-shadow:
          0 0 0 2px rgba(255,255,255,0.18),
          0 0 0 6px rgba(255,255,255,0.05),
          0 20px 56px rgba(0,0,0,0.50) !important;
        border-color: rgba(255,255,255,0.22) !important;
      }
      .mcp-root.dark .mcp-glass textarea::placeholder {
        color: rgba(255,255,255,0.22) !important;
      }

      /* Quick-start cards hover */
      .mcp-root.dark .mcp-card:hover {
        background: #2E2E2E !important;
        border-color: rgba(255,255,255,0.08) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.50) !important;
      }
    `}</style>
  );
}

// ─── Dark theme tokens ─────────────────────────────────────────────────────
// Scale: #1A1A1A page → #252525 cards/input → #2E2E2E buttons → #3A3A3A hover
export function getDarkTokens(isDark) {
  if (!isDark) return {};
  return {
    pageBg: "#1A1A1A",
    frostBg: "transparent",           // no frost overlay in dark — base bg is solid
    blobColor1: "rgba(0,0,0,0)",
    blobColor2: "rgba(0,0,0,0)",
    blobColor3: "rgba(0,0,0,0)",
    blobColor4: "rgba(0,0,0,0)",

    headerBg: "rgba(22,22,22,0.98)",
    headerBorder: "rgba(255,255,255,0.06)",

    sidebarLayerA: "#1A1A1A",
    sidebarLayerC: "rgba(18,18,18,0.95)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    sidebarActiveItem: "#2E2E2E",
    sidebarHoverItem: "#252525",
    sidebarText: "#FFFFFF",
    sidebarSubText: "rgba(255,255,255,0.55)",
    sidebarDivider: "rgba(255,255,255,0.06)",

    cardBg: "#252525",
    cardBorder: "rgba(255,255,255,0.06)",
    cardHoverBg: "#2E2E2E",
    cardText: "#FFFFFF",
    cardSubText: "rgba(255,255,255,0.45)",

    inputBg: "#252525",
    inputBorder: "rgba(255,255,255,0.07)",
    inputText: "#FFFFFF",
    inputPlaceholder: "rgba(255,255,255,0.22)",
    inputShadow: "0 4px 24px rgba(0,0,0,0.60), 0 1px 4px rgba(0,0,0,0.40)",

    modelBtnBg: "#2E2E2E",
    modelBtnBorder: "rgba(255,255,255,0.07)",
    modelBtnText: "#FFFFFF",
    modelBtnHoverBg: "#3A3A3A",

    iconColor: "rgba(255,255,255,0.65)",
    iconHoverBg: "rgba(255,255,255,0.06)",

    userBubbleBg: "#252525",
    userBubbleBorder: "rgba(255,255,255,0.06)",
    aiBubbleBg: "transparent",
    messageText: "#FFFFFF",
    timestampText: "rgba(255,255,255,0.30)",

    userAvatarBg: "#2E2E2E",
    botAvatarBg: "#252525",
    avatarBorder: "rgba(255,255,255,0.08)",

    dividerColor: "rgba(255,255,255,0.06)",
    gradientFade: "linear-gradient(to bottom, transparent 0%, rgba(26,26,26,0.99) 45%)",

    scrollBtnBg: "#252525",
    scrollBtnBorder: "rgba(255,255,255,0.07)",

    thinkingBg: "rgba(255,255,255,0.03)",
    thinkingBorder: "rgba(255,255,255,0.06)",
    thinkingText: "rgba(255,255,255,0.50)",

    disclaimerText: "rgba(255,255,255,0.25)",

    freePlanBg: "#2E2E2E",
    freePlanBorder: "rgba(255,255,255,0.07)",
    freePlanText: "rgba(255,255,255,0.60)",

    compareShareBg: "#2E2E2E",
    compareShareBorder: "rgba(255,255,255,0.07)",
    compareShareText: "rgba(255,255,255,0.75)",
    compareShareHover: "#3A3A3A",
    spinnerBorder: "rgba(255,255,255,0.10)",
    spinnerTop: "rgba(255,255,255,0.60)",
  };
}