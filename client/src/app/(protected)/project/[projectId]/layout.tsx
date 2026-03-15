import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProjectSidebar } from "@/components/projects/project-sidebar";
import { ProjectInitializer } from "@/components/projects/project-initializer";

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;
    return (
        <SidebarProvider>
            <ProjectInitializer projectId={projectId} />
            <ProjectSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
