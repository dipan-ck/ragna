import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

export default async function ProfilePage() {
    const session = await authClient.getSession({
        fetchOptions: { headers: await headers() },
    });

    const user = session.data!.user;
    const initials =
        user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "U";

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-screen-xl px-4 py-10">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src={user.image ?? ""}
                                alt={user.name ?? ""}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-semibold text-lg">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
