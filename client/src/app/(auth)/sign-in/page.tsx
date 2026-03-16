"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Github, Loader2, Eye, EyeOff } from "lucide-react";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (!isPending && session) {
            router.replace("/");
        }
    }, [session, isPending, router]);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: FormValues) {
        setServerError("");
        const { error } = await signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: process.env.NEXT_PUBLIC_CLIENT_URL,
        });
        if (error) {
            setServerError(error.message ?? "Something went wrong");
            return;
        }
        router.push("/");
    }

    if (isPending || session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left — cover image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col">
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative mt-auto p-10 z-10">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="text-white font-semibold text-sm">
                            Ragna
                        </span>
                    </div>
                    <p className="text-white/90 text-lg font-medium leading-relaxed max-w-xs">
                        Upload your files and have intelligent conversations
                        about them
                    </p>
                    <p className="text-white/50 text-sm mt-2">
                        Powered by retrieval-augmented generation
                    </p>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="h-7 w-7 rounded-lg bg-foreground flex items-center justify-center">
                            <span className="text-background text-xs font-bold">
                                R
                            </span>
                        </div>
                        <span className="font-semibold text-sm">Ragna</span>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() =>
                                signIn.social({
                                    provider: "github",
                                    callbackURL:
                                        process.env.NEXT_PUBLIC_CLIENT_URL,
                                })
                            }
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() =>
                                signIn.social({
                                    provider: "google",
                                    callbackURL:
                                        process.env.NEXT_PUBLIC_CLIENT_URL,
                                })
                            }
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="relative mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-2 text-muted-foreground">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        placeholder="you@example.com"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((p) => !p)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {serverError && (
                            <p className="text-sm text-destructive">
                                {serverError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <p className="text-sm text-muted-foreground text-center mt-6">
                        No account?{" "}
                        <Link
                            href="/sign-up"
                            className="text-foreground underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
