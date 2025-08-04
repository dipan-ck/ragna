"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "../ui/submitButton";
import { ErrorToast, SuccessToast } from "../ui/Toast";

const Login = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const res = await req.json();

      if (res.success) {
        setIsLoading(false);
        SuccessToast(res.message)

        router.push("/dashboard");
      } else {
        setIsLoading(false);
         ErrorToast(res.message)
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
      ErrorToast("An error occurred while logging in")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        value={formData.email}
        onChange={handleChange}
        icon={<Mail className="h-4 w-4" />}
        required
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="flex justify-end">
        <a
          href="/auth/forgot-password"
          className="text-sm text-[#FD4C2D] hover:text-[#fd6b52] transition-colors duration-200"
        >
          Forgot password?
        </a>
      </div>

      <SubmitButton
        type="submit"
        isLoading={isLoading}
        label="Sign in"
        loadingLabel="Signing in..."
      />
    </form>
  );
};

export default Login;
