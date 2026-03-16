import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// POST /api/messages/trim
// Body: { conversationId: string, afterMessageId: string }
// Deletes all messages created AFTER the anchor message in the conversation
export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { conversationId, afterMessageId } = await req.json();

    if (!conversationId || !afterMessageId) {
      return new Response("conversationId and afterMessageId are required", { status: 400 });
    }

    // Find the anchor message to get its createdAt timestamp
    const anchor = await prisma.message.findFirst({
      where: {
        id: afterMessageId,
        conversationId,
      },
      include: { conversation: { select: { userId: true } } },
    });

    if (!anchor) {
      return new Response("Anchor message not found", { status: 404 });
    }

    // Security: conversation must belong to this user
    if (anchor.conversation.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete all messages in this conversation created AFTER the anchor
    const { count } = await prisma.message.deleteMany({
      where: {
        conversationId,
        createdAt: { gt: anchor.createdAt },
      },
    });

    return Response.json({ deleted: count });
  } catch (err) {
    console.error("[POST /api/messages/trim]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}