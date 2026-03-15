import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Message } from "@/api/conversation";

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "USER";
    return (
        <div
            className={cn(
                "flex gap-3",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto",
                "max-w-[85%]",
            )}
        >
            <div
                className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted border border-border",
                )}
            >
                {isUser ? (
                    <User className="h-3.5 w-3.5" />
                ) : (
                    <Bot className="h-3.5 w-3.5" />
                )}
            </div>
            <div
                className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/60 border border-border/50 rounded-tl-sm",
                )}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                    className={cn(
                        "text-xs mt-1.5 opacity-50",
                        isUser ? "text-right" : "text-left",
                    )}
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
}
