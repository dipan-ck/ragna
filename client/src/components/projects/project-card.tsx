"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/api/project";
import { useDeleteProject, useUpdateProjectTitle } from "@/hooks/use-project";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
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
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    FolderOpen,
} from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(project.name);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
    const { mutate: updateTitle, isPending: isUpdating } =
        useUpdateProjectTitle();

    function handleRename(e: React.FormEvent) {
        e.preventDefault();
        if (!editName.trim() || editName === project.name) {
            setEditing(false);
            return;
        }
        updateTitle(
            { id: project.id, name: editName.trim() },
            { onSuccess: () => setEditing(false) },
        );
    }

    return (
        <>
            <Card
                className="group hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() =>
                    !editing && router.push(`/project/${project.id}`)
                }
            >
                <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    {editing ? (
                        <form
                            onSubmit={handleRename}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex gap-2"
                        >
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                className="h-7 text-sm"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                variant="ghost"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    "Save"
                                )}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setEditing(false);
                                    setEditName(project.name);
                                }}
                            >
                                Cancel
                            </Button>
                        </form>
                    ) : (
                        <h3 className="font-medium text-sm leading-tight line-clamp-1 flex-1">
                            {project.name}
                        </h3>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setEditing(true)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setConfirmDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="pb-4">
                    {project.instructions ? (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.instructions}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground/50 italic">
                            No instructions
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <FolderOpen className="h-3 w-3" />
                        <span>
                            {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete project?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{project.name}</strong> and all its files.
                            This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteProject(project.id)}
                            disabled={isDeleting}
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
