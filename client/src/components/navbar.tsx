import Link from "next/link";
import { UserMenu } from "./user-menu";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                    <span className="font-medium text-xl tracking-tight">
                        Ragna
                    </span>
                </Link>

                <UserMenu />
            </div>
        </header>
    );
}
