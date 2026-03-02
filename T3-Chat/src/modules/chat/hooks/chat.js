"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initializeChat,
  sendMessage,
  getUserConversations,
  getConversationMessages,
  deleteConversation,
  togglePinConversation,
} from "../actions";
import { toast } from "sonner";
import { useChatStore } from "../store/chat-store";

/**
 * Hook to initialize a new chat
 */
export function useInitializeChat() {
  const queryClient = useQueryClient();
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);

  return useMutation({
    mutationFn: async (data) => {
      return await initializeChat(data);
    },
    onSuccess: (data) => {
      if (data.success && data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        setActiveChatId(data.conversationId);
        toast.success("Chat started!");
      } else if (data.exceedsLimit) {
        toast.error("Message exceeds 600 line limit");
      } else {
        toast.error(data.error || "Failed to start chat");
      }
    },
    onError: (error) => {
      console.error("Error initializing chat:", error);
      toast.error("An error occurred");
    },
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await sendMessage(data);
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", variables.conversationId],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        toast.success("Message sent!");
      } else if (data.exceedsLimit) {
        toast.error("Message exceeds 600 line limit");
      } else {
        toast.error(data.error || "Failed to send message");
      }
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    },
  });
}

/**
 * Hook to fetch user conversations
 */
export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const result = await getUserConversations();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.conversations;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch conversation messages
 */
export function useConversationMessages(conversationId) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const result = await getConversationMessages(conversationId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    enabled: !!conversationId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to delete a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { activeChatId, setActiveChatId } = useChatStore();

  return useMutation({
    mutationFn: async (conversationId) => {
      return await deleteConversation(conversationId);
    },
    onSuccess: (data, conversationId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        if (activeChatId === conversationId) {
          setActiveChatId(null);
        }
        toast.success("Chat deleted");
      } else {
        toast.error(data.error || "Failed to delete chat");
      }
    },
    onError: (error) => {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    },
  });
}

/**
 * Hook to toggle pin status
 */
export function useTogglePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      return await togglePinConversation(conversationId);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        toast.success(data.message);
      } else {
        toast.error(data.error || "Failed to pin/unpin chat");
      }
    },
    onError: (error) => {
      console.error("Error toggling pin:", error);
      toast.error("Failed to pin/unpin chat");
    },
  });
}