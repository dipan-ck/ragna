"use client"

import type React from "react"
import { memo, useCallback, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export const ChatInput = memo(
  ({ value, onChange, onSend, disabled = false, placeholder = "Type your message..." }: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = useCallback(() => {
      if (value.trim() && !disabled) {
        onSend(value)
      }
    }, [value, disabled, onSend])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          handleSubmit()
        }
      },
      [handleSubmit],
    )

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px` // Increased max height
      }
    }, [value])

    return (
      <div className="">
        <div className="max-w-3xl mx-auto px-4 ">
          <div className="relative flex items-end">
            <div className="flex-1 relative bg-neutral-800 rounded-3xl shadow-lg overflow-hidden">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="w-full custom-scrollbar min-h-[70px] max-h-[200px] px-5 py-4 pr-14 bg-transparent text-white text-sm placeholder-neutral-400 resize-none focus:outline-none disabled:opacity-50"
              />

              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
                className="absolute right-2 bottom-2.5 p-2 rounded-xl bg-white disabled:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {disabled ? (
                  <Loader2 className="h-4 w-4 text-black animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-2 text-xs text-neutral-400 text-center">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>
    )
  },
)

ChatInput.displayName = "ChatInput"
