"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  History,
} from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const recentChats = [
    { id: 1, title: "Animated landing page with floati...", time: "2h ago" },
    { id: 2, title: "CODA chat application website d...", time: "5h ago" },
    { id: 3, title: "Meeting request for production m...", time: "1d ago" },
    { id: 4, title: "Retrieve all contacts from database", time: "2d ago" },
    { id: 5, title: "Develop project estimates", time: "3d ago" },
    { id: 6, title: "React component optimization", time: "4d ago" },
    { id: 7, title: "API integration documentation", time: "5d ago" },
    { id: 8, title: "Database schema design", time: "1w ago" },
  ];

  const allChats = [
    { id: 1, title: "Side-bar chat module component", project: "T3-Chat" },
    { id: 2, title: "Debug my code", project: null },
    { id: 3, title: "React hooks explanation", project: "Learning" },
    { id: 4, title: "API integration guide", project: null },
  ];

  const menuItems = [
    { id: "new", icon: Plus, label: "New chat", action: () => console.log("New chat") },
    { id: "search", icon: Search, label: "Search", action: () => setIsSearchOpen(true) },
    { id: "chats", icon: MessageSquare, label: "Chats", action: () => setIsChatsOpen(true) },
    { id: "projects", icon: FolderOpen, label: "Projects", action: () => setIsProjectModalOpen(true) },
  ];

  const ChatOptionsMenu = ({ chatId, onClose }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute right-2 top-8 bg-white/80 dark:bg-amber-900/80 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-700 py-1.5 w-40 z-50 backdrop-blur-md"
    >
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-amber-100/60 dark:hover:bg-amber-800/60 flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1">
        <Star className="w-3 h-3" />
        <span>Star</span>
      </button>
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-amber-100/60 dark:hover:bg-amber-800/60 flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1">
        <Edit3 className="w-3 h-3" />
        <span>Rename</span>
      </button>
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-amber-100/60 dark:hover:bg-amber-800/60 flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1">
        <FolderOpen className="w-3 h-3" />
        <span>Add to project</span>
      </button>
      <div className="border-t border-amber-200 dark:border-amber-700 my-1" />
      <button className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors rounded-lg mx-1">
        <Trash2 className="w-3 h-3" />
        <span>Delete</span>
      </button>
    </motion.div>
  );

  return (
    <>
      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b45309 0%, #92400e 100%);
        }
      `}</style>

      {/* Main Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 280 : 70 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-screen relative flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 border-r border-amber-200/60 dark:border-amber-800/60"
        style={{
          boxShadow: '4px 0 24px -4px rgba(217, 119, 6, 0.12)',
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        {/* Subtle animated gradient orb */}
        <motion.div
          className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -right-3 top-5 w-6 h-6 bg-amber-800 dark:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg z-20"
          >
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
              {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </motion.div>
          </motion.button>

          {/* Logo */}
          <div className="p-5 border-b border-amber-200/60 dark:border-amber-800/60">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.h1
                  key="open"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold text-amber-950 dark:text-amber-100"
                >
                  CodaAI
                </motion.h1>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  <Sparkles className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-150`}
                style={{
                  background: hoveredItem === item.id 
                    ? 'rgba(217, 119, 6, 0.15)'
                    : 'transparent',
                  backdropFilter: hoveredItem === item.id ? 'blur(8px)' : 'none'
                }}
              >
                <motion.div
                  animate={hoveredItem === item.id ? { rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon 
                    className="w-4 h-4 text-amber-900 dark:text-amber-200" 
                    strokeWidth={2.5} 
                  />
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-semibold text-amber-950 dark:text-amber-100"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip */}
                <AnimatePresence>
                  {!isOpen && hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -5, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full ml-2 px-3 py-1.5 bg-amber-800 dark:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap"
                    >
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-amber-800 dark:border-r-amber-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Recent Chats */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar"
              >
                <div className="flex items-center gap-2 px-2 mb-3">
                  <History className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" strokeWidth={2.5} />
                  <h2 className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Recent
                  </h2>
                </div>
                <div className="space-y-1.5">
                  {recentChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.15 }}
                      className="relative"
                    >
                      <motion.button
                        className="w-full text-left px-3 py-2 rounded-xl transition-all duration-150"
                        style={{
                          background: hoveredChat === chat.id 
                            ? 'rgba(217, 119, 6, 0.12)'
                            : 'transparent'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <p className="text-xs font-medium text-amber-950 dark:text-amber-100 truncate pr-6">
                          {chat.title}
                        </p>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 font-medium">
                          {chat.time}
                        </p>
                      </motion.button>

                      <AnimatePresence>
                        {hoveredChat === chat.id && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-200/60 dark:bg-amber-800/60 rounded-lg"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-amber-900 dark:text-amber-200" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Closed State Icons */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col items-center pt-4 gap-3 overflow-y-auto custom-scrollbar"
              >
                {recentChats.slice(0, 5).map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="w-10 h-10 bg-amber-800 dark:bg-amber-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md"
                  >
                    {index + 1}

                    <AnimatePresence>
                      {hoveredChat === chat.id && (
                        <motion.div
                          initial={{ opacity: 0, x: -5, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-full ml-2 px-3 py-2 bg-amber-800 dark:bg-amber-700 rounded-lg shadow-lg whitespace-nowrap max-w-xs"
                        >
                          <p className="font-semibold text-xs text-white">{chat.title}</p>
                          <p className="text-[10px] text-amber-200 mt-0.5">{chat.time}</p>
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-amber-800 dark:border-r-amber-700" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile */}
          <div className="p-4 border-t border-amber-200/60 dark:border-amber-800/60">
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={`w-full flex items-center ${isOpen ? 'gap-2 px-2' : 'justify-center'} py-2.5 rounded-xl hover:bg-amber-200/30 dark:hover:bg-amber-800/30 transition-colors`}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-amber-800 dark:bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md"
              >
                GS
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs font-bold text-amber-950 dark:text-amber-100 truncate">
                        Gaurav Salunke
                      </p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Free plan</p>
                    </motion.div>
                    <ChevronDown className="w-4 h-4 text-amber-900 dark:text-amber-200" />
                  </>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 overflow-hidden border border-amber-200 dark:border-amber-700"
            >
              <div className="p-4 border-b border-amber-200 dark:border-amber-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                  <input
                    type="text"
                    placeholder="Search chats and projects"
                    className="flex-1 bg-transparent outline-none text-amber-900 dark:text-amber-100 placeholder:text-amber-600 dark:placeholder:text-amber-400 font-medium"
                    autoFocus
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <X className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                {allChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileHover={{ x: 6 }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                        {chat.title}
                      </p>
                      {chat.project && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{chat.project}</p>
                      )}
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400">Enter</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chats List Modal */}
      <AnimatePresence>
        {isChatsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-[280px] top-0 bottom-0 w-96 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 shadow-2xl z-50 overflow-hidden border-r border-amber-200 dark:border-amber-700"
            >
              <div className="p-6 border-b border-amber-200 dark:border-amber-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                  All Chats
                </h2>
                <button onClick={() => setIsChatsOpen(false)}>
                  <X className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                </button>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                {allChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ x: 6 }}
                    className="p-4 rounded-lg hover:bg-amber-200/40 dark:hover:bg-amber-800/40 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                      {chat.title}
                    </p>
                    {chat.project && (
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{chat.project}</p>
                    )}
                  </motion.div>
                ))}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-2xl z-50 p-8 border border-amber-200 dark:border-amber-700"
            >
              <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 mb-6 text-center">
                Create a personal project
              </h2>

              <div className="bg-amber-100/50 dark:bg-amber-950/50 rounded-lg p-6 mb-6 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-amber-950 dark:text-amber-100 mb-3">
                  How to use projects
                </h3>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-3">
                  Projects help organize your work and leverage knowledge across multiple
                  conversations. Upload docs, code, and files to create themed collections
                  that Claude can reference again and again.
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  Start by creating a memorable title and description to organize your
                  project. You can always edit it later.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-2">
                    What are you working on?
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Name your project"
                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
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
                    className="w-full px-4 py-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Create project:", { projectName, projectDescription });
                    setIsProjectModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-amber-800 dark:bg-amber-700 text-white hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors font-bold shadow-lg"
                >
                  Create project
                </button>
              </div>
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
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-20 left-4 w-72 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  gauravawscloud14@gmail.com
                </p>
              </div>

              <div className="py-2">
                <button className="w-full px-4 py-2.5 text-left hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                  <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">⌘+Ctrl+,</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Language</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Get help</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors">
                  <Zap className="w-4 h-4" />
                  <span>Upgrade plan</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-amber-200/40 dark:hover:bg-amber-800/40 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;