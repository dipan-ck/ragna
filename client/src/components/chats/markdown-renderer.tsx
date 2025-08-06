import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "./code-block";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-invert max-w-none prose-sm sm:prose-base prose-pre:bg-neutral-900 prose-code:text-blue-300 prose-code:bg-neutral-800/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-table:text-sm prose-th:border-b prose-td:border-t prose-td:px-3 prose-td:py-2 prose-th:px-3 prose-th:py-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ inline, className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match?.[1] || "text";
            const code = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className="bg-neutral-800/70 text-blue-300 rounded-md px-2 py-0.5 text-xs font-mono hover:bg-neutral-800/90 transition-colors">
                  {children}
                </code>
              );
            }

            return <CodeBlock language={language} code={code} />;
          },

          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mt-8 mb-4 pb-3 border-b border-neutral-700/50 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mt-6 mb-3 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-white mt-5 mb-2 tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-neutral-200 mb-4 text-sm leading-relaxed tracking-wide">
              {children}
            </p>
          ),

          // Fixed: lists (unordered vs ordered)
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 space-y-2 text-sm text-neutral-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-2 text-sm text-neutral-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="py-1">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/60 bg-blue-500/10 pl-5 py-3 my-4 rounded-r-lg shadow-sm">
              <div className="text-neutral-300 text-sm italic leading-relaxed">
                {children}
              </div>
            </blockquote>
          ),

          hr: () => (
            <hr className="my-6 border-t border-neutral-700/60 w-full" />
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/40 hover:decoration-blue-300/60 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white tracking-wide">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-neutral-300 tracking-wide">{children}</em>
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse border  border-neutral-700 text-neutral-200 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-800 text-white">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-t border-neutral-700">{children}</tr>,
          th: ({ children }) => (
            <th className="text-left font-medium px-4 py-2 border-b border-neutral-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-t border-neutral-700">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";
