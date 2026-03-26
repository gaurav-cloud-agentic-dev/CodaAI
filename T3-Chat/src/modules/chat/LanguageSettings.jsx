"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, createContext, useContext } from "react";
import { Globe, X, Check } from "lucide-react";
import { useTheme } from "./theme-context";

export const LANGUAGES = [
  { code: "en-us", label: "English (American)", native: "English",  abbr: "US" },
  { code: "en-uk", label: "English (UK)",        native: "English",  abbr: "GB" },
  { code: "hi",    label: "Hindi",               native: "हिन्दी",   abbr: "IN" },
  { code: "bn",    label: "Bengali",             native: "বাংলা",    abbr: "BD" },
  { code: "mr",    label: "Marathi",             native: "मराठी",    abbr: "IN" },
];

export const UI_STRINGS = {
  "en-us": {
    greeting: "Good afternoon", subtitle: "How can I help you today?",
    newChat: "New chat", search: "Search", chats: "Chats", projects: "Projects",
    recent: "RECENT", settings: "Settings", language: "Language",
    getHelp: "Get help", upgradePlan: "Upgrade plan", logout: "Log out",
    freePlan: "Free plan", upgrade: "Upgrade", placeholder: "Type your message...",
    selectModel: "Select Model", disclaimer: "CodaAI can make mistakes. Consider checking important info.",
    pinned: "Pinned", pin: "Pin", unpin: "Unpin", share: "Share", star: "Star",
    rename: "Rename", addToProject: "Add to project", delete: "Delete",
    deleteChat: "Delete Chat?", deleteChatConfirm: "Are you sure you want to delete",
    deleteCannotUndo: "This action cannot be undone.", cancel: "Cancel", deleting: "Deleting...",
    shareConversation: "Share Conversation", shareDesc: "Anyone with the link will be able to view this conversation.",
    copyShareLink: "Copy Share Link", createProject: "Create a personal project",
    howToUseProjects: "How to use projects",
    projectDesc1: "Projects help organize your work and leverage knowledge across multiple conversations.",
    projectDesc2: "Start by creating a memorable title and description to organize your project.",
    whatAreYouWorkingOn: "What are you working on?", nameYourProject: "Name your project",
    whatAreYouTryingToAchieve: "What are you trying to achieve?",
    describeYourProject: "Describe your project, goals, subject, etc...",
    createProjectBtn: "Create project", noChatsYet: "No chats yet. Start a new conversation!",
    noChatsFound: "No chats found", searchChats: "Search chats...",
  },
  "en-uk": {
    greeting: "Good afternoon", subtitle: "How can I help you today?",
    newChat: "New chat", search: "Search", chats: "Chats", projects: "Projects",
    recent: "RECENT", settings: "Settings", language: "Language",
    getHelp: "Get help", upgradePlan: "Upgrade plan", logout: "Log out",
    freePlan: "Free plan", upgrade: "Upgrade", placeholder: "Type your message...",
    selectModel: "Select Model", disclaimer: "CodaAI can make mistakes. Consider checking important info.",
    pinned: "Pinned", pin: "Pin", unpin: "Unpin", share: "Share", star: "Star",
    rename: "Rename", addToProject: "Add to project", delete: "Delete",
    deleteChat: "Delete Chat?", deleteChatConfirm: "Are you sure you want to delete",
    deleteCannotUndo: "This action cannot be undone.", cancel: "Cancel", deleting: "Deleting...",
    shareConversation: "Share Conversation", shareDesc: "Anyone with the link will be able to view this conversation.",
    copyShareLink: "Copy Share Link", createProject: "Create a personal project",
    howToUseProjects: "How to use projects",
    projectDesc1: "Projects help organise your work and leverage knowledge across multiple conversations.",
    projectDesc2: "Start by creating a memorable title and description to organise your project.",
    whatAreYouWorkingOn: "What are you working on?", nameYourProject: "Name your project",
    whatAreYouTryingToAchieve: "What are you trying to achieve?",
    describeYourProject: "Describe your project, goals, subject, etc...",
    createProjectBtn: "Create project", noChatsYet: "No chats yet. Start a new conversation!",
    noChatsFound: "No chats found", searchChats: "Search chats...",
  },
  hi: {
    greeting: "शुभ दोपहर", subtitle: "आज मैं आपकी कैसे सहायता कर सकता हूँ?",
    newChat: "नई चैट", search: "खोजें", chats: "चैट्स", projects: "प्रोजेक्ट्स",
    recent: "हाल का", settings: "सेटिंग्स", language: "भाषा",
    getHelp: "सहायता लें", upgradePlan: "अपग्रेड करें", logout: "लॉग आउट",
    freePlan: "मुफ़्त प्लान", upgrade: "अपग्रेड", placeholder: "अपना संदेश लिखें...",
    selectModel: "मॉडेल चुनें", disclaimer: "CodaAI गलतियाँ कर सकता है।",
    pinned: "पिन किया गया", pin: "पिन करें", unpin: "अनपिन करें", share: "शेयर करें",
    star: "स्टार करें", rename: "नाम बदलें", addToProject: "प्रोजेक्ट में जोड़ें",
    delete: "हटाएं", deleteChat: "चैट हटाएं?", deleteChatConfirm: "क्या आप वाकई हटाना चाहते हैं",
    deleteCannotUndo: "यह क्रिया पूर्ववत नहीं की जा सकती।", cancel: "रद्द करें", deleting: "हटाया जा रहा है...",
    shareConversation: "बातचीत शेयर करें", shareDesc: "लिंक वाला कोई भी इस बातचीत को देख सकेगा।",
    copyShareLink: "शेयर लिंक कॉपी करें", createProject: "एक व्यक्तिगत प्रोजेक्ट बनाएं",
    howToUseProjects: "प्रोजेक्ट का उपयोग कैसे करें",
    projectDesc1: "प्रोजेक्ट आपके काम को व्यवस्थित करने में मदद करते हैं।",
    projectDesc2: "एक यादगार शीर्षक और विवरण बनाकर शुरू करें।",
    whatAreYouWorkingOn: "आप किस पर काम कर रहे हैं?", nameYourProject: "अपने प्रोजेक्ट का नाम दें",
    whatAreYouTryingToAchieve: "आप क्या हासिल करने की कोशिश कर रहे हैं?",
    describeYourProject: "अपने प्रोजेक्ट, लक्ष्य, विषय आदि का वर्णन करें...",
    createProjectBtn: "प्रोजेक्ट बनाएं", noChatsYet: "अभी तक कोई चैट नहीं।",
    noChatsFound: "कोई चैट नहीं मिली", searchChats: "चैट खोजें...",
  },
  bn: {
    greeting: "শুভ বিকাল", subtitle: "আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    newChat: "নতুন চ্যাট", search: "খুঁজুন", chats: "চ্যাটস", projects: "প্রজেক্টস",
    recent: "সাম্প্রতিক", settings: "সেটিংস", language: "ভাষা",
    getHelp: "সাহায্য নিন", upgradePlan: "আপগ্রেড করুন", logout: "লগ আউট",
    freePlan: "ফ্রি প্ল্যান", upgrade: "আপগ্রেড", placeholder: "আপনার বার্তা টাইপ করুন...",
    selectModel: "মডেল নির্বাচন করুন", disclaimer: "CodaAI ভুল করতে পারে।",
    pinned: "পিন করা", pin: "পিন করুন", unpin: "আনপিন করুন", share: "শেয়ার করুন",
    star: "স্টার করুন", rename: "নাম পরিবর্তন করুন", addToProject: "প্রজেক্টে যোগ করুন",
    delete: "মুছুন", deleteChat: "চ্যাট মুছবেন?", deleteChatConfirm: "আপনি কি সত্যিই মুছতে চান",
    deleteCannotUndo: "এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না।", cancel: "বাতিল করুন", deleting: "মুছে ফেলা হচ্ছে...",
    shareConversation: "কথোপকথন শেয়ার করুন", shareDesc: "লিংক সহ যে কেউ দেখতে পারবে।",
    copyShareLink: "শেয়ার লিংক কপি করুন", createProject: "একটি প্রজেক্ট তৈরি করুন",
    howToUseProjects: "প্রজেক্ট কীভাবে ব্যবহার করবেন",
    projectDesc1: "প্রজেক্ট আপনার কাজ সংগঠিত করতে সাহায্য করে।",
    projectDesc2: "একটি শিরোনাম এবং বিবরণ তৈরি করে শুরু করুন।",
    whatAreYouWorkingOn: "আপনি কিসে কাজ করছেন?", nameYourProject: "প্রজেক্টের নাম দিন",
    whatAreYouTryingToAchieve: "আপনি কী অর্জন করতে চাইছেন?",
    describeYourProject: "আপনার প্রজেক্ট বর্ণনা করুন...",
    createProjectBtn: "প্রজেক্ট তৈরি করুন", noChatsYet: "এখনো কোনো চ্যাট নেই।",
    noChatsFound: "কোনো চ্যাট পাওয়া যায়নি", searchChats: "চ্যাট খুঁজুন...",
  },
  mr: {
    greeting: "शुभ दुपार", subtitle: "आज मी तुम्हाला कशी मदत करू शकतो?",
    newChat: "नवीन चॅट", search: "शोधा", chats: "चॅट्स", projects: "प्रोजेक्ट्स",
    recent: "अलीकडील", settings: "सेटिंग्ज", language: "भाषा",
    getHelp: "मदत मिळवा", upgradePlan: "अपग्रेड करा", logout: "लॉग आउट",
    freePlan: "मोफत प्लान", upgrade: "अपग्रेड", placeholder: "तुमचा संदेश लिहा...",
    selectModel: "मॉडेल निवडा", disclaimer: "CodaAI चुका करू शकतो.",
    pinned: "पिन केलेले", pin: "पिन करा", unpin: "अनपिन करा", share: "शेअर करा",
    star: "स्टार करा", rename: "नाव बदला", addToProject: "प्रोजेक्टमध्ये जोडा",
    delete: "हटवा", deleteChat: "चॅट हटवायची?", deleteChatConfirm: "तुम्हाला खरोखर हटवायचे आहे का",
    deleteCannotUndo: "ही क्रिया पूर्ववत करता येणार नाही.", cancel: "रद्द करा", deleting: "हटवले जात आहे...",
    shareConversation: "संभाषण शेअर करा", shareDesc: "लिंक असलेला कोणीही पाहू शकेल.",
    copyShareLink: "शेअर लिंक कॉपी करा", createProject: "एक प्रोजेक्ट तयार करा",
    howToUseProjects: "प्रोजेक्ट कसे वापरावे",
    projectDesc1: "प्रोजेक्ट तुमचे काम व्यवस्थित करण्यात मदत करतात.",
    projectDesc2: "एक शीर्षक आणि वर्णन तयार करून सुरुवात करा.",
    whatAreYouWorkingOn: "तुम्ही काय काम करत आहात?", nameYourProject: "प्रोजेक्टला नाव द्या",
    whatAreYouTryingToAchieve: "तुम्ही काय साध्य करण्याचा प्रयत्न करत आहात?",
    describeYourProject: "तुमच्या प्रोजेक्टचे वर्णन करा...",
    createProjectBtn: "प्रोजेक्ट तयार करा", noChatsYet: "अद्याप कोणतीही चॅट नाही.",
    noChatsFound: "कोणतीही चॅट सापडली नाही", searchChats: "चॅट शोधा...",
  },
};

