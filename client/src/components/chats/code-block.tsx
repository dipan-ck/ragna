"use client"

import { memo, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coldarkDark  } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  language: string
  code: string
}

export const CodeBlock = memo(({ language, code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  return (
    <div className="relative group my-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-900 px-4 py-2 rounded-t-lg border-b border-neutral-700/50">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        style={coldarkDark }
        language={language}
        PreTag="div"
        className="rounded-b-lg"
      customStyle={{
    margin: 0,
    borderRadius: "0 0 0.5rem 0.5rem",
    fontSize: "13px",
    lineHeight: "1.4",
    backgroundColor: "#0d1117",         // Ensure full dark bg
    padding: "1rem",                    // Add padding for readability
    overflowX: "auto",                  // Prevent wrapping artifacts
    userSelect: "text",                 // Allow selection
    WebkitFontSmoothing: "antialiased" // Improve font rendering
  }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"
