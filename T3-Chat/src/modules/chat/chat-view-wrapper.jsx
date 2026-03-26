"use client";

import { useChatStore } from "./store/chat-store";
import ChatView from "./chat-view";

export default function ChatViewWrapper() {
  const activeChatId    = useChatStore((state) => state.activeChatId);
  const pendingMessage  = useChatStore((state) => state.pendingMessage);
  const pendingModelId  = useChatStore((state) => state.pendingModelId);
  const pendingModelName = useChatStore((state) => state.pendingModelName);

  return (
    <div style={{
      position: "absolute", inset: 0,
      opacity: activeChatId ? 1 : 0,
      pointerEvents: activeChatId ? "auto" : "none",
      transition: "opacity 0.15s ease",
      zIndex: activeChatId ? 1 : -1,
      background: "var(--page-bg)",   // ← add this one line
    }}>
      {activeChatId && (
        <ChatView
          key="stable-chat-view"
          initialChatId={activeChatId}
          pendingMessage={pendingMessage}
          pendingModelId={pendingModelId}
          pendingModelName={pendingModelName}
        />
      )}
    </div>
  );
}