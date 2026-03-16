"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, createContext, useContext } from "react";
import { Globe, X, Check } from "lucide-react";

export const LANGUAGES = [
  { code: "en-us", label: "English (American)", flag: "🇺🇸", native: "English" },
  { code: "en-uk", label: "English (UK)",        flag: "🇬🇧", native: "English" },
  { code: "hi",    label: "Hindi",               flag: "🇮🇳", native: "हिन्दी"  },
  { code: "bn",    label: "Bengali",             flag: "🇧🇩", native: "বাংলা"   },
  { code: "mr",    label: "Marathi",             flag: "🇮🇳", native: "मराठी"   },
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
    projectDesc1: "Projects help organize your work and leverage knowledge across multiple conversations. Upload docs, code, and files to create themed collections that Claude can reference again and again.",
    projectDesc2: "Start by creating a memorable title and description to organize your project. You can always edit it later.",
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
    selectModel: "मॉडेल चुनें", disclaimer: "CodaAI गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करें।",
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
    createProjectBtn: "प्रोजेक्ट बनाएं", noChatsYet: "अभी तक कोई चैट नहीं। नई बातचीत शुरू करें!",
    noChatsFound: "कोई चैट नहीं मिली", searchChats: "चैट खोजें...",
  },
  bn: {
    greeting: "শুভ বিকাল", subtitle: "আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    newChat: "নতুন চ্যাট", search: "খুঁজুন", chats: "চ্যাটস", projects: "প্রজেক্টস",
    recent: "সাম্প্রতিক", settings: "সেটিংস", language: "ভাষা",
    getHelp: "সাহায্য নিন", upgradePlan: "আপগ্রেড করুন", logout: "লগ আউট",
    freePlan: "ফ্রি প্ল্যান", upgrade: "আপগ্রেড", placeholder: "আপনার বার্তা টাইপ করুন...",
    selectModel: "মডেল নির্বাচন করুন", disclaimer: "CodaAI ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।",
    pinned: "পিন করা", pin: "পিন করুন", unpin: "আনপিন করুন", share: "শেয়ার করুন",
    star: "স্টার করুন", rename: "নাম পরিবর্তন করুন", addToProject: "প্রজেক্টে যোগ করুন",
    delete: "মুছুন", deleteChat: "চ্যাট মুছবেন?", deleteChatConfirm: "আপনি কি সত্যিই মুছতে চান",
    deleteCannotUndo: "এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না।", cancel: "বাতিল করুন", deleting: "মুছে ফেলা হচ্ছে...",
    shareConversation: "কথোপকথন শেয়ার করুন", shareDesc: "লিংক সহ যে কেউ এই কথোপকথন দেখতে পারবে।",
    copyShareLink: "শেয়ার লিংক কপি করুন", createProject: "একটি ব্যক্তিগত প্রজেক্ট তৈরি করুন",
    howToUseProjects: "প্রজেক্ট কীভাবে ব্যবহার করবেন",
    projectDesc1: "প্রজেক্ট আপনার কাজ সংগঠিত করতে সাহায্য করে।",
    projectDesc2: "একটি স্মরণীয় শিরোনাম এবং বিবরণ তৈরি করে শুরু করুন।",
    whatAreYouWorkingOn: "আপনি কিসে কাজ করছেন?", nameYourProject: "আপনার প্রজেক্টের নাম দিন",
    whatAreYouTryingToAchieve: "আপনি কী অর্জন করতে চাইছেন?",
    describeYourProject: "আপনার প্রজেক্ট, লক্ষ্য, বিষয় ইত্যাদি বর্ণনা করুন...",
    createProjectBtn: "প্রজেক্ট তৈরি করুন", noChatsYet: "এখনো কোনো চ্যাট নেই। নতুন কথোপকথন শুরু করুন!",
    noChatsFound: "কোনো চ্যাট পাওয়া যায়নি", searchChats: "চ্যাট খুঁজুন...",
  },
  mr: {
    greeting: "शुभ दुपार", subtitle: "आज मी तुम्हाला कशी मदत करू शकतो?",
    newChat: "नवीन चॅट", search: "शोधा", chats: "चॅट्स", projects: "प्रोजेक्ट्स",
    recent: "अलीकडील", settings: "सेटिंग्ज", language: "भाषा",
    getHelp: "मदत मिळवा", upgradePlan: "अपग्रेड करा", logout: "लॉग आउट",
    freePlan: "मोफत प्लान", upgrade: "अपग्रेड", placeholder: "तुमचा संदेश लिहा...",
    selectModel: "मॉडेल निवडा", disclaimer: "CodaAI चुका करू शकतो. महत्त्वाची माहिती तपासा.",
    pinned: "पिन केलेले", pin: "पिन करा", unpin: "अनपिन करा", share: "शेअर करा",
    star: "स्टार करा", rename: "नाव बदला", addToProject: "प्रोजेक्टमध्ये जोडा",
    delete: "हटवा", deleteChat: "चॅट हटवायची?", deleteChatConfirm: "तुम्हाला खरोखर हटवायचे आहे का",
    deleteCannotUndo: "ही क्रिया पूर्ववत करता येणार नाही.", cancel: "रद्द करा", deleting: "हटवले जात आहे...",
    shareConversation: "संभाषण शेअर करा", shareDesc: "लिंक असलेला कोणीही हे संभाषण पाहू शकेल.",
    copyShareLink: "शेअर लिंक कॉपी करा", createProject: "एक वैयक्तिक प्रोजेक्ट तयार करा",
    howToUseProjects: "प्रोजेक्ट कसे वापरावे",
    projectDesc1: "प्रोजेक्ट तुमचे काम व्यवस्थित करण्यात मदत करतात.",
    projectDesc2: "एक संस्मरणीय शीर्षक आणि वर्णन तयार करून सुरुवात करा.",
    whatAreYouWorkingOn: "तुम्ही काय काम करत आहात?", nameYourProject: "तुमच्या प्रोजेक्टला नाव द्या",
    whatAreYouTryingToAchieve: "तुम्ही काय साध्य करण्याचा प्रयत्न करत आहात?",
    describeYourProject: "तुमच्या प्रोजेक्टचे, ध्येयांचे, विषयाचे वर्णन करा...",
    createProjectBtn: "प्रोजेक्ट तयार करा", noChatsYet: "अद्याप कोणतीही चॅट नाही. नवीन संभाषण सुरू करा!",
    noChatsFound: "कोणतीही चॅट सापडली नाही", searchChats: "चॅट शोधा...",
  },
};

