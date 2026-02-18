"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  Paperclip,
  Camera,
  FolderPlus,
  Sparkles,
  Globe,
  Palette,
  Plug,
  Code,
  GraduationCap,
  PenTool,
  Coffee,
  Lightbulb,
  ChevronRight,
  Check,
  Mic,
} from "lucide-react";

const MainChatPage = () => {
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const plusMenuItems = [
    { id: "files", icon: Paperclip, label: "Add files or photos", action: () => console.log("Add files") },
    { id: "screenshot", icon: Camera, label: "Take a screenshot", action: () => console.log("Screenshot") },
    { id: "project", icon: FolderPlus, label: "Add to project", hasArrow: true, action: () => console.log("Add to project") },
    { id: "gamma", icon: Sparkles, label: "Add from Gamma", hasArrow: true, action: () => console.log("Gamma") },
    { id: "websearch", icon: Globe, label: "Web search", isBlue: true, hasCheck: true, action: () => console.log("Web search") },
    { id: "style", icon: Palette, label: "Use style", hasArrow: true, action: () => console.log("Style") },
    { id: "connectors", icon: Plug, label: "Connectors", hasArrow: true, action: () => console.log("Connectors") },
  ];

  const categories = [
    { id: "code", icon: Code, label: "Code", color: "text-blue-600" },
    { id: "learn", icon: GraduationCap, label: "Learn", color: "text-purple-600" },
    { id: "write", icon: PenTool, label: "Write", color: "text-green-600" },
    { id: "life", icon: Coffee, label: "Life stuff", color: "text-orange-600" },
    { id: "choice", icon: Lightbulb, label: "CodaAI's choice", color: "text-amber-600" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 p-8 relative overflow-hidden"
      style={{
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      {/* Animated Background Elements with More Movement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ 
          opacity: 0.3, 
          scale: 1.2,
          rotate: 45,
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-300/50 to-amber-300/50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
        animate={{ 
          opacity: 0.3, 
          scale: 1.2,
          rotate: -45,
          x: [0, -50, 0],
          y: [0, 30, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-300/50 to-orange-300/50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Pulsing gradient orb in center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(249, 115, 22, 0.3) 50%, transparent 70%)'
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-amber-400/40 dark:bg-amber-600/30 rounded-full pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Top Section */}
      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {/* Plan Badge with bounce */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/70 dark:bg-amber-900/70 backdrop-blur-sm rounded-full shadow-sm border border-amber-200 dark:border-amber-700"
        >
          <span className="text-sm text-amber-800 dark:text-amber-300">Free plan</span>
          <span className="text-amber-400 dark:text-amber-600">·</span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 transition-colors"
          >
            Upgrade
          </motion.button>
        </motion.div>

        {/* Greeting with staggered letter animation */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 100
          }}
          className="text-4xl md:text-5xl font-serif text-amber-950 dark:text-amber-100 mb-12 flex items-center gap-3"
        >
          <motion.span 
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-orange-500"
          >
            ✦
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {getGreeting()}, 
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Gaurav Salunke
          </motion.span>
        </motion.h1>

        {/* Input Box with dynamic entrance */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.3,
            type: "spring",
            stiffness: 120
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 20px 40px -10px rgba(217, 119, 6, 0.3)"
          }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="relative bg-white/80 dark:bg-amber-900/80 backdrop-blur-md rounded-xl shadow-lg border border-amber-200 dark:border-amber-700 overflow-visible transition-all duration-300">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full px-5 py-3 bg-transparent text-amber-950 dark:text-amber-100 placeholder:text-amber-600 dark:placeholder:text-amber-400 outline-none resize-none font-medium"
              rows={2}
            />
            
            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2">
                {/* Plus Button with Menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 180,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                  </motion.button>

                  {/* Plus Menu Dropdown - IMPROVED */}
                  <AnimatePresence>
                    {isPlusMenuOpen && (
                      <>
                        {/* Backdrop - Click to close */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setIsPlusMenuOpen(false)}
                          className="fixed inset-0 z-30"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                            mass: 0.5
                          }}
                          className="absolute left-0 bottom-[calc(100%+8px)] w-72 bg-white/95 dark:bg-amber-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-200/50 dark:border-amber-700/50 py-2 z-40 overflow-hidden"
                        >
                          {plusMenuItems.map((item, index) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: index * 0.04,
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                setIsPlusMenuOpen(false);
                              }}
                              whileHover={{ 
                                x: 6,
                                backgroundColor: "rgba(217, 119, 6, 0.15)",
                                transition: { duration: 0.15 }
                              }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150 ${
                                item.isBlue ? "text-blue-600 dark:text-blue-400" : "text-amber-950 dark:text-amber-100"
                              }`}
                            >
                              <motion.div
                                whileHover={{ rotate: 15, scale: 1.15 }}
                                transition={{ duration: 0.2 }}
                              >
                                <item.icon className="w-5 h-5" />
                              </motion.div>
                              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                              {item.hasArrow && (
                                <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              )}
                              {item.hasCheck && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            </motion.button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side - Model Selector & Voice */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 text-sm text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  Sonnet 4.5
                  <motion.div
                    animate={{ rotate: [0, 180, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -10, 10, 0]
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-200"
                >
                  <Mic className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Pills - FIXED HOVER EFFECTS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 30, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{ 
                scale: 1.08,
                y: -3,
                boxShadow: "0 8px 25px -5px rgba(217, 119, 6, 0.35)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.96, y: 0 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 backdrop-blur-sm ${
                selectedCategory === category.id
                  ? "bg-amber-800 dark:bg-amber-700 text-white shadow-lg"
                  : "bg-white/70 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 shadow-md border border-amber-200 dark:border-amber-700"
              }`}
            >
              <motion.div
                animate={selectedCategory === category.id ? {
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? "text-white" : category.color}`} />
              </motion.div>
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainChatPage;