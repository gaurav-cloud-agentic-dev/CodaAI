import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SideBar from "@/modules/chat/side-bar";
import ChatView from "@/modules/chat/chat-view";

export default async function ChatPage({ params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  const { chatId } = await params;

  // Verify the conversation exists and belongs to the user
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: chatId,
      userId: session.user.id,
    },
  });

  if (!conversation) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <ChatView initialChatId={chatId} />
    </div>
  );
}