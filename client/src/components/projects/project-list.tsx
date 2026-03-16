"use client";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/use-project";
import { CreateProjectDialog } from "./create-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus, Files, MessageSquare, ChevronRight } from "lucide-react";
import type { Project } from "@/api/project";
import { useSession } from "@/lib/auth-client";

function getInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
}

function relativeTime(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function ProjectRowSkeleton() {
    return (
        <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
            <Skeleton className="w-1 h-8 rounded-full shrink-0" />
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-24" />
            </div>
            <div className="hidden sm:flex gap-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 rounded" />
        </div>
    );
}

function ProjectRow({ project }: { project: Project }) {
    const router = useRouter();
    const initial = getInitial(project.name);
    const fileCount = project._count?.files ?? 0;
    const convCount = project._count?.conversations ?? 0;

    return (
        <div
            onClick={() => router.push(`/project/${project.id}`)}
            className="group flex items-center gap-4 px-5 py-4 mb-2  border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
        >
            {/* Primary accent bar */}
            <div className="w-1 h-8 rounded-full shrink-0 bg-primary opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Letter avatar */}
            <div className="h-9 w-9 rounded-lg border border-border bg-muted flex items-center justify-center text-sm font-semibold shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                {initial}
            </div>

            {/* Name + timestamp */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Updated {relativeTime(project.updatedAt)}
                </p>
            </div>

            {/* Badges */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border rounded-md px-2 py-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    {convCount}{" "}
                    {convCount === 1 ? "conversation" : "conversations"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border rounded-md px-2 py-1">
                    <Files className="h-3 w-3 text-muted-foreground" />
                    {fileCount}{" "}
                    {fileCount === 1 ? "file linked" : "files linked"}
                </span>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
        </div>
    );
}

export function ProjectList() {
    const { data: projects, isLoading, isError } = useProjects();
    const { data: session } = useSession();

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-sm text-muted-foreground">
                    Failed to load projects.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                    Try refreshing
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight">
                        Hello {session?.user?.name ?? ""}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {isLoading
                            ? "Loading..."
                            : `${projects?.length ?? 0} project${projects?.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
                <CreateProjectDialog />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <ProjectRowSkeleton key={i} />
                    ))}
                </div>
            ) : projects?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
                        <FolderPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">No projects yet</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Create a project, upload your files, and start
                            asking questions about them
                        </p>
                    </div>
                    <CreateProjectDialog />
                </div>
            ) : (
                <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {projects?.map((project) => (
                        <ProjectRow key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
