"use client";
import { useEffect, useRef, useState } from "react";
import { useMessages, useSendMessage } from "@/hooks/use-conversations";
import { useProjectStore } from "@/store/project-store";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

function TypingIndicator() {
    return (
        <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:300ms]" />
            </div>
        </div>
    );
}

export function ChatView({ conversationId }: { conversationId: string }) {
    const { pendingMessage, setPendingMessage } = useProjectStore();
    const [input, setInput] = useState("");
    const [waitingForAI, setWaitingForAI] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const pendingSentRef = useRef(false);
    const sendingRef = useRef(false);

    const { data: messages, isLoading } = useMessages(conversationId);
    const { mutate: sendMessage, isPending: isSending } =
        useSendMessage(conversationId);

    // send pending message once on mount — key={conversationId} handles remount on switch
    useEffect(() => {
        if (!pendingMessage || pendingSentRef.current) return;
        pendingSentRef.current = true;
        const msg = pendingMessage;
        setPendingMessage(null);
        setTimeout(() => {
            setWaitingForAI(true);
            sendMessage(msg, {
                onSuccess: () => setWaitingForAI(false),
                onError: () => setWaitingForAI(false),
            });
        }, 0);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, waitingForAI]);

    function handleSend() {
        const content = input.trim();
        if (!content || isSending || sendingRef.current) return;
        sendingRef.current = true;
        setInput("");
        setWaitingForAI(true);
        sendMessage(content, {
            onSuccess: () => {
                setWaitingForAI(false);
                sendingRef.current = false;
            },
            onError: () => {
                setWaitingForAI(false);
                sendingRef.current = false;
            },
        });
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-5">
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
                    ) : messages?.length === 0 && !waitingForAI ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
                            <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                <Bot className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-sm">
                                Ask anything about your project files
                            </p>
                        </div>
                    ) : (
                        messages?.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))
                    )}
                    {waitingForAI && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>
            </div>
            <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                disabled={isSending}
            />
        </div>
    );
}
