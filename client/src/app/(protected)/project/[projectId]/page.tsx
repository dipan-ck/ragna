"use client";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChatView } from "@/components/projects/chat-view";
import { useProjectStore } from "@/store/project-store";
import {
    useCreateConversation,
    useProjectConversations,
} from "@/hooks/use-conversations";
import { useSession } from "@/lib/auth-client";
import { ChatInput } from "@/components/projects/chat-input";

function LandingScreen() {
    const { projectId, setActiveConversationId, setPendingMessage } =
        useProjectStore();
    const { data: session, isPending: sessionLoading } = useSession();
    const { mutate: createConversation, isPending: isCreating } =
        useCreateConversation(projectId ?? "");
    const [input, setInput] = useState("");

    function handleSend() {
        const content = input.trim();
        if (!content || isCreating || !projectId) return;
        const title = content.split(/\s+/).slice(0, 4).join(" ");
        setInput("");
        createConversation(title, {
            onSuccess: (conv) => {
                setPendingMessage(content);
                setActiveConversationId(conv.id);
            },
        });
    }

    const firstName = session?.user?.name?.split(" ")[0];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {sessionLoading ? (
                            <span className="invisible">Hey</span>
                        ) : (
                            `Hey ${firstName ?? "there"}`
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        What's on your mind today?
                    </p>
                </div>
                <div className="w-full max-w-2xl">
                    <ChatInput
                        value={input}
                        onChange={setInput}
                        onSend={handleSend}
                        disabled={isCreating}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ProjectPage() {
    const { activeConversationId, projectId } = useProjectStore();
    const { data: conversations } = useProjectConversations(projectId ?? "");
    const activeConversation = conversations?.find(
        (c) => c.id === activeConversationId,
    );

    return (
        <div className="flex h-screen flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <span className="text-sm text-muted-foreground truncate">
                    {activeConversation?.title ?? "New conversation"}
                </span>
            </header>
            <div className="flex-1 overflow-hidden">
                {activeConversationId ? (
                    <ChatView
                        key={activeConversationId}
                        conversationId={activeConversationId}
                    />
                ) : (
                    <LandingScreen />
                )}
            </div>
        </div>
    );
}
