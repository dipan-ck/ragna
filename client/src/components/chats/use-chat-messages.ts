"use client"

import { useState, useCallback, useEffect } from "react"
import { useGetChats } from "@/lib/hooks/useGetChats"
import type { Message } from "./chat-section"

interface Chat {
  _id: string
  question: string
  answer: string
  createdAt: string
  userId: string
  projectId: string
}

export function useChatMessages(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [oldestChatDate, setOldestChatDate] = useState<string | null>(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Fetch initial chats
  const { data: initialChats, isLoading, error } = useGetChats(projectId, undefined, 20)

  // Debug logging
  useEffect(() => {
    console.log('🔍 Chat Hook Debug:', {
      projectId,
      initialChats,
      isLoading,
      error,
      messagesCount: messages.length
    })
  }, [projectId, initialChats, isLoading, error, messages.length])

  // Initialize messages from chat history
  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Loading chats...')
      return
    }

    if (error) {
      console.error('❌ Error loading chats:', error)
      return
    }

    if (initialChats) {
      console.log('📦 Initial chats received:', initialChats.length, initialChats)
      
      if (initialChats.length > 0) {
        // Convert chat history to message format
        const formatted: Message[] = initialChats.flatMap((chat: Chat) => [
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

        console.log('✅ Formatted messages:', formatted.length, formatted)
        setMessages(formatted)
        
        // Track oldest chat for pagination
        const oldestChat = initialChats[initialChats.length - 1]
        setOldestChatDate(oldestChat?.createdAt || null)
        
        // Check if there might be more messages
        setHasMore(initialChats.length >= 20)
      } else {
        console.log('📭 No chats found for this project')
        setMessages([])
        setHasMore(false)
      }
    }
  }, [initialChats, isLoading, error])

  const addMessage = useCallback((message: Message) => {
    console.log('➕ Adding message:', message)
    setMessages((prev) => [...prev, message])
  }, [])

  const updateLastMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)))
  }, [])

  const loadOlderMessages = useCallback(async () => {
    if (!oldestChatDate || isLoadingOlder || !hasMore) {
      console.log('⏸️  Cannot load older messages:', { oldestChatDate, isLoadingOlder, hasMore })
      return
    }

    console.log('📥 Loading older messages before:', oldestChatDate)
    setIsLoadingOlder(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get-chats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          projectId, 
          before: oldestChatDate, 
          limit: 20 
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to load older messages: ${response.status}`)
      }

      const result = await response.json()
      const olderChats = result.data

      console.log('📬 Older chats received:', olderChats?.length, olderChats)

      if (olderChats && olderChats.length > 0) {
        // Convert to message format
        const formatted: Message[] = olderChats.flatMap((chat: Chat) => [
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

        // Prepend older messages
        setMessages((prev) => [...formatted, ...prev])
        
        // Update oldest chat date
        const newOldest = olderChats[olderChats.length - 1]
        setOldestChatDate(newOldest?.createdAt || null)
        
        // Check if there are more messages
        setHasMore(olderChats.length >= 20)
        
        console.log('✅ Loaded', formatted.length, 'older messages')
      } else {
        console.log('📭 No more older messages')
        setHasMore(false)
      }
    } catch (error) {
      console.error('❌ Failed to load older messages:', error)
    } finally {
      setIsLoadingOlder(false)
    }
  }, [projectId, oldestChatDate, isLoadingOlder, hasMore])

  return {
    messages,
    addMessage,
    updateLastMessage,
    loadOlderMessages,
    isLoadingOlder,
    isLoading,
    hasMore,
  }
}
