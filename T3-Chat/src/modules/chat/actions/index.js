"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Initialize a new chat conversation
 */
export async function initializeChat(data) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized - Please login to continue",
      };
    }

    const { content, modelId, modelName } = data;

    if (!content || !modelId || !modelName) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const lineCount = content.split("\n").length;
    if (lineCount > 600) {
      return {
        success: false,
        error: "Message exceeds 600 line limit",
        exceedsLimit: true,
      };
    }

    let title = content.substring(0, 50).trim();
    if (content.length > 50) {
      title += "...";
    }

    const conversation = await prisma.$transaction(async (tx) => {
      const newConversation = await tx.conversation.create({
        data: {
          title,
          userId: session.user.id,
          modelId,
          modelName,
          lastMessageAt: new Date(),
        },
      });

      await tx.message.create({
        data: {
          conversationId: newConversation.id,
          userId: session.user.id,
          role: "user",
          content,
          messageType: "normal",
        },
      });

      return newConversation;
    });

    return {
      success: true,
      conversationId: conversation.id,
      title: conversation.title,
    };
  } catch (error) {
    console.error("Error initializing chat:", error);
    return {
      success: false,
      error: error.message || "Failed to initialize chat",
    };
  }
}

/**
 * Send a message in an existing conversation
 */
export async function sendMessage(data) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { conversationId, content } = data;

    if (!conversationId || !content) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const lineCount = content.split("\n").length;
    if (lineCount > 600) {
      return {
        success: false,
        error: "Message exceeds 600 line limit",
        exceedsLimit: true,
      };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return {
        success: false,
        error: "Conversation not found",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          conversationId,
          userId: session.user.id,
          role: "user",
          content,
          messageType: "normal",
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { 
          lastMessageAt: new Date(), 
          updatedAt: new Date() 
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error.message || "Failed to send message",
    };
  }
}

/**
 * Get all conversations for the current user
 */
export async function getUserConversations() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
        conversations: [],
      };
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      orderBy: [
        { isPinned: "desc" },
        { lastMessageAt: "desc" },
      ],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      take: 100,
    });

    return {
      success: true,
      conversations: conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        modelName: conv.modelName,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
        isPinned: conv.isPinned,
        messageCount: conv._count.messages,
        lastMessage: conv.messages[0]?.content?.substring(0, 100) || "",
      })),
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch conversations",
      conversations: [],
    };
  }
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(conversationId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
        messages: [],
      };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return {
        success: false,
        error: "Conversation not found",
        messages: [],
      };
    }

    return {
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        modelId: conversation.modelId,
        modelName: conversation.modelName,
      },
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch messages",
      messages: [],
    };
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return {
        success: false,
        error: "Chat not found",
      };
    }

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return {
      success: true,
      message: "Chat deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return {
      success: false,
      error: error.message || "Failed to delete chat",
    };
  }
}

/**
 * Toggle pin status of a conversation
 */
export async function togglePinConversation(conversationId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
    });

    if (!conversation) {
      return {
        success: false,
        error: "Chat not found",
      };
    }

    const updated = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        isPinned: !conversation.isPinned,
      },
    });

    return {
      success: true,
      isPinned: updated.isPinned,
      message: updated.isPinned ? "Chat pinned" : "Chat unpinned",
    };
  } catch (error) {
    console.error("Error toggling pin:", error);
    return {
      success: false,
      error: error.message || "Failed to pin/unpin chat",
    };
  }
}