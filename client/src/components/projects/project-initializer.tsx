"use client";
import { useEffect } from "react";
import { useProjectStore } from "@/store/project-store";

export function ProjectInitializer({ projectId }: { projectId: string }) {
    const setProjectId = useProjectStore((s) => s.setProjectId);
    useEffect(() => {
        setProjectId(projectId);
    }, [projectId]);
    return null;
}
