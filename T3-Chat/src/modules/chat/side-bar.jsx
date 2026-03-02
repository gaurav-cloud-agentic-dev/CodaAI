"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MessageSquare,
  FolderOpen,
  MoreVertical,
  Star,
  Edit3,
  Trash2,
  Settings,
  Globe,
  HelpCircle,
  Zap,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  History,
  Pin,
  PinOff,
  Share2,
} from "lucide-react";
import { useConversations, useTogglePin, useDeleteConversation } from "./hooks/chat";
import { useChatStore } from "./store/chat-store";
import { format } from "date-fns";

const SideBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [openChatMenu, setOpenChatMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [deleteConfirmChat, setDeleteConfirmChat] = useState(null);
  const [shareModalChat, setShareModalChat] = useState(null);

  // Hooks
  const { data: conversations = [], isLoading } = useConversations();
  const togglePinMutation = useTogglePin();
  const deleteConversationMutation = useDeleteConversation();
  const { activeChatId, setActiveChatId, clearActiveChatId } = useChatStore();

  // Filter and separate conversations
  const { pinnedChats, unpinnedChats } = useMemo(() => {
    const filtered = searchQuery
      ? conversations.filter((conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : conversations;

    return {
      pinnedChats: filtered.filter((chat) => chat.isPinned),
      unpinnedChats: filtered.filter((chat) => !chat.isPinned),
    };
  }, [conversations, searchQuery]);

  const menuItems = [
    {
      id: "new",
      icon: Plus,
      label: "New chat",
      action: () => {
        clearActiveChatId();
        router.push("/");
      },
    },
    {
      id: "search",
      icon: Search,
      label: "Search",
      action: () => setIsSearchOpen(true),
    },
    {
      id: "chats",
      icon: MessageSquare,
      label: "Chats",
      action: () => setIsChatsOpen(true),
    },
    {
      id: "projects",
      icon: FolderOpen,
      label: "Projects",
      action: () => setIsProjectModalOpen(true),
    },
  ];

  // Format chat time
  const formatChatTime = (date) => {
    if (!date) return "";
    const chatDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - chatDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - chatDate) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "1d ago";
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return format(chatDate, "MMM d");
    }
  };

  // Handle chat click
  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    setOpenChatMenu(null);
    router.push(`/chat/${chatId}`);
  };

  // Handle pin toggle
  const handleTogglePin = async (e, chatId) => {
    e.stopPropagation();
    await togglePinMutation.mutateAsync(chatId);
    setOpenChatMenu(null);
  };

  // Handle share
  const handleShare = (e, chat) => {
    e.stopPropagation();
    setShareModalChat(chat);
    setOpenChatMenu(null);
  };

  // Handle delete chat
  const handleDeleteChat = (e, chat) => {
    e.stopPropagation();
    setDeleteConfirmChat(chat);
    setOpenChatMenu(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmChat) {
      await deleteConversationMutation.mutateAsync(deleteConfirmChat.id);
      setDeleteConfirmChat(null);
    }
  };

  // Chat Item Component
  const ChatItem = ({ chat }) => {
    const isActive = activeChatId === chat.id;
    const isMenuOpen = openChatMenu === chat.id;
    const isHovered = hoveredChat === chat.id;
    const showDots = isHovered && !isMenuOpen;
    const itemRef = useRef(null);

    const handleDotsClick = (e) => {
      e.stopPropagation();
      const rect = itemRef.current?.getBoundingClientRect();
      if (rect) {
        const MENU_WIDTH = 176;
        const MENU_HEIGHT = 280;
        const GAP = 8;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let left = rect.right + GAP;
        if (left + MENU_WIDTH > viewportWidth) {
          left = rect.left - MENU_WIDTH - GAP;
        }

        let top = rect.top;
        if (top + MENU_HEIGHT > viewportHeight) {
          top = viewportHeight - MENU_HEIGHT - GAP;
        }
        if (top < GAP) top = GAP;

        setMenuPos({ top, left });
      }
      setOpenChatMenu(chat.id);
    };

    return (
      <div
        ref={itemRef}
        className="relative mb-1"
        onMouseEnter={() => setHoveredChat(chat.id)}
        onMouseLeave={() => !isMenuOpen && setHoveredChat(null)}
      >
        <button
          onClick={() => handleChatClick(chat.id)}
          className={`w-full text-left px-3 py-2 rounded-xl transition-colors duration-150 ${
            isActive
              ? "bg-amber-200/60 dark:bg-amber-800/60"
              : isHovered
              ? "bg-amber-100/40 dark:bg-amber-800/20"
              : ""
          }`}
        >
          <div className="flex items-start gap-2">
            {chat.isPinned && (
              <Pin className="w-3 h-3 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-amber-950 dark:text-amber-100 truncate pr-8">
                {chat.title}
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                {formatChatTime(chat.lastMessageAt || chat.createdAt)}
              </p>
            </div>
          </div>
        </button>

        {showDots && (
          <button
            onClick={handleDotsClick}
            className="absolute right-2 top-2 p-1.5 bg-amber-200/90 dark:bg-amber-800/90 rounded-lg hover:bg-amber-300 dark:hover:bg-amber-700 z-10 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5 text-amber-900 dark:text-amber-200" />
          </button>
        )}
      </div>
    );
  };

  // Chat Group Component
  const ChatGroup = ({ title, chats, icon: Icon }) => {
    if (chats.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-2 mb-2">
          {Icon && (
            <Icon
              className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400"
              strokeWidth={2.5}
            />
          )}
          <h2 className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {title}
          </h2>
          <span className="text-[10px] text-amber-600 dark:text-amber-500">
            ({chats.length})
          </span>
        </div>
        <div>
          {chats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ✅ FIX: Added flexShrink: 0 so sidebar never compresses when chat content is wide */}
      <div
        className="h-screen relative flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 border-r border-amber-200/60 dark:border-amber-800/60 transition-all duration-300"
        style={{
          width: isOpen ? "280px" : "70px",
          flexShrink: 0,
          boxShadow: "4px 0 24px -4px rgba(217, 119, 6, 0.12)",
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Background Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [-20, 20, -20],
            y: [-10, 10, -10],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-5 w-6 h-6 bg-amber-800 dark:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg z-20 hover:scale-110 transition-transform"
          >
            {isOpen ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Logo */}
          <div className="p-5 border-b border-amber-200/60 dark:border-amber-800/60">
            {isOpen ? (
              <h1 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                CodaAI
              </h1>
            ) : (
              <div className="flex justify-center">
                <Sparkles className="w-6 h-6 text-amber-800 dark:text-amber-400" />
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center ${
                  isOpen ? "gap-3 px-4" : "justify-center"
                } py-3 rounded-xl transition-all duration-150 relative ${
                  hoveredItem === item.id
                    ? "bg-amber-100/50 dark:bg-amber-800/30"
                    : ""
                }`}
              >
                <item.icon
                  className="w-4 h-4 text-amber-900 dark:text-amber-200"
                  strokeWidth={2.5}
                />
                {isOpen && (
                  <span className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                    {item.label}
                  </span>
                )}
                {!isOpen && hoveredItem === item.id && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-amber-800 dark:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Chat List */}
          {isOpen && (
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-8 h-8 text-amber-400 dark:text-amber-600 mx-auto mb-2" />
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    No chats yet. Start a new conversation!
                  </p>
                </div>
              ) : (
                <>
                  {pinnedChats.length > 0 && (
                    <ChatGroup
                      title="Pinned"
                      chats={pinnedChats}
                      icon={Pin}
                    />
                  )}
                  <ChatGroup
                    title="Recent"
                    chats={unpinnedChats}
                    icon={History}
                  />
                </>
              )}
            </div>
          )}

          {/* Closed State */}
          {!isOpen && (
            <div className="flex-1 flex flex-col items-center pt-4 gap-3 overflow-y-auto custom-scrollbar">
              {conversations.slice(0, 5).map((chat, index) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`w-10 h-10 ${
                    activeChatId === chat.id
                      ? "bg-amber-700 dark:bg-amber-600"
                      : "bg-amber-800 dark:bg-amber-700"
                  } rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-110 transition-transform`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* User Profile */}
          <div className="p-4 border-t border-amber-200/60 dark:border-amber-800/60">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-full flex items-center ${
                isOpen ? "gap-2 px-2" : "justify-center"
              } py-2.5 rounded-xl hover:bg-amber-200/30 dark:hover:bg-amber-800/30 transition-colors`}
            >
              <div className="w-8 h-8 bg-amber-800 dark:bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                GS
              </div>
              {isOpen && (
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-amber-950 dark:text-amber-100 truncate">
                    Gaurav Salunke
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">
                    Free plan
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {openChatMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOpenChatMenu(null);
                setHoveredChat(null);
              }}
              className="fixed inset-0 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -4 }}
              transition={{ duration: 0.15 }}
              className="fixed bg-white dark:bg-amber-900 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-700 py-2 w-44 z-50"
              style={{ top: menuPos.top, left: menuPos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) =>
                  handleTogglePin(
                    e,
                    conversations.find((c) => c.id === openChatMenu)?.id
                  )
                }
                className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
              >
                {conversations.find((c) => c.id === openChatMenu)?.isPinned ? (
                  <>
                    <PinOff className="w-3.5 h-3.5" />
                    <span>Unpin</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3.5 h-3.5" />
                    <span>Pin</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => {
                  const chat = conversations.find((c) => c.id === openChatMenu);
                  if (chat) handleShare(e, chat);
                }}
                className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors">
                <Star className="w-3.5 h-3.5" />
                <span>Star</span>
              </button>

              <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Rename</span>
              </button>

              <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Add to project</span>
              </button>

              <div className="border-t border-amber-200 dark:border-amber-700 my-1" />

              <button
                onClick={(e) => {
                  const chat = conversations.find((c) => c.id === openChatMenu);
                  if (chat) handleDeleteChat(e, chat);
                }}
                className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      {isSearchOpen && (
        <>
          <div
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 border border-amber-200 dark:border-amber-700">
            <div className="p-4 border-b border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="flex-1 bg-transparent outline-none text-amber-900 dark:text-amber-100 placeholder:text-amber-600 dark:placeholder:text-amber-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
              {[...pinnedChats, ...unpinnedChats].length > 0 ? (
                [...pinnedChats, ...unpinnedChats].map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      handleChatClick(chat.id);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800 flex items-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                        {chat.title}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        {formatChatTime(chat.lastMessageAt || chat.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-amber-600 dark:text-amber-400">
                  No chats found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmChat && (
        <>
          <div
            onClick={() => setDeleteConfirmChat(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 p-6 border border-amber-200 dark:border-amber-700">
            <h3 className="text-xl font-bold text-amber-950 dark:text-amber-100 mb-4">
              Delete Chat?
            </h3>
            <p className="text-sm text-amber-900 dark:text-amber-200 mb-6">
              Are you sure you want to delete "{deleteConfirmChat.title}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmChat(null)}
                className="px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConversationMutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleteConversationMutation.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalChat(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 p-6 border border-amber-200 dark:border-amber-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Share2 className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </div>
                <h3 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                  Share Conversation
                </h3>
              </div>
              
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-6">
                Share "{shareModalChat.title}" with others. Anyone with the link will be able to view this conversation.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShareModalChat(null)}
                  className="px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors font-semibold"
                >
                  Cancel
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
                  className="px-4 py-2 rounded-lg bg-amber-800 dark:bg-amber-700 text-white hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors font-bold shadow-lg"
                >
                  Copy Share Link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 p-8 border border-amber-200 dark:border-amber-700"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-amber-950 dark:text-amber-100 mb-6 text-center"
              >
                Create a personal project
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-amber-100/50 dark:bg-amber-950/50 rounded-lg p-6 mb-6 border border-amber-200 dark:border-amber-800"
              >
                <h3 className="font-bold text-amber-950 dark:text-amber-100 mb-3">
                  How to use projects
                </h3>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-3">
                  Projects help organize your work and leverage knowledge across
                  multiple conversations. Upload docs, code, and files to create
                  themed collections that Claude can reference again and again.
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  Start by creating a memorable title and description to
                  organize your project. You can always edit it later.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-6"
              >
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-2">
                    What are you working on?
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Name your project"
                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-2">
                    What are you trying to achieve?
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project, goals, subject, etc..."
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex gap-3 justify-end"
              >
                <motion.button
                  onClick={() => setIsProjectModalOpen(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    console.log("Create project:", {
                      projectName,
                      projectDescription,
                    });
                    setIsProjectModalOpen(false);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-lg bg-amber-800 dark:bg-amber-700 text-white hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors font-bold shadow-lg"
                >
                  Create project
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Menu Popup */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserMenuOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="fixed bottom-20 left-4 w-72 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  gauravawscloud14@gmail.com
                </p>
              </div>

              <div className="py-2">
                {[
                  { icon: Settings, label: "Settings", shortcut: "⌘+Ctrl+," },
                  { icon: Globe, label: "Language", shortcut: null },
                  { icon: HelpCircle, label: "Get help", shortcut: null },
                  { icon: Zap, label: "Upgrade plan", shortcut: null },
                  { icon: LogOut, label: "Log out", shortcut: null },
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{
                      x: 3,
                      backgroundColor: "rgba(217, 119, 6, 0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">
                        {item.shortcut}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(180, 83, 9, 0.3);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(180, 83, 9, 0.5);
        }
      `}</style>
    </>
  );
};

export default SideBar;