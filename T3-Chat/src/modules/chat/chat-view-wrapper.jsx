"use client";

import { useChatStore } from "./store/chat-store";
import ChatView from "./chat-view";

export default function ChatViewWrapper() {
  const activeChatId = useChatStore((state) => state.activeChatId);

  if (!activeChatId) {
    return null;
  }

  return <ChatView initialChatId={activeChatId} />;
}