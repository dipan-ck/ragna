import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) {
    return <SidebarProvider>{children}</SidebarProvider>;
}
