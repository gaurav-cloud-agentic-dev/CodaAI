import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SideBar from "@/modules/chat/side-bar";
import MainChatPage from "@/modules/chat/main-chat-page";
import ChatViewWrapper from "@/modules/chat/chat-view-wrapper";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 relative">
        <MainChatPage />
        <ChatViewWrapper />
      </div>
    </div>
  );
}