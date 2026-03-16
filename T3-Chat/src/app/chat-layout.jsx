"use client";

import { LanguageProvider } from "@/modules/chat/LanguageSettings";
import SideBar from "@/modules/chat/side-bar";
import MainChatPage from "@/modules/chat/main-chat-page";
import ChatViewWrapper from "@/modules/chat/chat-view-wrapper";

export default function ChatLayout() {
  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden">
        <SideBar />
        <div className="flex-1 relative">
          <MainChatPage />
          <ChatViewWrapper />
        </div>
      </div>
    </LanguageProvider>
  );
}