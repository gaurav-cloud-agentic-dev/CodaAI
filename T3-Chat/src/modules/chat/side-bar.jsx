"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, MessageSquare, FolderOpen, MoreVertical,
  Star, Edit3, Trash2, Settings, Globe, HelpCircle, Zap,
  LogOut, X, ChevronLeft, ChevronRight, Sparkles, History,
  Pin, PinOff, Share2,
} from "lucide-react";
import { useConversations, useTogglePin, useDeleteConversation } from "./hooks/chat";
import { useChatStore } from "./store/chat-store";
import { format } from "date-fns";
import LanguageSettings, { useLanguage } from "./LanguageSettings";

const ease = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.2 };

// ── ChatItem — defined OUTSIDE SideBar to prevent remount flicker ─────────────
const ChatItem = ({
  chat, index, activeChatId, hoveredChat, openChatMenu,
  setHoveredChat, setOpenChatMenu, setMenuPos, handleChatClick, formatChatTime,
}) => {
  const isActive   = activeChatId === chat.id;
  const isMenuOpen = openChatMenu === chat.id;
  const isHovered  = hoveredChat === chat.id;
  const showDots   = isHovered && !isMenuOpen;
  const itemRef    = useRef(null);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) {
      const MENU_WIDTH = 176, MENU_HEIGHT = 280, GAP = 8;
      const vh = window.innerHeight, vw = window.innerWidth;
      let left = rect.right + GAP;
      if (left + MENU_WIDTH > vw) left = rect.left - MENU_WIDTH - GAP;
      let top = rect.top;
      if (top + MENU_HEIGHT > vh) top = vh - MENU_HEIGHT - GAP;
      if (top < GAP) top = GAP;
      setMenuPos({ top, left });
    }
    setOpenChatMenu(chat.id);
  };

  return (
    <div
      ref={itemRef}
      style={{ position: "relative", marginBottom: 2 }}
      onMouseEnter={() => setHoveredChat(chat.id)}
      onMouseLeave={() => !isMenuOpen && setHoveredChat(null)}
    >
      <button
        onClick={() => handleChatClick(chat.id)}
        style={{
          width: "100%", textAlign: "left",
          padding: "8px 12px", borderRadius: 12, cursor: "pointer",
          background: isActive
            ? "rgba(255,255,255,0.78)"
            : isHovered ? "rgba(255,255,255,0.52)" : "transparent",
          backdropFilter: isActive || isHovered ? "blur(12px)" : "none",
          WebkitBackdropFilter: isActive || isHovered ? "blur(12px)" : "none",
          boxShadow: isActive
            ? "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)"
            : isHovered ? "0 1px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)" : "none",
          border: isActive
            ? "1px solid rgba(255,255,255,0.88)"
            : isHovered ? "1px solid rgba(255,255,255,0.60)" : "1px solid transparent",
          transition: "all 0.15s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {chat.isPinned && (
            <Pin style={{ width: 10, height: 10, color: "rgba(0,0,0,0.45)", flexShrink: 0, marginTop: 3 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 12, fontWeight: isActive ? 600 : 500,
              color: isActive ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.72)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              paddingRight: 28, fontFamily: "'Inter', sans-serif",
              transition: "color 0.15s",
            }}>
              {chat.title}
            </p>
            <p style={{
              margin: "3px 0 0", fontSize: 10,
              color: isActive ? "rgba(0,0,0,0.50)" : "rgba(0,0,0,0.38)",
              fontFamily: "'Inter', sans-serif", transition: "color 0.15s",
            }}>
              {formatChatTime(chat.lastMessageAt || chat.createdAt)}
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {showDots && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
            onClick={handleDotsClick}
            style={{
              position: "absolute", right: 8, top: 8,
              padding: 5, borderRadius: 8, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.88)"}
          >
            <MoreVertical style={{ width: 13, height: 13, color: "rgba(0,0,0,0.55)" }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── ChatGroup — defined OUTSIDE SideBar ───────────────────────────────────────
const ChatGroup = ({
  title, chats, icon: Icon,
  activeChatId, hoveredChat, openChatMenu,
  setHoveredChat, setOpenChatMenu, setMenuPos,
  handleChatClick, formatChatTime,
}) => {
  if (chats.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 8px", marginBottom: 6 }}>
        {Icon && <Icon style={{ width: 11, height: 11, color: "rgba(0,0,0,0.35)" }} strokeWidth={2.5} />}
        <h2 style={{
          margin: 0, fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.35)",
          textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Inter', sans-serif",
        }}>
          {title}
        </h2>
        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.28)", fontFamily: "'Inter', sans-serif" }}>
          ({chats.length})
        </span>
      </div>
      <div>
        {chats.map((chat, i) => (
          <ChatItem
            key={chat.id} chat={chat} index={i}
            activeChatId={activeChatId} hoveredChat={hoveredChat} openChatMenu={openChatMenu}
            setHoveredChat={setHoveredChat} setOpenChatMenu={setOpenChatMenu} setMenuPos={setMenuPos}
            handleChatClick={handleChatClick} formatChatTime={formatChatTime}
          />
        ))}
      </div>
    </div>
  );
};

// ── SideBar ───────────────────────────────────────────────────────────────────
const SideBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [openChatMenu, setOpenChatMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [deleteConfirmChat, setDeleteConfirmChat] = useState(null);
  const [shareModalChat, setShareModalChat] = useState(null);

  const { data: conversations = [], isLoading } = useConversations();
  const togglePinMutation = useTogglePin();
  const deleteConversationMutation = useDeleteConversation();
  const { activeChatId, setActiveChatId, clearActiveChatId } = useChatStore();
  const { t } = useLanguage();

  const { pinnedChats, unpinnedChats } = useMemo(() => {
    const filtered = searchQuery
      ? conversations.filter((conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : conversations;
    return {
      pinnedChats: filtered.filter((chat) => chat.isPinned),
      unpinnedChats: filtered.filter((chat) => !chat.isPinned),
    };
  }, [conversations, searchQuery]);

  const menuItems = [
    { id: "new",    icon: Plus,   label: t.newChat, action: () => { clearActiveChatId(); router.push("/"); } },
    { id: "search", icon: Search, label: t.search,  action: () => setIsSearchOpen(true) },
  ];

  const formatChatTime = useCallback((date) => {
    if (!date) return "";
    const chatDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - chatDate) / (1000 * 60 * 60);
    if (diffInHours < 1) return `${Math.floor((now - chatDate) / (1000 * 60))}m ago`;
    else if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    else if (diffInHours < 48) return "1d ago";
    else if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    else return format(chatDate, "MMM d");
  }, []);

  const handleChatClick = useCallback((chatId) => {
    setActiveChatId(chatId);
    setOpenChatMenu(null);
    router.push(`/chat/${chatId}`);
  }, [setActiveChatId, router]);

  const handleTogglePin = async (e, chatId) => {
    e.stopPropagation();
    await togglePinMutation.mutateAsync(chatId);
    setOpenChatMenu(null);
  };

  const handleShare = (e, chat) => {
    e.stopPropagation();
    setShareModalChat(chat);
    setOpenChatMenu(null);
  };

  const handleDeleteChat = (e, chat) => {
    e.stopPropagation();
    setDeleteConfirmChat(chat);
    setOpenChatMenu(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmChat) return;
    const chatId = deleteConfirmChat.id;
    setDeleteConfirmChat(null);
    await deleteConversationMutation.mutateAsync(chatId);
    clearActiveChatId();
    router.push("/");
  };

  const backdropStyle = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.28)",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    zIndex: 50,
  };

  const glassModalStyle = {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(255,255,255,0.95)",
    borderRadius: 20,
    boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
    fontFamily: "'Inter', sans-serif",
  };

  const chatGroupProps = {
    activeChatId, hoveredChat, openChatMenu,
    setHoveredChat, setOpenChatMenu, setMenuPos,
    handleChatClick, formatChatTime,
  };

  return (
    <>
      {/* ── Sidebar Shell ─────────────────────────────────────────────────── */}
      <motion.div
        animate={{ width: isOpen ? 280 : 68 }}
        transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
        style={{
          height: "100vh",
          minWidth: isOpen ? 280 : 68,
          maxWidth: isOpen ? 280 : 68,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          contain: "layout paint",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Layer A */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "#E4E4E8" }} />

        {/* Layer B — blobs */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-30%", left: "-30%", width: "80%", height: "80%", borderRadius: "50%", background: "rgba(199,210,254,0.20)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-20%", width: "70%", height: "70%", borderRadius: "50%", background: "rgba(221,214,254,0.16)", filter: "blur(90px)" }} />
        </div>

        {/* Layer C — frost */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(246,246,250,0.72)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }} />

        {/* Right border */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "rgba(0,0,0,0.10)", zIndex: 3 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>

          {/* Logo */}
          <div style={{
            padding: isOpen ? "20px 20px 16px" : "20px 0 16px",
            display: "flex", alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}>
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.h1
                  key="logo-text"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={ease}
                  style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "rgba(0,0,0,0.88)", letterSpacing: "-0.02em" }}
                >
                  CodaAI
                </motion.h1>
              ) : (
                <motion.div
                  key="logo-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={ease}
                >
                  <Sparkles style={{ width: 20, height: 20, color: "rgba(0,0,0,0.55)" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Items */}
          <div style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...ease, delay: index * 0.05 }}
                style={{
                  width: "100%", border: "none", cursor: "pointer", position: "relative",
                  display: "flex", alignItems: "center",
                  justifyContent: isOpen ? "flex-start" : "center",
                  gap: isOpen ? 10 : 0,
                  padding: isOpen ? "10px 14px" : "10px 0",
                  borderRadius: 12,
                  background: hoveredItem === item.id ? "rgba(255,255,255,0.68)" : "transparent",
                  boxShadow: hoveredItem === item.id
                    ? "0 1px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)"
                    : "none",
                  outline: hoveredItem === item.id ? "1px solid rgba(255,255,255,0.72)" : "1px solid transparent",
                  transition: "background 0.14s, box-shadow 0.14s",
                }}
              >
                <item.icon style={{ width: 16, height: 16, color: "rgba(0,0,0,0.68)", flexShrink: 0 }} strokeWidth={2} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={ease}
                      style={{
                        fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.78)",
                        overflow: "hidden", whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isOpen && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      position: "fixed", left: 78,
                      padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap",
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.95)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.78)", zIndex: 100,
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 12px 12px", flexShrink: 0 }} />

          {/* Chat List */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  flex: 1, overflowY: "auto", overflowX: "hidden",
                  padding: "0 8px 12px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.12) transparent",
                }}
              >
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 20, height: 20,
                        border: "2px solid rgba(0,0,0,0.08)",
                        borderTopColor: "rgba(0,0,0,0.45)",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : conversations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={ease}
                    style={{ textAlign: "center", padding: "40px 16px" }}
                  >
                    <MessageSquare style={{ width: 28, height: 28, color: "rgba(0,0,0,0.22)", margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.38)", fontFamily: "'Inter', sans-serif" }}>
                      {t.noChatsYet}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {pinnedChats.length > 0 && (
                      <ChatGroup title={t.pinned} chats={pinnedChats} icon={Pin} {...chatGroupProps} />
                    )}
                    <ChatGroup title={t.recent} chats={unpinnedChats} icon={History} {...chatGroupProps} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed chat avatars */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", paddingTop: 8, gap: 8,
                  overflowY: "auto", scrollbarWidth: "none",
                }}
              >
                {conversations.slice(0, 5).map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...ease, delay: index * 0.04 }}
                    onClick={() => handleChatClick(chat.id)}
                    style={{
                      width: 38, height: 38, borderRadius: 12, border: "none", cursor: "pointer",
                      background: activeChatId === chat.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      boxShadow: activeChatId === chat.id
                        ? "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)"
                        : "inset 0 1px 0 rgba(255,255,255,0.8)",
                      outline: "1px solid rgba(255,255,255,0.82)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.65)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.82)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = activeChatId === chat.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)";
                      e.currentTarget.style.boxShadow = activeChatId === chat.id
                        ? "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)"
                        : "inset 0 1px 0 rgba(255,255,255,0.8)";
                    }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile */}
          <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                width: "100%", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: isOpen ? "flex-start" : "center",
                gap: isOpen ? 10 : 0,
                padding: isOpen ? "8px 10px" : "8px 0",
                borderRadius: 12,
                background: isUserMenuOpen ? "rgba(255,255,255,0.68)" : "transparent",
                outline: isUserMenuOpen ? "1px solid rgba(255,255,255,0.72)" : "1px solid transparent",
                transition: "background 0.14s",
              }}
              onMouseEnter={e => { if (!isUserMenuOpen) e.currentTarget.style.background = "rgba(255,255,255,0.50)"; }}
              onMouseLeave={e => { if (!isUserMenuOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.65)",
              }}>
                GS
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={ease}
                    style={{ flex: 1, textAlign: "left", minWidth: 0, overflow: "hidden" }}
                  >
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.82)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Gaurav Salunke
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: "rgba(0,0,0,0.45)" }}>
                      {t.freePlan}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Toggle Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ left: isOpen ? 268 : 56 }}
        transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: "fixed", top: 20,
          width: 24, height: 24, borderRadius: "50%",
          border: "none", cursor: "pointer",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 30,
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="left"
              initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}
            >
              <ChevronLeft style={{ width: 13, height: 13, color: "rgba(0,0,0,0.6)" }} />
            </motion.div>
          ) : (
            <motion.div key="right"
              initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}
            >
              <ChevronRight style={{ width: 13, height: 13, color: "rgba(0,0,0,0.6)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Context Menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {openChatMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpenChatMenu(null); setHoveredChat(null); }}
              style={{ position: "fixed", inset: 0, zIndex: 40 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -4 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed", zIndex: 50,
                top: menuPos.top, left: menuPos.left,
                width: 176, padding: "6px 0",
                ...glassModalStyle, borderRadius: 14,
              }}
            >
              {[
                {
                  onClick: (e) => handleTogglePin(e, conversations.find((c) => c.id === openChatMenu)?.id),
                  icon: conversations.find((c) => c.id === openChatMenu)?.isPinned ? PinOff : Pin,
                  label: conversations.find((c) => c.id === openChatMenu)?.isPinned ? t.unpin : t.pin,
                },
                {
                  onClick: (e) => { const chat = conversations.find((c) => c.id === openChatMenu); if (chat) handleShare(e, chat); },
                  icon: Share2, label: t.share,
                },
                { onClick: null, icon: Star,      label: t.star },
                { onClick: null, icon: Edit3,      label: t.rename },
                { onClick: null, icon: FolderOpen, label: t.addToProject },
              ].map(({ onClick, icon: Icon, label }) => (
                <button key={label} onClick={onClick}
                  style={{
                    width: "100%", padding: "8px 14px", border: "none", cursor: "pointer",
                    background: "transparent", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.72)",
                    fontFamily: "'Inter', sans-serif", transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Icon style={{ width: 13, height: 13 }} /><span>{label}</span>
                </button>
              ))}
              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "4px 0" }} />
              <button
                onClick={(e) => { const chat = conversations.find((c) => c.id === openChatMenu); if (chat) handleDeleteChat(e, chat); }}
                style={{
                  width: "100%", padding: "8px 14px", border: "none", cursor: "pointer",
                  background: "transparent", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 500, color: "#EF4444",
                  fontFamily: "'Inter', sans-serif", transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Trash2 style={{ width: 13, height: 13 }} /><span>{t.delete}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Search Modal — centered with wrapper div ───────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              style={backdropStyle}
            />
            {/* Centering wrapper — avoids Framer Motion transform conflict */}
            <div style={{
              position: "fixed", top: 80, left: 0, right: 0,
              display: "flex", justifyContent: "center",
              padding: "0 16px", zIndex: 51, pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={ease}
                style={{
                  width: "100%", maxWidth: 560,
                  pointerEvents: "auto",
                  ...glassModalStyle,
                }}
              >
                {/* Search input row */}
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <Search style={{ width: 16, height: 16, color: "rgba(0,0,0,0.45)", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchChats}
                    autoFocus
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      fontSize: 14, color: "rgba(0,0,0,0.78)", fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: 4,
                      transition: "opacity 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <X style={{ width: 16, height: 16, color: "rgba(0,0,0,0.45)" }} />
                  </button>
                </div>

                {/* Results */}
                <div style={{
                  padding: 8, maxHeight: 360, overflowY: "auto",
                  scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.1) transparent",
                }}>
                  {[...pinnedChats, ...unpinnedChats].length > 0
                    ? [...pinnedChats, ...unpinnedChats].map((chat, i) => (
                        <motion.button
                          key={chat.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...ease, delay: i * 0.03 }}
                          onClick={() => { handleChatClick(chat.id); setIsSearchOpen(false); setSearchQuery(""); }}
                          style={{
                            width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 12,
                            border: "none", cursor: "pointer", background: "transparent",
                            display: "flex", alignItems: "center", gap: 10, transition: "background 0.1s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <MessageSquare style={{ width: 15, height: 15, color: "rgba(0,0,0,0.45)", flexShrink: 0 }} />
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.78)", fontFamily: "'Inter', sans-serif" }}>
                              {chat.title}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(0,0,0,0.45)", fontFamily: "'Inter', sans-serif" }}>
                              {formatChatTime(chat.lastMessageAt || chat.createdAt)}
                            </p>
                          </div>
                        </motion.button>
                      ))
                    : (
                      <div style={{
                        textAlign: "center", padding: "32px 0",
                        fontSize: 13, color: "rgba(0,0,0,0.45)", fontFamily: "'Inter', sans-serif",
                      }}>
                        {t.noChatsFound}
                      </div>
                    )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmChat && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmChat(null)} style={backdropStyle} />
            <div style={{
              position: "fixed", inset: 0, zIndex: 51,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16, pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={ease}
                style={{ width: "100%", maxWidth: 400, padding: 28, pointerEvents: "auto", ...glassModalStyle }}
              >
                <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "rgba(0,0,0,0.82)" }}>{t.deleteChat}</h3>
                <p style={{ margin: "0 0 24px", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.6 }}>
                  {t.deleteChatConfirm} "{deleteConfirmChat.title}"? {t.deleteCannotUndo}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setDeleteConfirmChat(null)}
                    style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.72)", transition: "background 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.90)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                  >
                    {t.cancel}
                  </button>
                  <button onClick={confirmDelete} disabled={deleteConversationMutation.isPending}
                    style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", background: "#EF4444", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", opacity: deleteConversationMutation.isPending ? 0.5 : 1, transition: "background 0.14s" }}
                    onMouseEnter={e => { if (!deleteConversationMutation.isPending) e.currentTarget.style.background = "#DC2626"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "#EF4444"}
                  >
                    {deleteConversationMutation.isPending ? t.deleting : t.delete}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Share Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {shareModalChat && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShareModalChat(null)} style={backdropStyle} />
            <div style={{
              position: "fixed", inset: 0, zIndex: 51,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16, pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={ease}
                style={{ width: "100%", maxWidth: 420, padding: 28, pointerEvents: "auto", ...glassModalStyle }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(59,158,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Share2 style={{ width: 16, height: 16, color: "#3B9EFF" }} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "rgba(0,0,0,0.82)" }}>{t.shareConversation}</h3>
                </div>
                <p style={{ margin: "0 0 24px", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.6 }}>{t.shareDesc}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShareModalChat(null)}
                    style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.72)", transition: "background 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.90)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={async () => {
                      const { shareConversation } = await import("./actions/share");
                      const result = await shareConversation(shareModalChat.id);
                      if (result.success) {
                        await navigator.clipboard.writeText(result.shareUrl);
                        const { toast } = await import("sonner");
                        toast.success("Link copied to clipboard!");
                        setShareModalChat(null);
                      } else {
                        const { toast } = await import("sonner");
                        toast.error(result.error || "Failed to create share link");
                      }
                    }}
                    style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", boxShadow: "0 4px 14px rgba(59,158,255,0.4)", transition: "box-shadow 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,158,255,0.52)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,158,255,0.4)"}
                  >
                    {t.copyShareLink}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Create Project Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)} style={backdropStyle} />
            <div style={{
              position: "fixed", inset: 0, zIndex: 51,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16, pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={ease}
                style={{ width: "100%", maxWidth: 520, padding: 32, pointerEvents: "auto", ...glassModalStyle }}
              >
                <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700, color: "rgba(0,0,0,0.82)", textAlign: "center" }}>{t.createProject}</h2>
                <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid rgba(255,255,255,0.82)" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.72)" }}>{t.howToUseProjects}</h3>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.65 }}>{t.projectDesc1}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.65 }}>{t.projectDesc2}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.68)", marginBottom: 6 }}>{t.whatAreYouWorkingOn}</label>
                    <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder={t.nameYourProject}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, boxSizing: "border-box", border: "1px solid rgba(0,0,0,0.1)", outline: "none", background: "rgba(255,255,255,0.72)", fontSize: 13, color: "rgba(0,0,0,0.78)", fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.68)", marginBottom: 6 }}>{t.whatAreYouTryingToAchieve}</label>
                    <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder={t.describeYourProject} rows={4}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, boxSizing: "border-box", border: "1px solid rgba(0,0,0,0.1)", outline: "none", resize: "none", background: "rgba(255,255,255,0.72)", fontSize: 13, color: "rgba(0,0,0,0.78)", fontFamily: "'Inter', sans-serif" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setIsProjectModalOpen(false)}
                    style={{ padding: "9px 20px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.72)", transition: "background 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.90)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                  >
                    {t.cancel}
                  </button>
                  <button onClick={() => { console.log("Create project:", { projectName, projectDescription }); setIsProjectModalOpen(false); }}
                    style={{ padding: "9px 20px", borderRadius: 10, cursor: "pointer", background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)", border: "none", fontSize: 13, fontWeight: 600, color: "#fff", boxShadow: "0 4px 14px rgba(59,158,255,0.4)", transition: "box-shadow 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,158,255,0.52)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,158,255,0.4)"}
                  >
                    {t.createProjectBtn}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── User Menu Popup ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={ease}
              style={{ position: "fixed", bottom: 80, left: 12, width: 260, zIndex: 50, padding: "6px 0", ...glassModalStyle }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.55)", fontFamily: "'Inter', sans-serif" }}>
                  gauravawscloud14@gmail.com
                </p>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { icon: Settings,   label: t.settings,    shortcut: "⌘+Ctrl+,", onClick: null },
                  { icon: Globe,      label: t.language,    shortcut: null,        onClick: () => { setIsLanguageOpen(true); setIsUserMenuOpen(false); } },
                  { icon: HelpCircle, label: t.getHelp,     shortcut: null,        onClick: null },
                  { icon: Zap,        label: t.upgradePlan, shortcut: null,        onClick: null },
                  { icon: LogOut,     label: t.logout,      shortcut: null,        onClick: null },
                ].map((item, index) => (
                  <motion.button key={item.label}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...ease, delay: index * 0.03 }}
                    onClick={item.onClick ?? undefined}
                    style={{ width: "100%", padding: "9px 16px", border: "none", cursor: "pointer", background: "transparent", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.72)", fontFamily: "'Inter', sans-serif", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <item.icon style={{ width: 15, height: 15, color: "rgba(0,0,0,0.55)" }} />
                    <span>{item.label}</span>
                    {item.shortcut && <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(0,0,0,0.35)" }}>{item.shortcut}</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Language Settings Modal ───────────────────────────────────────── */}
      <LanguageSettings isOpen={isLanguageOpen} onClose={() => setIsLanguageOpen(false)} />

      <style>{`
        @keyframes sb-spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 99px; }
      `}</style>
    </>
  );
};

export default SideBar;