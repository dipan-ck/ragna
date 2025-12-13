"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatContainer } from "./chat-container"
import { ChatInput } from "./chat-input"
import { useChatMessages } from "./use-chat-messages"
import { useChatScroll } from "./use-chat-scroll"

export interface Message {
  id: string
  sender: "user" | "bot"
  content: string
  timestamp: Date
}



export default function ChatSection({ project }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Custom hooks for better separation of concerns
  const { messages, addMessage, updateLastMessage, loadOlderMessages, isLoadingOlder, isLoading: isLoadingHistory, hasMore } = useChatMessages(project._id)

  const { chatContainerRef, scrollToBottom, showScrollButton } = useChatScroll(messages, isLoading)

  // Debug logging
  useEffect(() => {
    console.log('💬 ChatSection:', {
      projectId: project._id,
      messagesCount: messages.length,
      isLoadingHistory,
      hasMore
    })
  }, [project._id, messages.length, isLoadingHistory, hasMore])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return

      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: message.trim(),
        timestamp: new Date(),
      }

      addMessage(userMessage)
      setInput("")
      setIsLoading(true)

      // Add placeholder bot message
      const botMessageId = (Date.now() + 1).toString()
      const botMessage: Message = {
        id: botMessageId,
        sender: "bot",
        content: "",
        timestamp: new Date(),
      }
      addMessage(botMessage)

      // Create abort controller for request cancellation
      const abortController = new AbortController()
      const timeoutId = setTimeout(() => abortController.abort(), 60000) // 60s timeout

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/${project._id}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${project.apiKey}`,
          },
          body: JSON.stringify({ message: message.trim() }),
          signal: abortController.signal,
          credentials: "include",
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }

        if (!response.body) {
          throw new Error("Response body is null")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedResponse = ""
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              console.log("Stream completed")
              break
            }

            // Decode chunk and add to buffer
            buffer += decoder.decode(value, { stream: true })
            
            // Split by double newline to get individual SSE messages
            const messages = buffer.split("\n\n")
            
            // Keep the last incomplete message in buffer
            buffer = messages.pop() || ""

            // Process complete messages
            for (const msg of messages) {
              if (!msg.trim() || !msg.startsWith("data: ")) continue

              try {
                const jsonStr = msg.slice(6) // Remove "data: " prefix
                const jsonData = JSON.parse(jsonStr)

                switch (jsonData.type) {
                  case "connection":
                    console.log("SSE connection established")
                    break

                  case "chunk":
                    accumulatedResponse += jsonData.content
                    updateLastMessage(botMessageId, accumulatedResponse)
                    break

                  case "complete":
                    // Use the full content from server as final message
                    if (jsonData.fullContent) {
                      updateLastMessage(botMessageId, jsonData.fullContent)
                    }
                    console.log(`Stream complete: ${jsonData.totalChunks} chunks received`)
                    break

                  case "error":
                    console.error("Server error:", jsonData.message)
                    updateLastMessage(botMessageId, `❌ ${jsonData.message}`)
                    break

                  case "done":
                    console.log("Streaming finished")
                    break

                  default:
                    console.warn("Unknown message type:", jsonData.type)
                }
              } catch (parseError) {
                console.error("Failed to parse SSE message:", msg, parseError)
              }
            }
          }
        } finally {
          reader.releaseLock()
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.error("Chat error:", error)
        
        let errorMessage = "❌ Failed to connect to the AI model. Please try again."
        
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = "❌ Request timeout. Please try again."
          } else if (error.message.includes("fetch")) {
            errorMessage = "❌ Network error. Please check your connection."
          } else if (error.message.includes("Server error")) {
            errorMessage = `❌ ${error.message}`
          }
        }
        
        updateLastMessage(botMessageId, errorMessage)
      } finally {
        setIsLoading(false)
        scrollToBottom()
      }
    },
    [isLoading, addMessage, updateLastMessage, project._id, project.apiKey, scrollToBottom],
  )

  const handleLoadOlder = useCallback(() => {
    if (!isLoadingOlder) {
      loadOlderMessages()
    }
  }, [isLoadingOlder, loadOlderMessages])

  return (
    <div className="flex flex-col h-screen bg-[#111111]">
      {isLoadingHistory ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400 text-sm">Loading chat history...</p>
          </div>
        </div>
      ) : (
        <>
          <ChatContainer
            ref={chatContainerRef}
            messages={messages}
            isLoading={isLoading}
            isLoadingOlder={isLoadingOlder}
            onLoadOlder={handleLoadOlder}
            showScrollButton={showScrollButton}
            onScrollToBottom={scrollToBottom}
            hasMore={hasMore}
          />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            disabled={isLoading}
            placeholder="Ask me anything about your project..."
          />
        </>
      )}
    </div>
  )
}
