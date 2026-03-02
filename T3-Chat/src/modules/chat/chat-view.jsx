"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Bot, User, Send, Mic, Plus, ChevronRight,
  AlertCircle, Share2, Brain, ChevronDown,
} from "lucide-react";
import { useChatStore } from "./store/chat-store";
import { useConversationMessages } from "./hooks/chat";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import ModelSelector from "./model-selector";
import ShareModal from "../components/share-modal";
import { shareConversation, unshareConversation } from "./actions/share";

const classyEase = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.38 };
const classyFast = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.22 };

function decodeB64(b64) {
  try {
    return Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return "";
  }
}

function BlinkingCursor({ thin = false }) {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear", times: [0, 0.45, 0.5, 1] }}
      className={
        thin
          ? "inline-block w-0.5 h-3.5 bg-amber-500 ml-0.5 align-text-bottom"
          : "inline-block w-0.5 h-4 bg-amber-700 dark:bg-amber-400 ml-0.5 align-text-bottom"
      }
    />
  );
}

function ThinkingBlock({ thinking, isStreaming = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!thinking) return null;
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
      >
        <Brain className="w-3.5 h-3.5" />
        <span>{isStreaming ? "Thinking..." : "Thought process"}</span>
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"
          />
        )}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={classyFast} className="ml-0.5">
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={classyEase}
            className="overflow-hidden"
          >
            <div className="mt-2 px-3 py-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/40 max-h-64 overflow-y-auto">
              <p className="text-xs text-amber-700 dark:text-amber-400 whitespace-pre-wrap leading-relaxed font-mono">
                {thinking}
                {isStreaming && <BlinkingCursor thin />}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatView({ initialChatId }) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState({ id: null, name: "Select Model" });
  const [input, setInput] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isConversationShared, setIsConversationShared] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modelButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    setActiveChatId, setStreaming, appendStreamingContent,
    appendStreamingThinking, stopStreaming, isStreaming,
    streamingContent, streamingThinking, streamingConversationId,
  } = useChatStore();

  const queryClient = useQueryClient();
  const { data: conversationData, isLoading: loadingMessages } = useConversationMessages(initialChatId);

  const conversationTitle = conversationData?.conversation?.title || "";
  const modelName = conversationData?.conversation?.modelName || selectedModel.name || "Unknown Model";
  const dbMessages = conversationData?.messages || [];
  const activeModelId = conversationData?.conversation?.modelId || selectedModel.id;
  const activeModelName = conversationData?.conversation?.modelName || selectedModel.name;
  const isThisStreaming = isStreaming && streamingConversationId === initialChatId;

  useEffect(() => { if (initialChatId) setActiveChatId(initialChatId); }, [initialChatId, setActiveChatId]);

  useEffect(() => {
    if (conversationData?.conversation?.isShared) {
      setIsConversationShared(true);
      const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      setShareUrl(`${base}/share/${conversationData.conversation.shareId}`);
    }
  }, [conversationData]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages.length, streamingContent, streamingThinking]);

  const handleModelSelect = (model) => { setSelectedModel(model); setIsModelSelectorOpen(false); };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isThisStreaming) return;
    if (input.split("\n").length > 600) {
      toast.error("Message exceeds 600 line limit", { duration: 3000, icon: <AlertCircle className="w-4 h-4" /> });
      return;
    }
    if (!activeModelId) {
      toast.error("Please select a model first", { icon: <AlertCircle className="w-4 h-4" /> });
      return;
    }
    const content = input.trim();
    setInput("");
    const previousMessages = dbMessages.map((m) => ({ role: m.role, content: m.content }));
    setStreaming(initialChatId);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: initialChatId, content, modelId: activeModelId, modelName: activeModelName, previousMessages }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to get response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith("T:")) { const text = decodeB64(line.slice(2)); if (text) appendStreamingThinking(text); }
          else if (line.startsWith("C:")) { const text = decodeB64(line.slice(2)); if (text) appendStreamingContent(text); }
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (err) {
      toast.error(err.message || "Failed to get AI response");
      console.error(err);
    } finally {
      stopStreaming();
    }
  };

  const handleShare = async () => {
    const result = await shareConversation(initialChatId);
    if (result.success) { setShareUrl(result.shareUrl); setIsConversationShared(true); toast.success("Share link created!"); }
    else toast.error(result.error || "Failed to create share link");
  };

  const handleUnshare = async () => {
    const result = await unshareConversation(initialChatId);
    if (result.success) { setIsConversationShared(false); toast.success("Conversation unshared"); }
    else toast.error(result.error || "Failed to unshare");
  };

  const formatMessageTime = (date) => format(new Date(date), "MMM d, h:mm a");

  return (
    <div
      className="flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950"
      style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', width: "100%", height: "100%", minHeight: 0, overflow: "hidden" }}
    >
      <style>{`
        html, body, #__next { height: 100%; overflow: hidden !important; }
        .msg-scroll::-webkit-scrollbar { width: 3px; }
        .msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background: rgba(180,83,9,0.2); border-radius: 999px; }
        .msg-scroll::-webkit-scrollbar-thumb:hover { background: rgba(180,83,9,0.4); }
        .input-glow:focus-within { box-shadow: 0 0 0 2px rgba(217,119,6,0.2), 0 4px 20px -4px rgba(217,119,6,0.12); }
      `}</style>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)", zIndex: 0 }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={classyEase}
        className="flex-shrink-0 px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/60 bg-white/50 dark:bg-amber-900/50 backdrop-blur-sm" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-100 truncate">{conversationTitle || "Chat"}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-amber-700 dark:text-amber-400">{dbMessages.length} messages • {modelName}</p>
              {isThisStreaming && (
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
                  {streamingThinking && !streamingContent ? "Thinking..." : "Generating..."}
                </motion.span>
              )}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-xl transition-colors flex items-center gap-2 flex-shrink-0">
            <Share2 className="w-5 h-5 text-amber-800 dark:text-amber-300" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Share</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="msg-scroll relative flex-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: 0, zIndex: 1 }}>
        <div className="w-full px-4 py-6">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
                <p className="text-xs text-amber-500">Loading messages...</p>
              </div>
            </div>
          ) : dbMessages.length === 0 && !isThisStreaming ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={classyEase} className="flex items-center justify-center py-20">
              <p className="text-sm text-amber-400 dark:text-amber-500">No messages yet. Start the conversation!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {dbMessages.map((msg, index) => (
                <motion.div key={msg.id || index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.36, delay: Math.min(index * 0.04, 0.24) }}
                  className={`flex items-end gap-2 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.28, delay: Math.min(index * 0.04, 0.24) + 0.05 }}
                    className="flex-shrink-0 mb-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-gradient-to-br from-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
                      {msg.role === "user" ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </motion.div>
                  <div className={`flex flex-col min-w-0 ${msg.role === "user" ? "items-end" : "items-start"}`} style={{ maxWidth: "calc(100% - 48px)" }}>
                    {msg.role === "assistant" && msg.thinking && <ThinkingBlock thinking={msg.thinking} isStreaming={false} />}
                    <div className={`rounded-2xl px-4 py-2.5 break-words ${msg.role === "user" ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-br-md shadow-sm" : "bg-white dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 border border-amber-100 dark:border-amber-800 rounded-bl-md shadow-sm"}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.createdAt && <span className="text-[10px] text-amber-400/80 dark:text-amber-600 mt-1 px-1 flex-shrink-0">{formatMessageTime(msg.createdAt)}</span>}
                  </div>
                </motion.div>
              ))}

              {/* Live streaming bubble */}
              {isThisStreaming && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={classyFast} className="flex items-start gap-2 w-full flex-row">
                  <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex flex-col min-w-0" style={{ maxWidth: "calc(100% - 48px)" }}>
                    {streamingThinking && <ThinkingBlock thinking={streamingThinking} isStreaming={!streamingContent} />}
                    <div className="bg-white dark:bg-amber-900/60 border border-amber-100 dark:border-amber-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      {streamingContent ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed break-words text-amber-950 dark:text-amber-100">
                          {streamingContent}<BlinkingCursor />
                        </p>
                      ) : (
                        <div className="flex gap-1.5 items-center h-4">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={classyEase} className="flex-shrink-0 px-4 pt-2 pb-3" style={{ zIndex: 2 }}>
        <div className="max-w-2xl mx-auto w-full">
          <form onSubmit={onSubmit}>
            <div className="input-glow bg-white/90 dark:bg-amber-900/60 rounded-2xl border border-amber-200/60 dark:border-amber-700/40 transition-shadow duration-200 overflow-hidden">
              <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={isThisStreaming ? "Generating response..." : "Type your message..."}
                disabled={isThisStreaming}
                className="msg-scroll w-full px-4 pt-3 pb-2 bg-transparent text-amber-950 dark:text-amber-100 placeholder:text-amber-500/60 dark:placeholder:text-amber-400/40 outline-none resize-none text-sm font-medium max-h-[100px] overflow-y-auto leading-relaxed"
                rows={1}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }} />
              <div className="flex items-center justify-between px-3 py-2 border-t border-amber-100/50 dark:border-amber-800/30">
                <div className="flex items-center gap-1">
                  <motion.button type="button" whileHover={{ scale: 1.1, backgroundColor: "rgba(217,119,6,0.07)" }} whileTap={{ scale: 0.92 }} transition={classyFast} className="p-2 rounded-xl transition-colors" disabled={isThisStreaming}>
                    <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </motion.button>
                  <motion.button type="button" whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "rgba(217,119,6,0.07)" }} whileTap={{ scale: 0.92 }} transition={{ type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.22 }} className="p-2 rounded-xl transition-colors" disabled={isThisStreaming}>
                    <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </motion.button>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button type="button" ref={modelButtonRef} onClick={() => setIsModelSelectorOpen(true)}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(217,119,6,0.06)" }} whileTap={{ scale: 0.98 }} transition={classyFast}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 rounded-xl transition-colors" disabled={isThisStreaming}>
                    {activeModelName || modelName}
                    <motion.span animate={{ rotate: isModelSelectorOpen ? 270 : 90 }} transition={classyFast} style={{ display: "inline-flex" }}>
                      <ChevronRight className="w-3 h-3" />
                    </motion.span>
                  </motion.button>
                  <motion.button type="submit" disabled={!input.trim() || isThisStreaming}
                    whileHover={input.trim() && !isThisStreaming ? { scale: 1.07 } : {}} whileTap={input.trim() && !isThisStreaming ? { scale: 0.93 } : {}} transition={classyFast}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${input.trim() && !isThisStreaming ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md cursor-pointer" : "bg-amber-100 dark:bg-amber-800/50 text-amber-400/50 cursor-not-allowed"}`}>
                    {isThisStreaming ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
          <p className="text-center text-[10px] text-amber-500 dark:text-amber-600 mt-2">CodaAI can make mistakes. Consider checking important info.</p>
        </div>
      </motion.div>

      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setIsModelSelectorOpen(false)} selectedModel={selectedModel} onSelectModel={handleModelSelect} triggerRef={modelButtonRef} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={shareUrl} onShare={handleShare} onUnshare={handleUnshare} isShared={isConversationShared} />
    </div>
  );
}