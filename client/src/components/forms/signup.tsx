"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "../ui/submitButton";
import { User, Mail, Check, X } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ErrorToast } from "../ui/Toast";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<SignupFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await req.json();

      if (res.success) {
        localStorage.setItem("email", formData.email);
        router.push("/auth/verify-email");
      } else {
        setFormErrors(res.errors || {});
        ErrorToast(res.message || "An error occurred")
      }
    } catch (error) {
      console.error(error);
      ErrorToast("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecks = {
    length: formData.password.length >= 6,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <Input
        id="fullName"
        name="fullName"
        label="Full Name"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={handleChange}
        icon={<User className="h-4 w-4" />}
        required
      />

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
        label="Password"
        value={formData.password}
        onChange={handleChange}
      />

      {/* Password validation message */}
      <div className="space-y-1 mt-2">
        <div className="flex items-center gap-2">
          {passwordChecks.length ? (
            <Check className="text-green-500 h-4 w-4" />
          ) : (
            <X className="text-red-500 h-4 w-4" />
          )}
          <p
            className={`text-xs ${
              passwordChecks.length ? "text-green-500" : "text-white/70"
            }`}
          >
            Password must be at least 6 characters
          </p>
        </div>
      </div>

      <SubmitButton
        type="submit"
        isLoading={isLoading}
        label="Create account"
        loadingLabel="Creating account..."
      />
    </form>
  );
};

export default Signup;
