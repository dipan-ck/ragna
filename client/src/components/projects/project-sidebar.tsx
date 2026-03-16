"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    useProjectConversations,
    useCreateConversation,
    useDeleteConversation,
} from "@/hooks/use-conversations";
import { FilesModal } from "./files-modal";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarTrigger,
    useSidebar,
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
import { Separator } from "@/components/ui/separator";
import {
    MessageSquare,
    Plus,
    FolderOpen,
    MoreHorizontal,
    Trash2,
    Loader2,
    ArrowLeft,
    Home,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/api/conversation";

function ConversationItem({
    conversation,
    isActive,
    projectId,
    onDelete,
}: {
    conversation: Conversation;
    isActive: boolean;
    projectId: string;
    onDelete: (id: string, title: string) => void;
}) {
    const router = useRouter();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={isActive}
                tooltip={conversation.title ?? "Untitled"}
                onClick={() =>
                    router.push(
                        `/project/${projectId}?conversation=${conversation.id}`,
                    )
                }
                className={cn(
                    "h-8 rounded-md text-sm",
                    isActive && "font-medium",
                )}
            >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                    {conversation.title ?? "Untitled"}
                </span>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() =>
                                    onDelete(
                                        conversation.id,
                                        conversation.title ?? "Untitled",
                                    )
                                }
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuAction>
        </SidebarMenuItem>
    );
}

export function ProjectSidebar({
    projectId,
    activeConversationId,
}: {
    projectId: string;
    activeConversationId: string | null;
}) {
    const router = useRouter();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const [filesOpen, setFilesOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const { data: conversations, isLoading } =
        useProjectConversations(projectId);
    const { mutate: createConversation, isPending: isCreating } =
        useCreateConversation(projectId);
    const { mutate: deleteConversation, isPending: isDeleting } =
        useDeleteConversation(projectId);

    function handleCreate() {
        createConversation(undefined, {
            onSuccess: (conv) =>
                router.push(`/project/${projectId}?conversation=${conv.id}`),
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;
        deleteConversation(deleteTarget.id, {
            onSuccess: () => {
                if (activeConversationId === deleteTarget.id)
                    router.push(`/project/${projectId}`);
                setDeleteTarget(null);
            },
        });
    }

    return (
        <>
            <Sidebar collapsible="icon">
                {/* ── Header ── */}
                <SidebarHeader className="p-3">
                    {isCollapsed ? (
                        <SidebarTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <PanelLeftOpen className="h-4 w-4" />
                            </Button>
                        </SidebarTrigger>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xl">
                                    Ragna
                                </span>
                            </div>
                            <SidebarTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground"
                                >
                                    <PanelLeftClose className="h-4 w-4" />
                                </Button>
                            </SidebarTrigger>
                        </div>
                    )}
                </SidebarHeader>

                <Separator />

                {/* ── Action buttons ── */}
                <div className="p-3 flex flex-col gap-1.5">
                    {isCollapsed ? (
                        <>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleCreate}
                                disabled={isCreating}
                                title="New conversation"
                            >
                                {isCreating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setFilesOpen(true)}
                                title="Files"
                            >
                                <FolderOpen className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start h-9"
                                onClick={handleCreate}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="h-3.5 w-3.5 mr-2" />
                                )}
                                New conversation
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start h-9"
                                onClick={() => setFilesOpen(true)}
                            >
                                <FolderOpen className="h-3.5 w-3.5 mr-2" />
                                Files
                            </Button>
                        </>
                    )}
                </div>

                <Separator />

                {/* ── Conversations list ── */}
                <SidebarContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroup>
                        <SidebarGroupLabel>Conversations</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <SidebarMenuSkeleton key={i} />
                                    ))
                                ) : conversations?.length === 0 ? (
                                    <div className="px-2 py-8 text-center space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                            No conversations yet
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={handleCreate}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Start one
                                        </Button>
                                    </div>
                                ) : (
                                    conversations?.map((conv) => (
                                        <ConversationItem
                                            key={conv.id}
                                            conversation={conv}
                                            isActive={
                                                activeConversationId === conv.id
                                            }
                                            projectId={projectId}
                                            onDelete={(id, title) =>
                                                setDeleteTarget({ id, title })
                                            }
                                        />
                                    ))
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* ── Footer ── */}
                <SidebarFooter className="p-3">
                    <Separator className="mb-3" />
                    {isCollapsed ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Back to projects"
                        >
                            <Link href="/">
                                <Home className="h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="secondary">
                            <Link href="/">Back to projects</Link>
                        </Button>
                    )}
                </SidebarFooter>
            </Sidebar>

            <FilesModal
                projectId={projectId}
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
