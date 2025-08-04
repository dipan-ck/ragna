"use client"

import { memo, useState } from "react"
import { Copy, Check} from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import type { Message } from "./chat-section"

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.sender === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Message content */}
      <div className={`group relative max-w-[80%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser ? "bg-[#242424] text-white" : "text-neutral-100"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <div className="flex justify-start mt-2">
          <button
            onClick={handleCopy}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-[#000] ${
              isUser ? "bg-white/10" : "bg-neutral-700"
            }`}
            title="Copy message"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-neutral-400" />}
          </button>
        </div>
      </div>
    </div>
  )
})

MessageBubble.displayName = "MessageBubble"
