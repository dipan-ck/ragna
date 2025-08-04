"use client"

import { useState, useCallback, useEffect } from "react"
import { useGetChats } from "@/lib/hooks/useGetChats"
import type { Message } from "../chat-section"

export function useChatMessages(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [oldestChatDate, setOldestChatDate] = useState<string | null>(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)

  // Fetch initial chats
  const { data: initialChats, isLoading } = useGetChats(projectId, undefined, 20)

  // Initialize messages from chats
  useEffect(() => {
    if (initialChats?.length > 0) {
      const formatted: Message[] = initialChats.flatMap((chat) => [
        {
          id: `${chat._id}-user`,
          sender: "user" as const,
          content: chat.question,
          timestamp: new Date(chat.createdAt),
        },
        {
          id: `${chat._id}-bot`,
          sender: "bot" as const,
          content: chat.answer,
          timestamp: new Date(chat.createdAt),
        },
      ])

      setMessages(formatted)
      const oldestChat = initialChats[initialChats.length - 1]
      setOldestChatDate(oldestChat?.createdAt || null)
    }
  }, [initialChats])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const updateLastMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)))
  }, [])

  const loadOlderMessages = useCallback(async () => {
    if (!oldestChatDate || isLoadingOlder) return

    setIsLoadingOlder(true)
    try {
      // This would typically be another API call
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Failed to load older messages:", error)
    } finally {
      setIsLoadingOlder(false)
    }
  }, [oldestChatDate, isLoadingOlder])

  return {
    messages,
    addMessage,
    updateLastMessage,
    loadOlderMessages,
    isLoadingOlder,
    isLoading,
  }
}
