"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { codeToHtml } from "shiki";
import { Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Message } from "@/api/conversation";

interface Props {
    message: Message;
    streamingContent?: string;
    onReuse?: (content: string) => void;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            title="Copy"
        >
            {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}
        </Button>
    );
}

function CodeBlock({
    language,
    children,
}: {
    language: string;
    children: string;
}) {
    const [copied, setCopied] = useState(false);
    const [html, setHtml] = useState<string>("");
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        codeToHtml(children, {
            lang: language,
            themes: {
                dark: "github-dark",
            },
            defaultColor: "dark",
        })
            .then(setHtml)
            .catch(() => setHtml(`<pre><code>${children}</code></pre>`));
    }, [children, language, resolvedTheme]);

    async function handleCopy() {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="my-3 rounded-lg overflow-hidden bg-background border  text-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border/60">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code — shiki outputs a full <pre><code> block */}
            {html ? (
                <div
                    className="[&>pre]:p-4 [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:text-base p-2 pl-6 [&>pre]:leading-relaxed [&>pre]:font-mono [&>pre]:!bg-transparent [&>pre>code]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ) : (
                <pre className="p-4 text-base font-mono text-muted-foreground">
                    <code>{children}</code>
                </pre>
            )}
        </div>
    );
}

function MarkdownContent({ content }: { content: string }) {
    return (
        <div className="prose prose-sm dark:prose-invert   max-w-none">
            <ReactMarkdown
                //remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = !!match;
                        const codeString = String(children).replace(/\n$/, "");

                        return isBlock ? (
                            <CodeBlock language={match[1]}>
                                {codeString}
                            </CodeBlock>
                        ) : (
                            <code
                                className="bg-accent text-foreground  px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    table({ children }) {
                        return (
                            <div className="my-3 w-full overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-base">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    thead({ children }) {
                        return (
                            <thead className="bg-muted/50 border-b border-border">
                                {children}
                            </thead>
                        );
                    },
                    th({ children }) {
                        return (
                            <th className="px-3 py-2 text-left text-base font-semibold text-foreground">
                                {children}
                            </th>
                        );
                    },
                    td({ children }) {
                        return (
                            <td className="px-3 py-2 text-base border-t border-border/50">
                                {children}
                            </td>
                        );
                    },
                    blockquote({ children }) {
                        return (
                            <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground not-italic">
                                {children}
                            </blockquote>
                        );
                    },
                    h1({ children }) {
                        return (
                            <h1 className="text-lg font-semibold mt-4 mb-1.5 text-foreground">
                                {children}
                            </h1>
                        );
                    },
                    h2({ children }) {
                        return (
                            <h2 className="text-base font-semibold mt-3 mb-1 text-foreground">
                                {children}
                            </h2>
                        );
                    },
                    h3({ children }) {
                        return (
                            <h3 className="text-base font-semibold mt-2.5 mb-1 text-foreground">
                                {children}
                            </h3>
                        );
                    },
                    ul({ children }) {
                        return (
                            <ul className="my-1.5 ml-4 space-y-0.5 list-disc marker:text-muted-foreground">
                                {children}
                            </ul>
                        );
                    },
                    ol({ children }) {
                        return (
                            <ol className="my-1.5 ml-4 space-y-0.5 list-decimal marker:text-muted-foreground">
                                {children}
                            </ol>
                        );
                    },
                    li({ children }) {
                        return (
                            <li className="text-base leading-relaxed pl-0.5">
                                {children}
                            </li>
                        );
                    },
                    p({ children }) {
                        return (
                            <p className="text-base leading-relaxed my-1.5">
                                {children}
                            </p>
                        );
                    },
                    hr() {
                        return <hr className="my-3 border-border" />;
                    },
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                            >
                                {children}
                            </a>
                        );
                    },
                    strong({ children }) {
                        return (
                            <strong className="font-semibold text-foreground">
                                {children}
                            </strong>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export function MessageBubble({ message, streamingContent, onReuse }: Props) {
    const isUser = message.role === "USER";
    const content = streamingContent ?? message.content;
    const isStreaming = streamingContent !== undefined;
    const showActions = !isStreaming && content.length > 0;

    return (
        <div
            className={cn(
                "group flex gap-3 text-base items-start",
                isUser && "flex-row-reverse",
            )}
        >
            <div
                className={cn(
                    "flex flex-col text-base gap-1",
                    isUser ? "items-end" : "items-start",
                    "max-w-[85%]",
                )}
            >
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2",
                        isUser
                            ? "bg-primary text-primary-foreground rounded-tr-sm text-base"
                            : "w-full  text-base",
                    )}
                >
                    {isUser ? (
                        <p className="text-base whitespace-pre-wrap leading-relaxed">
                            {content}
                        </p>
                    ) : (
                        <MarkdownContent content={content} />
                    )}

                    {isStreaming && (
                        <span className="inline-block w-1.5 h-3.5 bg-foreground opacity-60 animate-pulse ml-0.5 align-middle rounded-sm" />
                    )}
                </div>

                {showActions && (
                    <div
                        className={cn(
                            "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                            isUser && "flex-row-reverse",
                        )}
                    >
                        <CopyButton text={content} />
                        {isUser && onReuse && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => onReuse(content)}
                                title="Reuse message"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
