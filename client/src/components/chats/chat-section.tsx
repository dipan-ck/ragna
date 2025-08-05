"use client"

import { useState, useCallback } from "react"
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
  const { messages, addMessage, updateLastMessage, loadOlderMessages, isLoadingOlder } = useChatMessages(project._id)

  const { chatContainerRef, scrollToBottom, showScrollButton } = useChatScroll(messages, isLoading)

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

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/${project._id}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${project.apiKey}`,
          },
          body: JSON.stringify({ message: message.trim() }),
        })

        if (!response.ok) throw new Error("Network response was not ok")

        const reader = response.body?.getReader()
        if (!reader) throw new Error("Failed to get response reader")

        let accumulatedResponse = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          const lines = text.split("\n\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonData = JSON.parse(line.slice(6))

                if (jsonData.type === "chunk") {
                  accumulatedResponse += jsonData.content
                  updateLastMessage(botMessageId, accumulatedResponse)
                } else if (jsonData.type === "complete") {
                  updateLastMessage(botMessageId, jsonData.fullContent)
                } else if (jsonData.type === "error") {
                  updateLastMessage(botMessageId, `❌ ${jsonData.message}`)
                }
              } catch (parseError) {
                console.error("Failed to parse JSON:", parseError)
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error)
        updateLastMessage(botMessageId, "❌ Failed to connect to the AI model. Please try again.")
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
      <ChatContainer
        ref={chatContainerRef}
        messages={messages}
        isLoading={isLoading}
        isLoadingOlder={isLoadingOlder}
        onLoadOlder={handleLoadOlder}
        showScrollButton={showScrollButton}
        onScrollToBottom={scrollToBottom}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        disabled={isLoading}
        placeholder="Ask me anything about your project..."
      />
    </div>
  )
}
