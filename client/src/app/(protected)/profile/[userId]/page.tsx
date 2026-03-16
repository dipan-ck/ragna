"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import {
    Mail,
    Calendar,
    Shield,
    ArrowLeft,
    LogOut,
    Loader2,
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        setLoggingOut(true);
        await authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/sign-in") },
        });
        setLoggingOut(false);
    }
    if (isPending) {
        return (
            <>
                <Navbar />
                <main className="mx-auto max-w-2xl px-4 py-12 flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </main>
            </>
        );
    }

    if (!session) {
        router.push("/sign-in");
        return null;
    }

    const user = session.user;
    const initials =
        user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "U";

    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-2xl px-4 py-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/">
                                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Profile
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your account information
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Identity card */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-start gap-5">
                            <Avatar className="h-16 w-16 rounded-xl shrink-0">
                                <AvatarImage
                                    src={user.image ?? ""}
                                    alt={user.name ?? ""}
                                />
                                <AvatarFallback className="rounded-xl text-lg font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-semibold truncate">
                                        {user.name}
                                    </h2>
                                    {user.emailVerified && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs gap-1 shrink-0"
                                        >
                                            <Shield className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="rounded-xl border border-border bg-card divide-y divide-border">
                        <div className="flex items-center gap-3 px-5 py-4">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Email address
                                </p>
                                <p className="text-sm font-medium truncate mt-0.5">
                                    {user.email}
                                </p>
                            </div>
                            {user.emailVerified ? (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-200 dark:border-green-900 dark:text-green-400 shrink-0"
                                >
                                    Verified
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-amber-600 border-amber-200 dark:border-amber-900 dark:text-amber-400 shrink-0"
                                >
                                    Unverified
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-3 px-5 py-4">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Member since
                                </p>
                                <p className="text-sm font-medium mt-0.5">
                                    {joinedDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sign out */}
                    <div className="rounded-xl border border-border bg-card px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Sign out</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Sign out of your account on this device
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                            >
                                {loggingOut ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <LogOut className="h-3.5 w-3.5" />
                                )}
                                Sign out
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
