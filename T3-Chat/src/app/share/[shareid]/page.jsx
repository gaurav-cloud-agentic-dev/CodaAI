import { notFound } from "next/navigation";
import { getSharedConversation } from "@/modules/chat/actions/share";
import SharedChatView from "@/modules/components/share-chat-view";

// Generate metadata for Open Graph
export async function generateMetadata({ params }) {
  const { shareId } = params;
  const result = await getSharedConversation(shareId);

  if (!result.success) {
    return {
      title: "Shared Chat Not Found",
    };
  }

  const { conversation } = result;
  const messagePreview = conversation.messages[0]?.content.slice(0, 150) || "View this conversation";

  return {
    title: `${conversation.title} - CodaAI Shared Chat`,
    description: messagePreview,
    openGraph: {
      title: conversation.title,
      description: messagePreview,
      type: "website",
      siteName: "CodaAI",
      images: [
        {
          url: "/og-image.png", // Create this image
          width: 1200,
          height: 630,
          alt: "CodaAI Chat",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: conversation.title,
      description: messagePreview,
      images: ["/og-image.png"],
    },
  };
}

export default async function SharedChatPage({ params }) {
  const { shareId } = params;
  const result = await getSharedConversation(shareId);

  if (!result.success) {
    notFound();
  }

  return <SharedChatView conversation={result.conversation} />;
}