import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      activeChatId: null,

      // Sidebar state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Streaming state
      isStreaming: false,
      streamingContent: "",
      streamingThinking: "",
      streamingConversationId: null,

      // Partial content saved on stop
      partialContent: null,
      partialThinking: null,

      // Pending message — set before chat is created, read by ChatView on mount
      pendingMessage: null,
      pendingModelId: null,
      pendingModelName: null,

      setActiveChatId: (chatId) => set({ activeChatId: chatId }),
      clearActiveChatId: () => set({ activeChatId: null }),
      getActiveChatId: () => get().activeChatId,

      setStreaming: (conversationId) =>
        set({
          isStreaming: true,
          streamingContent: "",
          streamingThinking: "",
          streamingConversationId: conversationId,
        }),

      appendStreamingContent: (chunk) =>
        set((state) => ({ streamingContent: state.streamingContent + chunk })),

      appendStreamingThinking: (chunk) =>
        set((state) => ({ streamingThinking: state.streamingThinking + chunk })),

      stopStreaming: () =>
        set({
          isStreaming: false,
          streamingContent: "",
          streamingThinking: "",
          streamingConversationId: null,
        }),

      // Save partial content then stop — used when user clicks stop button
      saveAndStopStreaming: () =>
        set((state) => ({
          isStreaming: false,
          streamingContent: "",
          streamingThinking: "",
          streamingConversationId: null,
          partialContent: state.streamingContent || null,
          partialThinking: state.streamingThinking || null,
        })),

      clearPartial: () => set({ partialContent: null, partialThinking: null }),

      setPendingMessage: (message, modelId, modelName) =>
        set({
          pendingMessage: message,
          pendingModelId: modelId,
          pendingModelName: modelName,
        }),

      clearPendingMessage: () =>
        set({
          pendingMessage: null,
          pendingModelId: null,
          pendingModelName: null,
        }),
    }),
    {
      name: "chat-storage",
      partialize: () => ({}),
    }
  )
);