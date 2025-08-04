"use client";

import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const router = useRouter();

  const login = useGoogleLogin({
    flow: "auth-code", // ✅ IMPORTANT: use "auth-code" to get an auth code
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ authCode: codeResponse.code }), // 👈 send the auth code
        });

        const data = await res.json();

        if (data.success) {
          toast.success(data.message);
          router.push("/dashboard");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error("Login error", err);
        toast.error("Failed to login with Google");
      }
    },
    onError: (err) => {
      console.error("Google login error", err);
      toast.error("Google login failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="flex items-center cursor-pointer justify-center gap-3 font-medium px-6 py-2 bg-white text-black rounded-lg border border-gray-300 hover:shadow-md transition duration-200 w-full"
    >
      <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
      <span>Sign in with Google</span>
    </button>
  );
}
