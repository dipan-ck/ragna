import Link from "next/link";
import { UserMenu } from "./user-menu";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-foreground" />
                    <span className="font-semibold tracking-tight">Ragna</span>
                </Link>
                <UserMenu />
            </div>
        </header>
    );
}
