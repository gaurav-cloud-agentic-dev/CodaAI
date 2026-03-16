"use client";

import { useChatStore } from "./store/chat-store";
import ChatView from "./chat-view";

export default function ChatViewWrapper() {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const pendingMessage = useChatStore((state) => state.pendingMessage);
  const pendingModelId = useChatStore((state) => state.pendingModelId);
  const pendingModelName = useChatStore((state) => state.pendingModelName);

  if (!activeChatId) {
    return null;
  }

  return (
    <ChatView
      initialChatId={activeChatId}
      pendingMessage={pendingMessage}
      pendingModelId={pendingModelId}
      pendingModelName={pendingModelName}
    />
  );
}