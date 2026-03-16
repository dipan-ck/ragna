"use client";
import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function ChatInput({
    value,
    onChange,
    onSend,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    disabled: boolean;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [value]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    return (
        <div className="shrink-0 px-4 pb-5 ">
            <div className="max-w-4xl mx-auto">
                <div
                    className={cn(
                        "flex flex-col rounded-2xl bg-background/60 border border-border shadow-sm scrollbar-thin  transition-shadow",
                        "focus-within:shadow-md focus-within:border-ring/50",
                    )}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about your files..."
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-basej:w
                        outline-none  scrollbar-thin  placeholder:text-muted-foreground/60 min-h-13 max-h-70 disabled:opacity-50"
                        style={{ height: "auto" }}
                    />
                    <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                        <p className="text-xs text-muted-foreground/50 select-none">
                            Enter to send · Shift+Enter for new line
                        </p>
                        <Button
                            onClick={onSend}
                            disabled={!value.trim() || disabled}
                            className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                                value.trim() && !disabled
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                    : "bg-muted text-muted-foreground cursor-not-allowed",
                            )}
                        >
                            {disabled ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <ArrowUp className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
