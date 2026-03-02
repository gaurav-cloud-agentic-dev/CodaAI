import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      activeChatId: null,

      // Streaming state
      isStreaming: false,
      streamingContent: "",
      streamingThinking: "",       // CoT / reasoning text
      streamingConversationId: null,

      setActiveChatId: (chatId) => set({ activeChatId: chatId }),
      clearActiveChatId: () => set({ activeChatId: null }),
      getActiveChatId: () => get().activeChatId,

      // Start a new streaming session — reset all streaming state
      setStreaming: (conversationId) =>
        set({
          isStreaming: true,
          streamingContent: "",
          streamingThinking: "",
          streamingConversationId: conversationId,
        }),

      // Append a chunk to the visible response
      appendStreamingContent: (chunk) =>
        set((state) => ({ streamingContent: state.streamingContent + chunk })),

      // Append a chunk to the reasoning / CoT block
      appendStreamingThinking: (chunk) =>
        set((state) => ({ streamingThinking: state.streamingThinking + chunk })),

      // Reset everything when done
      stopStreaming: () =>
        set({
          isStreaming: false,
          streamingContent: "",
          streamingThinking: "",
          streamingConversationId: null,
        }),
    }),
    {
      name: "chat-storage",
      partialize: () => ({}), // Nothing persisted — streaming state is ephemeral
    }
  )
);