// ── Context — logic unchanged ─────────────────────────────────────────────────
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

// ── LanguageSettings modal ────────────────────────────────────────────────────
const LanguageSettings = ({ isOpen, onClose }) => {
  const { activeLanguage, setActiveLanguage, responseMode, setResponseMode } = useLanguage();
  const [pendingLanguage, setPendingLanguage] = useState(activeLanguage);
  const [pendingMode, setPendingMode] = useState(responseMode);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPendingLanguage(activeLanguage);
      setPendingMode(responseMode);
      setSaved(false);
    }
  }, [isOpen, activeLanguage, responseMode]);

  const handleSave = () => {
    setActiveLanguage(pendingLanguage);
    setResponseMode(pendingMode);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1400);
  };

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
              background: "rgba(0,0,0,0.22)",
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* Centering wrapper */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 51,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, pointerEvents: "none",
          }}>
            {/* Animated modal */}
            <motion.div
              key="lang-modal"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 500,
                pointerEvents: "auto",
                borderRadius: 22, overflow: "hidden",
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(48px)", WebkitBackdropFilter: "blur(48px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}
            >
              {/* ── Header ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                background: "rgba(255,255,255,0.55)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(255,255,255,0.92)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Globe style={{ width: 17, height: 17, color: "rgba(0,0,0,0.55)" }} />
                  </div>
                  <h2 style={{
                    margin: 0, fontSize: 17, fontWeight: 700,
                    color: "rgba(0,0,0,0.82)", letterSpacing: "-0.01em",
                  }}>
                    Language Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: 9, cursor: "pointer",
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                >
                  <X style={{ width: 15, height: 15, color: "rgba(0,0,0,0.50)" }} />
                </button>
              </div>

              {/* ── Body ── */}
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Language section */}
                <div>
                  <p style={{
                    margin: "0 0 10px", fontSize: 10, fontWeight: 700,
                    color: "rgba(0,0,0,0.38)", textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}>
                    Choose your preferred language
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {LANGUAGES.map((lang) => {
                      const isSelected = pendingLanguage.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => setPendingLanguage(lang)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", borderRadius: 13,
                            border: "none", cursor: "pointer", textAlign: "left",
                            background: isSelected
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.55)",
                            outline: `1px solid ${isSelected ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.82)"}`,
                            boxShadow: isSelected
                              ? "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)"
                              : "inset 0 1px 0 rgba(255,255,255,0.8)",
                            transition: "background 0.14s, box-shadow 0.14s, outline-color 0.14s",
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = "rgba(255,255,255,0.80)";
                              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)";
                              e.currentTarget.style.outlineColor = "rgba(0,0,0,0.09)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.8)";
                              e.currentTarget.style.outlineColor = "rgba(255,255,255,0.82)";
                            }
                          }}
                        >
                          <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              margin: 0, fontSize: 13, fontWeight: 600,
                              color: "rgba(0,0,0,0.78)",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {lang.label}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(0,0,0,0.38)" }}>
                              {lang.native}
                            </p>
                          </div>
                          {isSelected && (
                            <div style={{
                              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                              background: "rgba(15,15,22,0.82)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                            }}>
                              <Check style={{ width: 10, height: 10, color: "#fff" }} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Response mode */}
                <div style={{
                  padding: "14px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.82)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                }}>
                  <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.72)" }}>
                    AI Response Language
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: 11.5, color: "rgba(0,0,0,0.38)" }}>
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
                            padding: "10px 12px", borderRadius: 10,
                            border: "none", cursor: "pointer", textAlign: "left",
                            background: isActive ? "rgba(255,255,255,0.80)" : "transparent",
                            outline: `1px solid ${isActive ? "rgba(0,0,0,0.09)" : "transparent"}`,
                            boxShadow: isActive ? "0 1px 6px rgba(0,0,0,0.05)" : "none",
                            transition: "background 0.14s, box-shadow 0.14s",
                          }}
                          onMouseEnter={e => {
                            if (!isActive) {
                              e.currentTarget.style.background = "rgba(255,255,255,0.65)";
                              e.currentTarget.style.outlineColor = "rgba(0,0,0,0.06)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isActive) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.outlineColor = "transparent";
                            }
                          }}
                        >
                          {/* Radio */}
                          <div style={{
                            marginTop: 2, width: 16, height: 16, borderRadius: "50%",
                            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            border: `2px solid ${isActive ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.20)"}`,
                            transition: "border-color 0.14s",
                          }}>
                            {isActive && (
                              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,0,0,0.65)" }} />
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.72)" }}>
                              {opt.label}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(0,0,0,0.38)" }}>
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
                padding: "0 24px 22px",
              }}>
                <AnimatePresence>
                  {saved ? (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#059669" }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                      Language updated!
                    </motion.div>
                  ) : <div />}
                </AnimatePresence>

                <div style={{ display: "flex", gap: 10 }}>
                  {/* Cancel */}
                  <button
                    onClick={onClose}
                    style={{
                      padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: "rgba(255,255,255,0.65)",
                      outline: "1px solid rgba(0,0,0,0.09)",
                      fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.65)",
                      fontFamily: "'Inter', sans-serif",
                      transition: "background 0.14s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.90)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                  >
                    Cancel
                  </button>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    style={{
                      padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: "rgba(15,15,22,0.85)",
                      fontSize: 13, fontWeight: 600, color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08)",
                      transition: "background 0.14s, box-shadow 0.14s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(15,15,22,0.92)";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(15,15,22,0.85)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08)";
                    }}
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