"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
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
import ModelSelector from "./model-selector";

const MainChatPage = () => {
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState({
  id: null,
  name: "Select Model"
  });
  
  // Reference for model selector button
  const modelButtonRef = useRef(null);

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

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsModelSelectorOpen(false);
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 p-8 relative overflow-hidden"
      style={{
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      {/* Subtle Background Orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)'
        }}
      />

      {/* Top Section */}
      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {/* Plan Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/70 dark:bg-amber-900/70 backdrop-blur-sm rounded-full shadow-sm border border-amber-200 dark:border-amber-700"
        >
          <span className="text-sm text-amber-800 dark:text-amber-300">Free plan</span>
          <span className="text-amber-400 dark:text-amber-600">·</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 transition-colors"
          >
            Upgrade
          </motion.button>
        </motion.div>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif text-amber-950 dark:text-amber-100 mb-12"
        >
          {getGreeting()}, Gaurav Salunke
        </motion.h1>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="relative bg-white/80 dark:bg-amber-900/80 backdrop-blur-md rounded-xl shadow-lg border border-amber-200 dark:border-amber-700 overflow-visible transition-all duration-200">
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
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150"
                  >
                    <Plus className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                  </motion.button>

                  {/* Plus Menu Dropdown */}
                  <AnimatePresence>
                    {isPlusMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setIsPlusMenuOpen(false)}
                          className="fixed inset-0 z-30"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 bottom-[calc(100%+8px)] w-72 bg-white/95 dark:bg-amber-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-200/50 dark:border-amber-700/50 py-2 z-40 overflow-hidden"
                        >
                          {plusMenuItems.map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                setIsPlusMenuOpen(false);
                              }}
                              whileHover={{ x: 4, backgroundColor: "rgba(217, 119, 6, 0.12)" }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className={`w-full px-4 py-2.5 flex items-center gap-3 ${
                                item.isBlue ? "text-blue-600 dark:text-blue-400" : "text-amber-950 dark:text-amber-100"
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
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
                {/* Model Selector Button */}
                <motion.button
                  ref={modelButtonRef}
                  onClick={() => setIsModelSelectorOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 py-1.5 text-sm text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150 flex items-center gap-2"
                >
                  {selectedModel.name}
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </motion.button>

                {/* Voice Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150"
                >
                  <Mic className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-150 backdrop-blur-sm ${
                selectedCategory === category.id
                  ? "bg-amber-800 dark:bg-amber-700 text-white shadow-lg"
                  : "bg-white/70 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 shadow-md border border-amber-200 dark:border-amber-700"
              }`}
            >
              <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? "text-white" : category.color}`} />
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Model Selector Modal */}
      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={handleModelSelect}
        triggerRef={modelButtonRef}
      />
    </div>
  );
};

export default MainChatPage;