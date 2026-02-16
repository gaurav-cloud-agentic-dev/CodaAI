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
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/40 dark:from-gray-900 dark:via-orange-950/20 dark:to-amber-950/30 p-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-amber-200/40 dark:from-orange-900/10 dark:to-amber-900/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Section */}
      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {/* Plan Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">Free plan</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Upgrade
          </button>
        </motion.div>

        {/* Greeting - NO STAR ANIMATION */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-gray-100 mb-12 flex items-center gap-3"
        >
          <span className="text-orange-500">✦</span>
          {getGreeting()}, Gaurav Salunke
        </motion.h1>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-visible hover:shadow-xl transition-shadow duration-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full px-5 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none resize-none font-medium"
              rows={2}
            />
            
            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {/* Plus Button with Menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-100"
                  >
                    <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>

                  {/* Plus Menu Dropdown - INSTANT & SMOOTH */}
                  <AnimatePresence>
                    {isPlusMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.05 }}
                          onClick={() => setIsPlusMenuOpen(false)}
                          className="fixed inset-0 z-30"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ 
                            duration: 0.12,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="absolute left-0 bottom-[calc(100%+8px)] w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 z-40 overflow-hidden"
                        >
                          {plusMenuItems.map((item, index) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ 
                                duration: 0.08,
                                delay: index * 0.015
                              }}
                              onClick={() => {
                                item.action();
                                setIsPlusMenuOpen(false);
                              }}
                              whileHover={{ 
                                x: 4,
                                transition: { duration: 0.08 }
                              }}
                              className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-75 ${
                                item.isBlue ? "text-blue-600" : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                              {item.hasArrow && <ChevronRight className="w-4 h-4 text-gray-400" />}
                              {item.hasCheck && <Check className="w-4 h-4 text-blue-600" />}
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-100 flex items-center gap-2"
                >
                  Sonnet 4.5
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-100"
                >
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.25,
                delay: 0.25 + index * 0.04
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-100 ${
                selectedCategory === category.id
                  ? "bg-gray-900 dark:bg-gray-700 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg"
              }`}
            >
              <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? "text-white" : category.color}`} />
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainChatPage;