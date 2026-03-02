"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Plus, Mic, Send, ChevronRight, AlertCircle,
  Code, GraduationCap, PenTool, Coffee,
} from "lucide-react";
import ModelSelector from "./model-selector";
import { useInitializeChat } from "./hooks/chat";
import { useChatStore } from "./store/chat-store";
import { toast } from "sonner";

const SCROLLBAR_STYLES = `
  .coda-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  .coda-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    margin: 6px 0;
  }
  .coda-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(217,119,6,0.35) 0%, rgba(180,83,9,0.55) 100%);
    border-radius: 999px;
    transition: background 0.2s;
  }
  .coda-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(217,119,6,0.7) 0%, rgba(180,83,9,0.9) 100%);
  }
  .coda-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(180,83,9,0.4) transparent;
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "coda-scrollbar-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
}

const MainChatPage = () => {
  useInjectStyles(SCROLLBAR_STYLES);

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState({ id: null, name: "Select Model" });

  const textareaRef = useRef(null);
  const modelButtonRef = useRef(null);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURN
  const activeChatId = useChatStore((state) => state.activeChatId);
  const initializeChatMutation = useInitializeChat();

  const isLoading = initializeChatMutation.isPending;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // NOW we can do conditional return AFTER all hooks
  if (activeChatId) {
    return null;
  }

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!selectedModel || !selectedModel.id) {
      toast.error("Please select an AI model first", {
        icon: <AlertCircle className="w-4 h-4" />,
      });
      return;
    }

    const lineCount = message.split("\n").length;
    if (lineCount > 600) {
      toast.error("Message exceeds 600 line limit", {
        duration: 3000,
        icon: <AlertCircle className="w-4 h-4" />,
      });
      return;
    }

    const content = message.trim();
    setMessage("");

    await initializeChatMutation.mutateAsync({
      content,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="flex-1 flex flex-col h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 relative overflow-hidden"
      style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* Background Orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-20"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)" }}
      />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Welcome Page */}
        <div className="flex-1 flex flex-col items-center justify-center pb-0 px-8 pt-8">
          <div className="w-full max-w-3xl">
            {/* Plan Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-white/70 dark:bg-amber-900/70 backdrop-blur-sm rounded-full shadow-sm border border-amber-200 dark:border-amber-700 w-fit mx-auto"
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
              className="text-4xl md:text-5xl font-serif text-amber-950 dark:text-amber-100 mb-4 text-center"
            >
              {getGreeting()}, Gaurav Salunke
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-center text-amber-700 dark:text-amber-400 mb-8 text-lg"
            >
              How can I help you today?
            </motion.p>

            {/* Suggestion Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
            >
              {[
                { title: "Write code", desc: "Help me build a React component", icon: Code },
                { title: "Learn something", desc: "Explain quantum computing", icon: GraduationCap },
                { title: "Create content", desc: "Draft a blog post about AI", icon: PenTool },
                { title: "Get advice", desc: "Suggest healthy meal plans", icon: Coffee },
              ].map((suggestion, index) => (
                <motion.button
                  key={suggestion.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMessage(suggestion.desc)}
                  className="text-left p-4 rounded-xl bg-white/70 dark:bg-amber-900/70 border border-amber-200 dark:border-amber-700 hover:bg-white dark:hover:bg-amber-900 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <suggestion.icon className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-950 dark:text-amber-100 mb-1">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {suggestion.desc}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Input Box */}
        <div className="px-4 pb-4 pt-2 flex-shrink-0">
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative bg-white/80 dark:bg-amber-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-amber-200/60 dark:border-amber-700/60">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="coda-scrollbar w-full px-5 py-3 bg-transparent text-amber-950 dark:text-amber-100 placeholder:text-amber-500 dark:placeholder:text-amber-400 outline-none resize-none font-medium max-h-[200px] overflow-y-auto"
                rows={1}
              />

              <div className="flex items-center justify-between px-3 py-2">
                {/* Left controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150"
                    disabled={isLoading}
                  >
                    <Mic className="w-4 h-4 text-amber-800 dark:text-amber-300" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150"
                    disabled={isLoading}
                  >
                    <Plus className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                  </motion.button>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    ref={modelButtonRef}
                    onClick={() => setIsModelSelectorOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="px-3 py-1.5 text-xs text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors duration-150 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {selectedModel.name}
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </motion.button>

                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    whileHover={message.trim() && !isLoading ? { scale: 1.08 } : {}}
                    whileTap={message.trim() && !isLoading ? { scale: 0.92 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      message.trim() && !isLoading
                        ? "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-md cursor-pointer"
                        : "bg-amber-300 dark:bg-amber-800 cursor-not-allowed opacity-40"
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className={`w-4 h-4 ${message.trim() ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-amber-500 dark:text-amber-600 mt-2">
              CodaAI can make mistakes. Consider checking important info.
            </p>
          </div>
        </div>
      </div>

      {/* Model Selector */}
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