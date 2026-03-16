"use client";
import { useRef, useState, useEffect } from "react";
import { useMessages, useSendMessage } from "@/hooks/use-conversations";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/api/conversation";

const STARTER_PROMPTS = [
    "Summarize the key points from my files",
    "What are the main topics covered?",
    "List all important dates or deadlines",
    "What action items can you find?",
    "Give me a brief overview of everything",
    "What questions does this content answer?",
];

export function ChatView({
    conversationId,
    projectId,
}: {
    conversationId: string;
    projectId: string;
}) {
    const [input, setInput] = useState("");
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
    const [streamingContent, setStreamingContent] = useState<string | null>(
        null,
    );
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data: serverMessages, isLoading } = useMessages(conversationId);
    const { send, isStreaming } = useSendMessage(conversationId);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [serverMessages, streamingContent, optimisticMessages]);

    function handleSend(overrideContent?: string) {
        const content = (overrideContent ?? input).trim();
        if (!content || isStreaming) return;

        setInput("");

        const optimisticUserMsg: Message = {
            id: `optimistic-${Date.now()}`,
            role: "USER",
            content,
            createdAt: new Date().toISOString(),
        };
        setOptimisticMessages([optimisticUserMsg]);
        setStreamingContent("");

        send(content, {
            onChunk: (chunk) => {
                setStreamingContent((prev) => (prev ?? "") + chunk);
            },
            onSuccess: () => {
                setStreamingContent(null);
                setOptimisticMessages([]);
            },
            onError: () => {
                setStreamingContent(null);
                setOptimisticMessages([]);
            },
        });
    }

    function handleReuse(content: string) {
        setInput(content);
    }

    const serverContentSet = new Set(
        serverMessages?.map((m) => m.content) ?? [],
    );
    const allMessages = [
        ...(serverMessages ?? []),
        ...optimisticMessages.filter((m) => !serverContentSet.has(m.content)),
    ];

    const isEmpty = allMessages.length === 0 && streamingContent === null;

    return (
        <div className="flex flex-col bg-muted h-full">
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-5">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3",
                                    i % 2 === 0
                                        ? "justify-start"
                                        : "justify-end flex-row-reverse",
                                )}
                            >
                                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                                <Skeleton
                                    className={cn(
                                        "h-14 rounded-2xl",
                                        i % 2 === 0 ? "w-64" : "w-48",
                                    )}
                                />
                            </div>
                        ))
                    ) : isEmpty ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-2xl bg-background border border-border flex items-center justify-center">
                                <Bot className="h-6 w-6 text-muted-foreground" />
                            </div>

                            {/* Heading */}
                            <div>
                                <p className="font-medium text-base">
                                    What would you like to know?
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Ask anything about your uploaded files, or
                                    start with a suggestion
                                </p>
                            </div>

                            {/* Starter prompts */}
                            <div className=" grid grid-cols-2 justify-center gap-2 max-w-xl">
                                {STARTER_PROMPTS.map((prompt, i) => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleSend(prompt)}
                                        disabled={isStreaming}
                                        style={{
                                            animationDelay: `${i * 80}ms`,
                                            animationFillMode: "both",
                                        }}
                                        className="text-xs px-3.5 py-2 rounded-lg border border-border bg-background hover:bg-accent hover:border-border/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {allMessages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    onReuse={handleReuse}
                                />
                            ))}
                            {streamingContent !== null && (
                                <MessageBubble
                                    message={{
                                        id: "streaming",
                                        role: "AI",
                                        content: "",
                                        createdAt: new Date().toISOString(),
                                    }}
                                    streamingContent={streamingContent}
                                    onReuse={handleReuse}
                                />
                            )}
                        </>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
            <ChatInput
                value={input}
                onChange={setInput}
                onSend={() => handleSend()}
                disabled={isStreaming}
            />
        </div>
    );
}
