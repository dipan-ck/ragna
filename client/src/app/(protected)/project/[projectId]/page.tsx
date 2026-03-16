import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { ProjectSidebar } from "@/components/projects/project-sidebar";
import { ChatView } from "@/components/projects/chat-view";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Bot } from "lucide-react";

export default async function ProjectPage({
    params,
    searchParams,
}: {
    params: Promise<{ projectId: string }>;
    searchParams: Promise<{ conversation?: string }>;
}) {
    const session = await authClient.getSession({
        fetchOptions: { headers: await headers() },
    });
    if (!session.data) redirect("/sign-in");

    const { projectId } = await params;
    const { conversation: conversationId } = await searchParams;

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full  bg-muted overflow-hidden">
                <ProjectSidebar
                    projectId={projectId}
                    activeConversationId={conversationId ?? null}
                />
                <SidebarInset className="flex-1 flex flex-col min-w-0">
                    {conversationId ? (
                        <ChatView
                            key={conversationId}
                            conversationId={conversationId}
                            projectId={projectId}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center  bg-muted justify-center gap-4 text-center p-8">
                            <div>
                                <p className="font-semibold text-base">
                                    Select a conversation
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Or create a new one from the sidebar
                                </p>
                            </div>
                        </div>
                    )}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
