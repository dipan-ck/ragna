// components/AuthGuard.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from '@tanstack/react-query';
import Loader from "./ui/Loader";

const authPages = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/verification-password-reset',
];

const protectedPages = [
  '/dashboard',
  '/account',
  '/profile',
  '/project',
  '/feedback'
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const queryClient = useQueryClient(); // ✅ get queryClient

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
          credentials: 'include',
        });

        const data = await res.json();
        const isLoggedIn = res.ok && data?.success;

        if (!cancelled && isLoggedIn && data.data) {
          // ✅ Inject user into React Query cache
          queryClient.setQueryData(['user'], data.data);
        }

        if (!isLoggedIn && protectedPages.some((path) => pathname.startsWith(path))) {
          router.replace('/auth/login');
          return;
        }

        if (isLoggedIn && authPages.includes(pathname)) {
          router.replace('/dashboard');
          return;
        }

        if (!cancelled) setAllowed(true);
      } catch (err) {
        console.error("Auth check failed", err);
        if (protectedPages.some((path) => pathname.startsWith(path))) {
          router.replace("/auth/login");
          return;
        }
        if (!cancelled) setAllowed(true);
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, queryClient]);

  if (!allowed) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
