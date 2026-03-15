"use client";
import { useState } from "react";
import Link from "next/link";
import {
    useProjectConversations,
    useCreateConversation,
    useDeleteConversation,
} from "@/hooks/use-conversations";
import { useProjectStore } from "@/store/project-store";
import { FilesModal } from "./files-modal";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Plus,
    Files,
    ArrowLeft,
    MoreHorizontal,
    Trash2,
    Loader2,
} from "lucide-react";
import type { Conversation } from "@/api/conversation";

function ConversationItem({
    conversation,
    onDelete,
}: {
    conversation: Conversation;
    onDelete: (id: string, title: string) => void;
}) {
    const { activeConversationId, setActiveConversationId } = useProjectStore();
    const isActive = activeConversationId === conversation.id;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={isActive}
                className="pr-8"
                onClick={() => setActiveConversationId(conversation.id)}
            >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-sm">
                    {conversation.title ?? "Untitled"}
                </span>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="flex items-center justify-center h-full w-full">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                    onDelete(
                                        conversation.id,
                                        conversation.title ?? "Untitled",
                                    )
                                }
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuAction>
        </SidebarMenuItem>
    );
}

export function ProjectSidebar() {
    const { projectId, activeConversationId, setActiveConversationId } =
        useProjectStore();
    const [filesOpen, setFilesOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const { data: conversations, isLoading } = useProjectConversations(
        projectId ?? "",
    );
    const { mutate: createConversation, isPending: isCreating } =
        useCreateConversation(projectId ?? "");
    const { mutate: deleteConversation, isPending: isDeleting } =
        useDeleteConversation(projectId ?? "");

    function handleCreate() {
        createConversation(undefined, {
            onSuccess: (conv) => setActiveConversationId(conv.id),
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;
        deleteConversation(deleteTarget.id, {
            onSuccess: () => {
                if (activeConversationId === deleteTarget.id)
                    setActiveConversationId(null);
                setDeleteTarget(null);
            },
        });
    }

    return (
        <>
            <Sidebar>
                <div className="flex flex-col h-full bg-sidebar border shadow-sm overflow-hidden">
                    <SidebarHeader className="border-b px-3 py-2.5 space-y-2.5">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                            >
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <span className="font-semibold text-sm truncate flex-1">
                                Project
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={handleCreate}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                New chat
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => setFilesOpen(true)}
                            >
                                <Files className="h-3.5 w-3.5 mr-1.5" />
                                Files
                            </Button>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="flex-1 overflow-y-auto">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs px-4">
                                Conversations
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <SidebarMenuSkeleton key={i} />
                                            ),
                                        )
                                    ) : conversations?.length === 0 ? (
                                        <div className="px-3 py-8 text-center">
                                            <p className="text-xs text-muted-foreground">
                                                No conversations yet
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 h-7 text-xs"
                                                onClick={handleCreate}
                                            >
                                                <Plus className="h-3.5 w-3.5 mr-1" />
                                                Start one
                                            </Button>
                                        </div>
                                    ) : (
                                        conversations?.map((conv) => (
                                            <ConversationItem
                                                key={conv.id}
                                                conversation={conv}
                                                onDelete={(id, title) =>
                                                    setDeleteTarget({
                                                        id,
                                                        title,
                                                    })
                                                }
                                            />
                                        ))
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </div>
            </Sidebar>

            <FilesModal
                projectId={projectId ?? ""}
                open={filesOpen}
                onOpenChange={setFilesOpen}
            />

            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete conversation?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Permanently deletes{" "}
                            <strong>{deleteTarget?.title}</strong> and all its
                            messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
