"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
          credentials: 'include',
        });

        const data = await res.json();
        const isLoggedIn = res.ok && data?.success;

        console.log(data);
        

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
  }, [pathname, router]);

  if (!allowed) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">

<div className="loader">
  <div className="square" id="sq1"></div>
  <div className="square" id="sq2"></div>
  <div className="square" id="sq3"></div>
  <div className="square" id="sq4"></div>
  <div className="square" id="sq5"></div>
  <div className="square" id="sq6"></div>
  <div className="square" id="sq7"></div>
  <div className="square" id="sq8"></div>
  <div className="square" id="sq9"></div>
</div>
      </div>
    );
  }

  return <>{children}</>;
}