const LanguageContext = createContext(null);
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [activeLanguage, setActiveLanguageState] = useState(LANGUAGES[0]);
  const [responseMode, setResponseModeState] = useState("alwaysAsk");

  useEffect(() => {
    try {
      const savedCode = localStorage.getItem("coda-language");
      const savedMode = localStorage.getItem("coda-response-mode");
      if (savedCode) {
        const found = LANGUAGES.find((l) => l.code === savedCode);
        if (found) setActiveLanguageState(found);
      }
      if (savedMode) setResponseModeState(savedMode);
    } catch (_) {}
  }, []);

  const setActiveLanguage = (lang) => {
    setActiveLanguageState(lang);
    try { localStorage.setItem("coda-language", lang.code); } catch (_) {}
  };
  const setResponseMode = (mode) => {
    setResponseModeState(mode);
    try { localStorage.setItem("coda-response-mode", mode); } catch (_) {}
  };

  const t = UI_STRINGS[activeLanguage.code] ?? UI_STRINGS["en-us"];

  return (
    <LanguageContext.Provider value={{ activeLanguage, setActiveLanguage, t, responseMode, setResponseMode }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ── Language Card ─────────────────────────────────────────────────────────────
function LangCard({ lang, isSelected, onSelect, isDark }) {
  const [hovered, setHovered] = useState(false);

  const bg = isSelected
    ? (isDark ? "#FFFFFF" : "rgba(255,255,255,0.95)")
    : hovered
      ? (isDark ? "#FFFFFF" : "rgba(255,255,255,0.85)")
      : (isDark ? "#252525" : "rgba(255,255,255,0.60)");

  // Always 2px border — only color changes, so card size never shifts
  const borderColor = isSelected
    ? (isDark ? "#000000" : "rgba(0,0,0,0.75)")
    : hovered
      ? (isDark ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.55)")
      : (isDark ? "transparent" : "transparent");

  const titleColor = (isDark && !isSelected && !hovered) ? "#FFFFFF" : "rgba(0,0,0,0.82)";
  const subColor   = (isDark && !isSelected && !hovered) ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.45)";
  const abbrColor  = (isSelected || hovered)
    ? (isDark ? "#000000" : "#000000")
    : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.30)");

  return (
    <button
      onClick={() => onSelect(lang)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "11px 14px", borderRadius: 12,
        border: `2px solid ${borderColor}`,
        background: bg,
        cursor: "pointer", textAlign: "left",
        transition: "background 0.18s ease, border-color 0.18s ease",
        position: "relative",
        boxShadow: "none",
      }}
    >
      {/* Country abbr */}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
        color: abbrColor, flexShrink: 0, minWidth: 22,
        fontFamily: "'Inter', sans-serif",
      }}>
        {lang.abbr}
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 600,
          color: titleColor, fontFamily: "'Inter', sans-serif",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.15s",
        }}>
          {lang.label}
        </p>
        <p style={{
          margin: "2px 0 0", fontSize: 11,
          color: subColor, fontFamily: "'Inter', sans-serif",
          transition: "color 0.15s",
        }}>
          {lang.native}
        </p>
      </div>

      {/* Check */}
      {isSelected && (
        <div style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
          background: isDark ? "#1A1A1A" : "#1A1A1A",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.20)",
        }}>
          <Check style={{ width: 11, height: 11, color: "#FFFFFF" }} strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
