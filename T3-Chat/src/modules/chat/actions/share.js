"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function shareConversation(conversationId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    let shareId = conversation.shareId;

    if (!shareId) {
      shareId = nanoid(32);

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          shareId,
          isShared: true,
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { isShared: true },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/share/${shareId}`;

    return {
      success: true,
      shareUrl,
      shareId,
    };
  } catch (error) {
    console.error("Error sharing conversation:", error);
    return { success: false, error: "Failed to share conversation" };
  }
}

export async function unshareConversation(conversationId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isShared: false },
    });

    return { success: true, message: "Conversation unshared" };
  } catch (error) {
    console.error("Error unsharing conversation:", error);
    return { success: false, error: "Failed to unshare conversation" };
  }
}

export async function getSharedConversation(shareId) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        shareId,
        isShared: true,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return { success: false, error: "Shared conversation not found" };
    }

    return {
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        modelName: conversation.modelName,
        createdAt: conversation.createdAt,
        messages: conversation.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching shared conversation:", error);
    return { success: false, error: "Failed to fetch shared conversation" };
  }
}