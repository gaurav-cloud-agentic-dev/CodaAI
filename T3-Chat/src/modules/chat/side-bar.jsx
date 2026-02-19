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
      <motion.button 
        whileHover={{ x: 3, backgroundColor: "rgba(217, 119, 6, 0.15)" }}
        className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1"
      >
        <Star className="w-3 h-3" />
        <span>Star</span>
      </motion.button>
      <motion.button 
        whileHover={{ x: 3, backgroundColor: "rgba(217, 119, 6, 0.15)" }}
        className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1"
      >
        <Edit3 className="w-3 h-3" />
        <span>Rename</span>
      </motion.button>
      <motion.button 
        whileHover={{ x: 3, backgroundColor: "rgba(217, 119, 6, 0.15)" }}
        className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 text-amber-900 dark:text-amber-100 transition-colors rounded-lg mx-1"
      >
        <FolderOpen className="w-3 h-3" />
        <span>Add to project</span>
      </motion.button>
      <div className="border-t border-amber-200 dark:border-amber-700 my-1" />
      <motion.button 
        whileHover={{ x: 3, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        className="w-full px-3 py-1.5 text-left text-xs text-red-600 flex items-center gap-2 transition-colors rounded-lg mx-1"
      >
        <Trash2 className="w-3 h-3" />
        <span>Delete</span>
      </motion.button>
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
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="h-screen relative flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 border-r border-amber-200/60 dark:border-amber-800/60"
        style={{
          boxShadow: '4px 0 24px -4px rgba(217, 119, 6, 0.12)',
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        {/* Multiple animated gradient orbs */}
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
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none opacity-15 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [15, -15, 15],
            y: [10, -10, 10],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.15, rotate: isOpen ? -15 : 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="absolute -right-3 top-5 w-6 h-6 bg-amber-800 dark:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg z-20"
          >
            <motion.div 
              animate={{ rotate: isOpen ? 0 : 180 }} 
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </motion.div>
          </motion.button>

          {/* Logo */}
          <div className="p-5 border-b border-amber-200/60 dark:border-amber-800/60">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.h1
                  key="open"
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-amber-950 dark:text-amber-100"
                >
                  CodaAI
                </motion.h1>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, rotate: -180, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 180, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex justify-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                  </motion.div>
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
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 relative overflow-hidden`}
                style={{
                  background: hoveredItem === item.id 
                    ? 'rgba(217, 119, 6, 0.15)'
                    : 'transparent',
                  backdropFilter: hoveredItem === item.id ? 'blur(8px)' : 'none'
                }}
              >
                {/* Shimmer effect on hover */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={hoveredItem === item.id ? { 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.15, 1]
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <item.icon 
                    className="w-4 h-4 text-amber-900 dark:text-amber-200 relative z-10" 
                    strokeWidth={2.5} 
                  />
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-semibold text-amber-950 dark:text-amber-100 relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip */}
                <AnimatePresence>
                  {!isOpen && hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute left-full ml-2 px-3 py-1.5 bg-amber-800 dark:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap z-50"
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-2 mb-3"
                >
                  <History className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" strokeWidth={2.5} />
                  <h2 className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Recent
                  </h2>
                </motion.div>
                <div className="space-y-1.5">
                  {recentChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                      whileHover={{ x: 4 }}
                      className="relative"
                    >
                      <motion.button
                        className="w-full text-left px-3 py-2 rounded-xl transition-all duration-200"
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
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            whileHover={{ scale: 1.15, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
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
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: index * 0.05, 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    whileHover={{ scale: 1.15, y: -3, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-amber-800 dark:bg-amber-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md relative"
                  >
                    {index + 1}

                    <AnimatePresence>
                      {hoveredChat === chat.id && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute left-full ml-2 px-3 py-2 bg-amber-800 dark:bg-amber-700 rounded-lg shadow-lg whitespace-nowrap max-w-xs z-50"
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`w-full flex items-center ${isOpen ? 'gap-2 px-2' : 'justify-center'} py-2.5 rounded-xl hover:bg-amber-200/30 dark:hover:bg-amber-800/30 transition-colors`}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-8 h-8 bg-amber-800 dark:bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md"
              >
                GS
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs font-bold text-amber-950 dark:text-amber-100 truncate">
                        Gaurav Salunke
                      </p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Free plan</p>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-amber-900 dark:text-amber-200" />
                    </motion.div>
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
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
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
                  <motion.button 
                    onClick={() => setIsSearchOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                  </motion.button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                {allChats.map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 6, backgroundColor: "rgba(217, 119, 6, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors"
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
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-amber-950 dark:text-amber-100"
                >
                  All Chats
                </motion.h2>
                <motion.button 
                  onClick={() => setIsChatsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-amber-900 dark:text-amber-100" />
                </motion.button>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                {allChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 6, backgroundColor: "rgba(217, 119, 6, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg cursor-pointer transition-colors"
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
                  Projects help organize your work and leverage knowledge across multiple
                  conversations. Upload docs, code, and files to create themed collections
                  that Claude can reference again and again.
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  Start by creating a memorable title and description to organize your
                  project. You can always edit it later.
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
                    console.log("Create project:", { projectName, projectDescription });
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
                    whileHover={{ x: 3, backgroundColor: "rgba(217, 119, 6, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-amber-950 dark:text-amber-100 text-sm font-semibold transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">{item.shortcut}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;