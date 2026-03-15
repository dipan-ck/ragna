import { Navbar } from "@/components/navbar";
import { ProjectList } from "@/components/projects/project-list";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <ProjectList />
            </main>
        </>
    );
}
