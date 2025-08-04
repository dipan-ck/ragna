import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { CodeBlock } from "./code-block"

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer = memo(({ content }: MarkdownRendererProps) => {
  if (!content.trim()) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 text-sm">
      
        <span></span>
      </div>
    )
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const language = match?.[1] || "text"
            const code = String(children).replace(/\n$/, "")

            if (inline) {
              return (
                <code className="bg-neutral-800/60 text-blue-300 rounded px-1.5 py-0.5 text-xs font-mono">
                  {children}
                </code>
              )
            }

            return <CodeBlock language={language} code={code} />
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-neutral-700/50">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium text-white mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-neutral-200 mb-3 text-sm leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-none pl-0 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => (
            <li className="text-neutral-200 text-sm leading-relaxed flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-blue-500/50 bg-blue-500/5 pl-4 py-2 my-3 rounded-r">
              <div className="text-neutral-300 text-sm italic">{children}</div>
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-neutral-300">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = "MarkdownRenderer"
