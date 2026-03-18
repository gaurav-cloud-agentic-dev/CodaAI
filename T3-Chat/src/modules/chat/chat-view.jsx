"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bot, User, Mic, ChevronDown, ArrowDown,
  AlertCircle, Brain,
} from "lucide-react";
import { useChatStore } from "./store/chat-store";
import { useConversationMessages } from "./hooks/chat";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import ModelSelector from "./model-selector";
import ModelRacePopup from "./model-race-popup";
import { useLanguage } from "./LanguageSettings";
import { UserMessage, MessageSectionRefresh } from "./chat-form";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import StopButton from "./stop-button";
import FileUploadManager, { FilePreviewStrip, useFileUpload } from "./file-upload-manager";
import { useInputIntelligence, GhostSuggestion, CorrectionsBar, TabHint } from "./input-intelligence";

const classyEase = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.38 };
const classyFast = { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.22 };


function decodeB64(b64) {
  try { return Buffer.from(b64, "base64").toString("utf8"); }
  catch { return ""; }
}

function BlinkingCursor({ thin = false }) {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear", times: [0, 0.45, 0.5, 1] }}
      style={{
        display: "inline-block",
        width: 2, height: thin ? 14 : 16,
        background: "rgba(0,0,0,0.55)",
        marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1,
      }}
    />
  );
}

