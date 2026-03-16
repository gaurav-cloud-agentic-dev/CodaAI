import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      activeChatId: null,

      // Streaming state
      isStreaming: false,
      streamingContent: "",
      streamingThinking: "",
      streamingConversationId: null,

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

      // Store the first message + model before the conversation is created
      setPendingMessage: (message, modelId, modelName) =>
        set({
          pendingMessage: message,
          pendingModelId: modelId,
          pendingModelName: modelName,
        }),

      // Clear after ChatView fires it — prevents re-firing on re-renders
      clearPendingMessage: () =>
        set({
          pendingMessage: null,
          pendingModelId: null,
          pendingModelName: null,
        }),
    }),
    {
      name: "chat-storage",
      partialize: () => ({}), // Nothing persisted — all state is ephemeral
    }
  )
);