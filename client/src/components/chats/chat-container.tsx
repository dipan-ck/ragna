"use client"

import { forwardRef, memo } from "react"
import { Loader2, ArrowDown } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import type { Message } from "./chat-section"

interface ChatContainerProps {
  messages: Message[]
  isLoading: boolean
  isLoadingOlder: boolean
  onLoadOlder: () => void
  showScrollButton: boolean
  onScrollToBottom: () => void
}

export const ChatContainer = memo(
  forwardRef<HTMLDivElement, ChatContainerProps>(
    ({ messages, isLoading, isLoadingOlder, onLoadOlder, showScrollButton, onScrollToBottom }, ref) => {
      return (
        <div className="flex-1 relative">
          <div
            ref={ref}
            className="absolute inset-0 overflow-y-auto px-4 md:px-8 lg:px-16 xl:px-32 py-6 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#374151 transparent",
            }}
          >
            {/* Load older messages button */}
            {messages.length > 0 && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={onLoadOlder}
                  disabled={isLoadingOlder}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-300 bg-neutral-900/50 hover:bg-neutral-800/50 rounded-full border border-neutral-800 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoadingOlder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading older messages...
                    </>
                  ) : (
                    "Load older messages"
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-[#141414] rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-300 mb-2">Start a conversation</h3>
                  <p className="text-neutral-500 text-sm max-w-md">
                    Ask me anything about your project. I'm here to help with code, documentation, and more.
                  </p>
                </div>
              ) : (
                messages.map((message) => <MessageBubble key={message.id} message={message} />)
              )}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Bottom padding for input area */}
            <div className="h-32" />
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <div className="absolute bottom-36 right-6 z-10">
              <button
                onClick={onScrollToBottom}
                className="flex items-center justify-center w-12 h-12 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                title="Scroll to bottom"
              >
                <ArrowDown className="h-5 w-5 text-neutral-300" />
              </button>
            </div>
          )}
        </div>
      )
    },
  ),
)

ChatContainer.displayName = "ChatContainer"
