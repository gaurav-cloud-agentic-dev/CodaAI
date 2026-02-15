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

  // Sample data
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
    { 
      id: "new", 
      icon: Plus, 
      label: "New chat", 
      action: () => console.log("New chat"),
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

  const ChatOptionsMenu = ({ chatId, onClose }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute right-2 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 w-40 z-50 backdrop-blur-md"
    >
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors rounded-lg mx-1">
        <Star className="w-3 h-3" />
        <span>Star</span>
      </button>
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors rounded-lg mx-1">
        <Edit3 className="w-3 h-3" />
        <span>Rename</span>
      </button>
      <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors rounded-lg mx-1">
        <FolderOpen className="w-3 h-3" />
        <span>Add to project</span>
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
      <button className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors rounded-lg mx-1">
        <Trash2 className="w-3 h-3" />
        <span>Delete</span>
      </button>
    </motion.div>
  );

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Modern Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 8px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #4b5563 0%, #374151 100%);
        }

        /* For dark mode */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af transparent;
        }
      `}</style>

      {/* Main Sidebar */}
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 60 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="h-screen bg-white dark:bg-gray-900 border-r-2 border-gray-200 dark:border-gray-700 flex flex-col relative shadow-xl"
        style={{
          boxShadow: '4px 0 15px -3px rgba(0, 0, 0, 0.1), 2px 0 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.15, rotate: isOpen ? 0 : 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="absolute -right-3 top-4 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white rounded-full flex items-center justify-center shadow-xl z-10 hover:shadow-2xl transition-shadow"
        >
          {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
              >
                CodaAI
              </motion.h1>
            ) : (
              <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <Sparkles className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-2.5">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, x: isOpen ? 6 : 0 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative group shadow-sm hover:shadow-md`}
            >
              <motion.div
                animate={hoveredItem === item.id ? { 
                  rotate: [0, -12, 12, -12, 0],
                  scale: [1, 1.15, 1.15, 1.15, 1]
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <item.icon className="w-4 h-4 text-gray-900 dark:text-gray-100" strokeWidth={2.5} />
              </motion.div>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for closed state */}
              <AnimatePresence>
                {!isOpen && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap z-50 shadow-2xl"
                  >
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Recent Chats with Custom Scrollbar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 px-2 mb-3"
              >
                <History className="w-3.5 h-3.5 text-gray-700 dark:text-gray-400" strokeWidth={2.5} />
                <h2 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recent
                </h2>
              </motion.div>
              <div className="space-y-1.5">
                {recentChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group"
                  >
                    <motion.button 
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate pr-6 leading-tight">
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        {chat.time}
                      </p>
                    </motion.button>

                    {/* Three dots menu */}
                    <AnimatePresence>
                      {hoveredChat === chat.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-gray-900 dark:text-gray-100" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent icon for closed state */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center pt-4 gap-3 overflow-y-auto custom-scrollbar"
            >
              {recentChats.slice(0, 5).map((chat, index) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  whileHover={{ scale: 1.25, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-gray-100 text-xs font-bold relative shadow-md hover:shadow-xl transition-all"
                >
                  {index + 1}
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredChat === chat.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg whitespace-nowrap z-50 shadow-2xl max-w-xs"
                      >
                        <p className="font-semibold text-xs">{chat.title}</p>
                        <p className="text-[10px] opacity-75 mt-0.5">{chat.time}</p>
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center ${isOpen ? 'gap-2 px-2' : 'justify-center'} py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md"
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
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                      Gaurav Salunke
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Free plan</p>
                  </motion.div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-900 dark:text-gray-100" />
                </>
              )}
            </AnimatePresence>
          </motion.button>
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
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                  <input
                    type="text"
                    placeholder="Search chats and projects"
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 font-medium"
                    autoFocus
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                {allChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileHover={{ x: 6 }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {chat.title}
                      </p>
                      {chat.project && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{chat.project}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Enter</span>
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
              className="fixed left-[240px] top-0 bottom-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden border-r border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  All Chats
                </h2>
                <button onClick={() => setIsChatsOpen(false)}>
                  <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </button>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                {allChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ x: 6 }}
                    className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {chat.title}
                    </p>
                    {chat.project && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chat.project}</p>
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-8 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Create a personal project
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
                  How to use projects
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Projects help organize your work and leverage knowledge across multiple
                  conversations. Upload docs, code, and files to create themed collections
                  that Claude can reference again and again.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Start by creating a memorable title and description to organize your
                  project. You can always edit it later.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                    What are you working on?
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Name your project"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                    What are you trying to achieve?
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project, goals, subject, etc..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 outline-none resize-none font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Create project:", { projectName, projectDescription });
                    setIsProjectModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-bold shadow-lg"
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
              className="fixed bottom-16 left-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  gauravawscloud14@gmail.com
                </p>
              </div>

              <div className="py-2">
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">⌘+Ctrl+,</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Language</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Get help</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors">
                  <Zap className="w-4 h-4" />
                  <span>Upgrade plan</span>
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors">
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