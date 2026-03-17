import { notFound } from "next/navigation";
import { getSharedConversation } from "@/modules/chat/actions/share";
import SharedChatView from "@/modules/components/share-chat-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props) {
  const params = await props.params;
  const shareId = params.shareId;
  const result = await getSharedConversation(shareId);

  if (!result.success) {
    return { title: "Shared Chat Not Found" };
  }

  const { conversation } = result;
  const messagePreview = conversation.messages[0]?.content.slice(0, 150) || "View this conversation";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: `${conversation.title} - CodaAI Shared Chat`,
    description: messagePreview,
    openGraph: {
      title: conversation.title,
      description: messagePreview,
      type: "website",
      siteName: "CodaAI",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodaAI Chat" }],
    },
    twitter: {
      card: "summary_large_image",
      title: conversation.title,
      description: messagePreview,
      images: ["/og-image.png"],
    },
  };
}

export default async function SharedChatPage(props) {
  const params = await props.params;
  const shareId = params.shareId;

  const result = await getSharedConversation(shareId);

  if (!result.success) {
    notFound();
  }

  return <SharedChatView key={shareId} conversation={result.conversation} />;
}