const LanguageSettings = ({ isOpen, onClose }) => {
  const { activeLanguage, setActiveLanguage, responseMode, setResponseMode } = useLanguage();
  const { isDark } = useTheme();
  const [pendingLanguage, setPendingLanguage] = useState(activeLanguage);
  const [pendingMode, setPendingMode] = useState(responseMode);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) { setPendingLanguage(activeLanguage); setPendingMode(responseMode); setSaved(false); }
  }, [isOpen, activeLanguage, responseMode]);

  const handleSave = () => {
    setActiveLanguage(pendingLanguage);
    setResponseMode(pendingMode);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1400);
  };

  // ── Light/dark tokens ────────────────────────────────────────────────────
  const modalBg      = isDark ? "#1C1C1C" : "rgba(255,255,255,0.92)";
  const modalBorder  = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.95)";
  const modalShadow  = isDark ? "0 32px 80px rgba(0,0,0,0.85)" : "0 24px 64px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)";
  const headerBorder = isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)";
  const titleColor   = isDark ? "#FFFFFF" : "rgba(0,0,0,0.82)";
  const labelColor   = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.38)";
  const sectionBg    = isDark ? "#242424" : "rgba(255,255,255,0.60)";
  const sectionBorder = isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)";
  const sectionTitle = isDark ? "#FFFFFF" : "rgba(0,0,0,0.78)";
  const sectionSub   = isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";
  const optActiveBg  = isDark ? "#2E2E2E" : "rgba(255,255,255,0.85)";
  const optActiveBorder = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)";
  const optHoverBg   = isDark ? "#242424" : "rgba(255,255,255,0.60)";
  const radioActive  = isDark ? "#FFFFFF" : "#1A1A1A";
  const radioInactive = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)";
  const optText      = isDark ? "#FFFFFF" : "rgba(0,0,0,0.78)";
  const optSub       = isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";
  const iconBg       = isDark ? "#282828" : "rgba(255,255,255,0.75)";
  const iconBorder   = isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)";
  const closeBg      = isDark ? "#282828" : "rgba(0,0,0,0.06)";
  const closeBorder  = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const cancelBg     = isDark ? "#282828" : "rgba(0,0,0,0.06)";
  const cancelText   = isDark ? "#FFFFFF" : "rgba(0,0,0,0.70)";
  const cancelHover  = isDark ? "#333333" : "rgba(0,0,0,0.10)";
  const saveBg       = isDark ? "#FFFFFF" : "#1A1A1A";
  const saveText     = isDark ? "#1A1A1A" : "#FFFFFF";
  const saveHover    = isDark ? "rgba(255,255,255,0.88)" : "#333333";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="lang-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: isDark ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0.25)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal wrapper */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 51,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, pointerEvents: "none",
          }}>
            <motion.div
              key="lang-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 480, pointerEvents: "auto",
                borderRadius: 20, overflow: "hidden",
                background: modalBg,
                backdropFilter: isDark ? "none" : "blur(48px)",
                WebkitBackdropFilter: isDark ? "none" : "blur(48px)",
                border: modalBorder,
                boxShadow: modalShadow,
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}
            >
              {/* ── Header ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px 14px",
                borderBottom: headerBorder,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: iconBg, border: iconBorder,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Globe style={{ width: 16, height: 16, color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.60)" }} />
                  </div>
                  <h2 style={{
                    margin: 0, fontSize: 16, fontWeight: 700,
                    color: titleColor, letterSpacing: "-0.015em",
                  }}>
                    Language Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                    background: closeBg, border: `1px solid ${closeBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.20)" : "rgba(239,68,68,0.10)"}
                  onMouseLeave={e => e.currentTarget.style.background = closeBg}
                >
                  <X style={{ width: 14, height: 14, color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.55)" }} />
                </button>
              </div>

              {/* ── Body ── */}
              <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Language label */}
                <p style={{
                  margin: 0, fontSize: 10, fontWeight: 700,
                  color: labelColor, textTransform: "uppercase", letterSpacing: "0.12em",
                }}>
                  Choose your preferred language
                </p>

                {/* Language grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {LANGUAGES.map((lang) => (
                    <LangCard
                      key={lang.code}
                      lang={lang}
                      isSelected={pendingLanguage.code === lang.code}
                      onSelect={setPendingLanguage}
                      isDark={isDark}
                    />
                  ))}
                </div>

                {/* Response mode section */}
                <div style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: sectionBg, border: sectionBorder,
                }}>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: sectionTitle }}>
                    AI Response Language
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: 11.5, color: sectionSub }}>
                    How should the AI decide which language to respond in?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                      { value: "alwaysAsk", label: "Always ask me",             desc: "AI will ask you before every response" },
                      { value: "sameAs",    label: "Same as interface language", desc: `AI will always respond in ${pendingLanguage.label}` },
                    ].map((opt) => {
                      const isActive = pendingMode === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setPendingMode(opt.value)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "9px 11px", borderRadius: 9,
                            border: "none", cursor: "pointer", textAlign: "left",
                            background: isActive ? optActiveBg : "transparent",
                            outline: `1px solid ${isActive ? optActiveBorder : "transparent"}`,
                            transition: "background 0.14s",
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = optHoverBg; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          {/* Radio circle */}
                          <div style={{
                            marginTop: 2, width: 15, height: 15, borderRadius: "50%",
                            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            border: `2px solid ${isActive ? radioActive : radioInactive}`,
                            transition: "border-color 0.14s",
                          }}>
                            {isActive && (
                              <div style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: radioActive,
                              }} />
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: optText }}>
                              {opt.label}
                            </p>
                            <p style={{ margin: "1px 0 0", fontSize: 11, color: optSub }}>
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "4px 22px 20px",
              }}>
                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#22C55E" }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                      Language updated!
                    </motion.div>
                  )}
                  {!saved && <div />}
                </AnimatePresence>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: cancelBg, fontSize: 13, fontWeight: 500, color: cancelText,
                      fontFamily: "'Inter', sans-serif", transition: "background 0.14s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = cancelHover}
                    onMouseLeave={e => e.currentTarget.style.background = cancelBg}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: saveBg, fontSize: 13, fontWeight: 600, color: saveText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: isDark ? "none" : "0 4px 14px rgba(0,0,0,0.18)",
                      transition: "background 0.14s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = saveHover}
                    onMouseLeave={e => e.currentTarget.style.background = saveBg}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LanguageSettings;