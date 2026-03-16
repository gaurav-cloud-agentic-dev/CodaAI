import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// PATCH /api/messages/[id]
// Body: { content: string }
export async function PATCH(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Next.js 15: params is a Promise — must be awaited
    const { id: messageId } = await params;
    const { content } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return new Response("Content is required", { status: 400 });
    }

    const existing = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: { select: { userId: true } } },
    });

    if (!existing) {
      return new Response("Message not found", { status: 404 });
    }

    if (existing.conversation.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    if (existing.role !== "user") {
      return new Response("Only user messages can be edited", { status: 400 });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { content: content.trim() },
    });

    return Response.json({ message: updated });
  } catch (err) {
    console.error("[PATCH /api/messages/[id]]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}