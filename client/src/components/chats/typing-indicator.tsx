import { memo } from "react"

export const TypingIndicator = memo(() => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-neutral-700 flex items-center justify-center">
        <img src="/logo.svg" className="h-4 w-4" alt="Ragna Logo" />
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-neutral-400 text-sm ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
})

TypingIndicator.displayName = "TypingIndicator"
