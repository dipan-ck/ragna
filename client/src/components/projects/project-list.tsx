"use client";
import { useProjects } from "@/hooks/use-project";
import { ProjectCard } from "./project-card";
import { CreateProjectDialog } from "./create-project-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus } from "lucide-react";

function ProjectSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/3" />
        </div>
    );
}

export function ProjectList() {
    const { data: projects, isLoading, isError } = useProjects();

    if (isError)
        return (
            <div className="text-center py-16 text-muted-foreground text-sm">
                Failed to load projects. Try refreshing.
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Projects
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {isLoading
                            ? "Loading..."
                            : `${projects?.length ?? 0} project${projects?.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
                <CreateProjectDialog />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProjectSkeleton key={i} />
                    ))}
                </div>
            ) : projects?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <FolderPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">No projects yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Create your first project to get started
                        </p>
                    </div>
                    <CreateProjectDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {projects?.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