function ThinkingBlock({ thinking, isStreaming = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!thinking) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setIsExpanded(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)",
          fontFamily: "'Inter', sans-serif", transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(0,0,0,0.70)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(0,0,0,0.45)"}
      >
        <Brain style={{ width: 13, height: 13 }} />
        <span>{isStreaming ? "Thinking..." : "Thought process"}</span>
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.35)", display: "inline-block", marginLeft: 2 }}
          />
        )}
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={classyFast} style={{ marginLeft: 2, display: "inline-flex" }}>
          <ChevronDown style={{ width: 12, height: 12 }} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={classyEase}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              marginTop: 8, padding: "10px 14px", borderRadius: 12,
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.07)",
              maxHeight: 256, overflowY: "auto",
            }}>
              <p style={{
                fontSize: 11.5, color: "rgba(0,0,0,0.55)",
                whiteSpace: "pre-wrap", lineHeight: 1.6,
                fontFamily: "monospace", margin: 0,
              }}>
                {thinking}{isStreaming && <BlinkingCursor thin />}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatView({ initialChatId, pendingMessage, pendingModelId, pendingModelName }) {
  const { t } = useLanguage();

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [raceQuery, setRaceQuery] = useState(null);
  const [selectedModel, setSelectedModel] = useState(
    pendingModelId ? { id: pendingModelId, name: pendingModelName } : { id: null, name: null }
  );
  const [input, setInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [refreshingMessageId, setRefreshingMessageId] = useState(null);
  const [isSectionRefreshing, setIsSectionRefreshing] = useState(false);
  const { files, setFiles, clearFiles, getFilePayload } = useFileUpload();
  const {
    inlineSuggestion,
    corrections,
    isLoadingSuggestion,
    isLoadingCorrections,
    handleKeyDown: handleIntelliKeyDown,
    acceptCorrection,
    dismissCorrection,
  } = useInputIntelligence(input, (val) => setInput(val));
  


  const pendingFiredRef = useRef(false);
  const isAtBottomRef = useRef(true);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modelButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    setActiveChatId, setStreaming, appendStreamingContent, appendStreamingThinking,
    stopStreaming, saveAndStopStreaming, clearPartial,
    clearPendingMessage, isStreaming, streamingContent, streamingThinking, streamingConversationId,
  } = useChatStore();

  const queryClient = useQueryClient();
  const { data: conversationData, isLoading: loadingMessages } = useConversationMessages(initialChatId);

  const dbMessages = conversationData?.messages || [];
  const activeModelId = selectedModel.id || conversationData?.conversation?.modelId;
  const activeModelName = selectedModel.id
    ? selectedModel.name
    : (conversationData?.conversation?.modelName || t.selectModel);

  const isThisStreaming = isStreaming && streamingConversationId === initialChatId;
  const allMessages = optimisticMessage ? [...dbMessages, optimisticMessage] : dbMessages;

  const checkIfAtBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const snapToBottom = useCallback(() => {
    isAtBottomRef.current = true;
    setShowScrollBtn(false);
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    isAtBottomRef.current = true;
    setShowScrollBtn(false);
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = 0;
  }, [initialChatId]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom = checkIfAtBottom();
      isAtBottomRef.current = atBottom;
      setShowScrollBtn(!atBottom);
    };

    const onWheel = (e) => {
      if (e.deltaY < 0) {
        isAtBottomRef.current = false;
        setShowScrollBtn(true);
      }
    };

    let touchStartY = 0;

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (e.touches[0].clientY > touchStartY) {
        isAtBottomRef.current = false;
        setShowScrollBtn(true);
      }
      touchStartY = e.touches[0].clientY;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [checkIfAtBottom]);

  useEffect(() => {
    if (isAtBottomRef.current) {
      const el = messagesContainerRef.current;
      if (!el) return;
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distFromBottom < 40) el.scrollTop = el.scrollHeight;
    }
  }, [streamingContent, streamingThinking]); // eslint-disable-line

  useEffect(() => {
    if (isAtBottomRef.current) scrollToBottom();
  }, [allMessages.length]); // eslint-disable-line

  useEffect(() => {
    if (!loadingMessages && allMessages.length > 0) {
      const el = messagesContainerRef.current;
      if (!el) return;
      const raf = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
      return () => cancelAnimationFrame(raf);
    }
  }, [loadingMessages, initialChatId]); // eslint-disable-line

  useEffect(() => { if (initialChatId) setActiveChatId(initialChatId); }, [initialChatId, setActiveChatId]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const streamResponse = useCallback(async ({
    content, previousMessages, modelId, modelName, skipSaveUserMessage = false,
  }) => {
    setStreaming(initialChatId);
    snapToBottom();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: initialChatId, content, modelId, modelName, previousMessages, skipSaveUserMessage }),
    });
    if (!res.ok) {
      const errText = await res.text();
      try {
        const p = JSON.parse(errText);
        if (p?.error?.code === 429) throw new Error("Model is busy — please retry or switch models");
        throw new Error(p?.error?.metadata?.raw || p?.error?.message || errText);
      } catch (pe) {
        if (pe.message.includes("busy") || pe.message.includes("rate")) throw pe;
        throw new Error(errText || "Failed to get response");
      }
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // If user stopped, cancel the reader and break cleanly
      if (!useChatStore.getState().isStreaming) {
        await reader.cancel();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("T:")) { const chunk = decodeB64(line.slice(2)); if (chunk) appendStreamingThinking(chunk); }
        else if (line.startsWith("C:")) { const chunk = decodeB64(line.slice(2)); if (chunk) appendStreamingContent(chunk); }
      }
    }
    await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
    await queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [initialChatId, setStreaming, snapToBottom, appendStreamingThinking, appendStreamingContent, queryClient]);

  useEffect(() => {
    if (!pendingMessage || pendingFiredRef.current || loadingMessages || isThisStreaming) return;
    const modelId = pendingModelId || activeModelId;
    if (!modelId) return;
    pendingFiredRef.current = true;
    const previousMessages = dbMessages.map(m => ({ role: m.role, content: m.content }));
    const fire = async () => {
      try {
        await streamResponse({ content: pendingMessage, previousMessages, modelId, modelName: pendingModelName || activeModelName, skipSaveUserMessage: true });
      } catch (err) {
        toast.error(err.message || "Failed to get AI response");
        console.error(err);
      } finally {
        stopStreaming();
        if (typeof clearPendingMessage === "function") clearPendingMessage();
      }
    };
    fire();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessages]);

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isThisStreaming) return;
    if (input.split("\n").length > 600) {
      toast.error("Message exceeds 600 line limit", { duration: 3000, icon: <AlertCircle style={{ width: 16, height: 16 }} /> });
      return;
    }
    if (!activeModelId) {
      toast.error(t.selectModel, { icon: <AlertCircle style={{ width: 16, height: 16 }} /> });
      return;
    }
    setRaceQuery(input.trim());
    setInput("");
    clearFiles(); // ← clear files after submit
  };

  const handleRaceSelect = useCallback(async (chosenResponse, chosenModel) => {
    setRaceQuery(null);
    const queryText = raceQuery || "";
    setOptimisticMessage({ role: "user", content: queryText, createdAt: new Date().toISOString() });
    const previousMessages = dbMessages.map(m => ({ role: m.role, content: m.content }));
    try {
      await streamResponse({ content: queryText, previousMessages, modelId: activeModelId, modelName: chosenModel?.label || activeModelName, overrideResponse: chosenResponse });
    } catch (err) {
      toast.error(err.message || "Failed to send response");
      console.error(err);
    } finally {
      setOptimisticMessage(null);
      stopStreaming();
    }
  }, [raceQuery, dbMessages, activeModelId, activeModelName, streamResponse, stopStreaming]);

  const submitDirect = useCallback(async (queryText) => {
    if (!queryText?.trim() || isThisStreaming) return;
    setOptimisticMessage({ role: "user", content: queryText, createdAt: new Date().toISOString() });
    const previousMessages = dbMessages.map(m => ({ role: m.role, content: m.content }));
    try {
      await streamResponse({ content: queryText, previousMessages, modelId: activeModelId, modelName: activeModelName });
    } catch (err) {
      toast.error(err.message || "Failed to get AI response");
      console.error(err);
    } finally {
      setOptimisticMessage(null);
      stopStreaming();
    }
  }, [isThisStreaming, dbMessages, activeModelId, activeModelName, streamResponse, stopStreaming]);

  const handleEditMessage = useCallback(async (messageId, newContent) => {
    if (isThisStreaming) { toast.error("Please wait for the current response to finish."); return; }
    try {
      const patchRes = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (!patchRes.ok) throw new Error(`Save edit failed (${patchRes.status}): ${await patchRes.text()}`);
      const editedIndex = dbMessages.findIndex(m => m.id === messageId);
      const previousMessages = dbMessages.slice(0, editedIndex).map(m => ({ role: m.role, content: m.content }));
      const trimRes = await fetch(`/api/messages/trim`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: initialChatId, afterMessageId: messageId }),
      });
      if (!trimRes.ok) throw new Error(`Trim failed (${trimRes.status}): ${await trimRes.text()}`);
      await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
      await streamResponse({ content: newContent, previousMessages, modelId: activeModelId, modelName: activeModelName, skipSaveUserMessage: true });
    } catch (err) {
      toast.error(err.message || "Failed to edit message");
      console.error("[handleEditMessage]", err);
    } finally { stopStreaming(); }
  }, [isThisStreaming, initialChatId, dbMessages, queryClient, streamResponse, activeModelId, activeModelName, stopStreaming]);

  const handleRefreshMessage = useCallback(async (messageId) => {
    if (isThisStreaming) { toast.error("Please wait for the current response to finish."); return; }
    setRefreshingMessageId(messageId);
    try {
      const targetIndex = dbMessages.findIndex(m => m.id === messageId);
      const targetMessage = dbMessages[targetIndex];
      if (!targetMessage) throw new Error("Message not found in current messages");
      const previousMessages = dbMessages.slice(0, targetIndex).map(m => ({ role: m.role, content: m.content }));
      const trimRes = await fetch(`/api/messages/trim`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: initialChatId, afterMessageId: messageId }),
      });
      if (!trimRes.ok) throw new Error(`Trim failed (${trimRes.status}): ${await trimRes.text()}`);
      await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
      await streamResponse({ content: targetMessage.content, previousMessages, modelId: activeModelId, modelName: activeModelName, skipSaveUserMessage: true });
    } catch (err) {
      toast.error(err.message || "Failed to retry message");
      console.error("[handleRefreshMessage]", err);
    } finally { setRefreshingMessageId(null); stopStreaming(); }
  }, [isThisStreaming, initialChatId, dbMessages, queryClient, streamResponse, activeModelId, activeModelName, stopStreaming]);

  const handleRefreshSection = useCallback(async () => {
    if (isThisStreaming) { toast.error("Please wait for the current response to finish."); return; }
    setIsSectionRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Messages refreshed");
    } catch (err) { toast.error("Failed to refresh messages"); }
    finally { setIsSectionRefreshing(false); }
  }, [isThisStreaming, initialChatId, queryClient]);

  const handleModelSelect = (model) => { setSelectedModel(model); setIsModelSelectorOpen(false); };

  const handleStop = useCallback(async () => {
    saveAndStopStreaming();
    await queryClient.invalidateQueries({ queryKey: ["conversation", initialChatId] });
    await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    clearPartial();
  }, [saveAndStopStreaming, clearPartial, queryClient, initialChatId]);

  const formatMessageTime = (date) => format(new Date(date), "MMM d, h:mm a");

  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        width: "100%", height: "100%", minHeight: 0, overflow: "hidden",
        position: "relative",
        fontFamily: "'Inter', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
        background: "#EBEBEB",
      }}
    >
      <style>{`
        html, body, #__next { height: 100%; overflow: hidden !important; }
        .cv-bg-a { position:absolute; inset:0; z-index:0; background:#EBEBEB; }
        .cv-bg-b { position:absolute; inset:0; z-index:1; overflow:hidden; pointer-events:none; }
        .cv-bg-c {
          position:absolute; inset:0; z-index:2;
          background:rgba(255,255,255,0.62);
          backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
        }
        .cv-scroll::-webkit-scrollbar { width: 4px; }
        .cv-scroll::-webkit-scrollbar-track { background: transparent; }
        .cv-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.45); border-radius: 99px; }
        .cv-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.65); }
        .cv-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.45) transparent; }
        .cv-input-wrap:focus-within {
          box-shadow: 0 0 0 2px rgba(59,158,255,0.22), 0 0 0 6px rgba(59,158,255,0.06),
            0 20px 56px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1) !important;
          border-color: rgba(59,158,255,0.35) !important;
        }
        .cv-input-wrap textarea::placeholder { color: rgba(0,0,0,0.32); }
      `}</style>

      {/* ── Background layers ── */}
      <div className="cv-bg-a" aria-hidden="true" />
      <div className="cv-bg-b" aria-hidden="true">
        <div style={{ position:"absolute", top:"-20%", left:"-15%", width:"60%", height:"65%", borderRadius:"50%", background:"rgba(199,210,254,0.18)", filter:"blur(100px)" }} />
        <div style={{ position:"absolute", top:"-15%", right:"-15%", width:"55%", height:"60%", borderRadius:"50%", background:"rgba(186,230,253,0.15)", filter:"blur(110px)" }} />
        <div style={{ position:"absolute", bottom:"-10%", left:"-10%", width:"50%", height:"55%", borderRadius:"50%", background:"rgba(221,214,254,0.14)", filter:"blur(105px)" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"50%", height:"55%", borderRadius:"50%", background:"rgba(253,213,200,0.12)", filter:"blur(105px)" }} />
      </div>
      <div className="cv-bg-c" aria-hidden="true" />

      {/* ── Messages + Floating Input ── */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, zIndex: 10 }}>
        <div
          ref={messagesContainerRef}
          className="cv-scroll"
          style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
        >
          <div style={{ width: "100%", padding: "24px 16px 360px" }}>

            <MessageSectionRefresh onRefresh={handleRefreshSection} isRefreshing={isSectionRefreshing} />

            {loadingMessages ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <motion.div
                    initial={false}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 22, height: 22,
                      border: "2px solid rgba(0,0,0,0.1)",
                      borderTopColor: "rgba(0,0,0,0.45)",
                      borderRadius: "50%",
                    }}
                  />
                  <p style={{ fontSize: 12, color: "rgba(0,0,0,0.35)", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                    Loading messages...
                  </p>
                </div>
              </div>
            ) : allMessages.length === 0 && !isThisStreaming ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.32)", fontFamily: "'Inter', sans-serif" }}>
                  {t.noChatsYet}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {allMessages.map((msg, index) => (
                  <div
                    key={msg.id || `msg-${index}`}
                    style={{
                      display: "flex", alignItems: "flex-end", gap: 8, width: "100%",
                      flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ flexShrink: 0, marginBottom: 4 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: msg.role === "user"
                          ? "rgba(255,255,255,0.72)"
                          : "rgba(255,255,255,0.55)",
                        border: "1px solid rgba(255,255,255,0.90)",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                      }}>
                        {msg.role === "user"
                          ? <User style={{ width: 13, height: 13, color: "rgba(0,0,0,0.55)" }} />
                          : <Bot style={{ width: 13, height: 13, color: "rgba(0,0,0,0.45)" }} />
                        }
                      </div>
                    </div>

                    {/* User message */}
                    {msg.role === "user" ? (
                      <UserMessage
                        message={msg}
                        onEdit={handleEditMessage}
                        onRefresh={handleRefreshMessage}
                        isRefreshing={refreshingMessageId === msg.id}
                      />
                    ) : (
                      <div style={{
                        display: "flex", flexDirection: "column",
                        minWidth: 0, flex: 1, alignItems: "flex-start",
                      }}>
                        {msg.thinking && <ThinkingBlock thinking={msg.thinking} isStreaming={false} />}
                        <div style={{
                          fontSize: 14, lineHeight: 1.75, color: "rgba(0,0,0,0.78)",
                          wordBreak: "break-word", maxWidth: "85%",
                          fontFamily: "'Inter', sans-serif",
                        }}>
                          <MarkdownRenderer content={msg.content} />
                        </div>
                        {msg.createdAt && (
                          <span style={{
                            fontSize: 10.5, color: "rgba(0,0,0,0.28)",
                            marginTop: 4, paddingLeft: 4,
                            fontFamily: "'Inter', sans-serif",
                          }}>
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Streaming assistant bubble */}
                {isThisStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={classyFast}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, width: "100%", flexDirection: "row" }}
                  >
                    <div style={{ flexShrink: 0, marginTop: 4 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.55)",
                        border: "1px solid rgba(255,255,255,0.90)",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                      }}>
                        <Bot style={{ width: 13, height: 13, color: "rgba(0,0,0,0.45)" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                      {streamingThinking && <ThinkingBlock thinking={streamingThinking} isStreaming={!streamingContent} />}
                      <div style={{
                        fontSize: 14, lineHeight: 1.75, color: "rgba(0,0,0,0.78)",
                        wordBreak: "break-word", maxWidth: "85%",
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {streamingContent ? (
                          <div style={{ wordBreak: "break-word" }}>
                            <MarkdownRenderer content={streamingContent} />
                            <BlinkingCursor />
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", height: 20 }}>
                            {[0, 0.15, 0.3].map((delay, i) => (
                              <motion.div key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
                                style={{ width: 6, height: 6, background: "rgba(0,0,0,0.25)", borderRadius: "50%" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} style={{ height: 1 }} />
              </div>
            )}
          </div>
        </div>

        {/* Scroll-to-bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={classyFast}
              style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 220, zIndex: 30 }}
            >
              <button
                onClick={snapToBottom}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "none", cursor: "pointer",
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)",
                  transition: "transform 0.14s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <ArrowDown style={{ width: 16, height: 16, color: "rgba(0,0,0,0.55)" }} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating Input ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <div style={{
            position: "absolute", insetInline: 0, top: -48, bottom: 0,
            pointerEvents: "none",
            background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 60%)",
          }} />

          <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", padding: "0 16px 16px", paddingTop: 16 }}>
            <div
              className="cv-input-wrap"
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.92)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* ← ADD THIS LINE */}
              <FilePreviewStrip files={files} onFilesChange={setFiles} disabled={isThisStreaming} />

              {/* ── Corrections bar ── */}
              {/* <CorrectionsBar
                corrections={corrections}
                onAccept={acceptCorrection}
                onDismiss={dismissCorrection}
                isLoading={isLoadingCorrections}
              /> */}

              {/* ── Textarea with ghost suggestion ── */}
              {/* {inlineSuggestion && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    pointerEvents: "none",
                    padding: "18px 22px 10px",
                    fontSize: 14, fontWeight: 400,
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "transparent",
                    zIndex: 1,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ visibility: "hidden" }}>{input}</span>
                  <span style={{ color: "rgba(0,0,0,0.28)" }}>{inlineSuggestion}</span>
                </div>
              )} */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isThisStreaming ? "Generating response..." : (t.placeholder || "Type your message…")}
                disabled={isThisStreaming}
                rows={1}
                className="cv-scroll"
                style={{
                  position: "relative", zIndex: 2,
                  display: "block", width: "100%",
                  padding: "18px 22px 10px",
                  background: "transparent", border: "none", outline: "none",
                  resize: "none", fontSize: 14, fontWeight: 400,
                  lineHeight: 1.6, color: "rgba(0,0,0,0.82)",
                  fontFamily: "'Inter', sans-serif",
                  caretColor: "#3B9EFF",
                  maxHeight: 160, overflowY: "auto", boxSizing: "border-box",
                  scrollbarWidth: "none",
                }}
                onKeyDown={e => {
                  handleIntelliKeyDown(e);
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
                }}
              />

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "2px 12px 14px",
              }}>
                {/* Left tools */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FileUploadManager
                    files={files}
                    onFilesChange={setFiles}
                    disabled={isThisStreaming}
                  />
                </div>

                {/* Right: model + send/stop */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

                  <TabHint visible={!!inlineSuggestion} isLoading={isLoadingSuggestion} />

                  <button
                    type="button" ref={modelButtonRef}
                    onClick={() => setIsModelSelectorOpen(true)}
                    disabled={isThisStreaming}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: "rgba(255,255,255,0.65)",
                      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.88)",
                      fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.72)",
                      fontFamily: "'Inter', sans-serif",
                      opacity: isThisStreaming ? 0.35 : 1,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,1)",
                      transition: "background 0.14s, box-shadow 0.14s, border-color 0.14s",
                      maxWidth: 140, overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      if (!isThisStreaming) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.90)";
                        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.65)";
                      e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.88)";
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {activeModelName}
                    </span>
                    <ChevronDown style={{ width: 11, height: 11, color: "rgba(0,0,0,0.45)", flexShrink: 0 }} strokeWidth={2.2} />
                  </button>

                  {/* Send / Stop — animated swap */}
                  <AnimatePresence mode="wait">
                    {isThisStreaming ? (
                      <StopButton key="stop" onStop={handleStop} />
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <button
                          onClick={onSubmit}
                          disabled={!input.trim()}
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: input.trim()
                              ? "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)"
                              : "rgba(0,0,0,0.07)",
                            opacity: input.trim() ? 1 : 0.35,
                            boxShadow: input.trim()
                              ? "0 6px 22px rgba(59,158,255,0.45), 0 2px 6px rgba(59,158,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                              : "none",
                            transition: "all 0.16s cubic-bezier(.34,1.56,.64,1)",
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => {
                            if (input.trim()) {
                              e.currentTarget.style.transform = "scale(1.08)";
                              e.currentTarget.style.boxShadow = "0 10px 30px rgba(59,158,255,0.55)";
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = input.trim()
                              ? "0 6px 22px rgba(59,158,255,0.45), 0 2px 6px rgba(59,158,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                              : "none";
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <p style={{
              textAlign: "center", marginTop: 8,
              fontSize: 11, color: "rgba(0,0,0,0.22)",
              letterSpacing: "0.03em", fontFamily: "'Inter', sans-serif",
            }}>
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>

      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={handleModelSelect}
        triggerRef={modelButtonRef}
      />
      <AnimatePresence>
        {raceQuery && (
          <ModelRacePopup
            query={raceQuery}
            onClose={() => setRaceQuery(null)}
            onUseResponse={handleRaceSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}