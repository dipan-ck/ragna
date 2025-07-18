'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { SubmitButton } from '@/components/ui/submitButton'
import { InputField } from '@/components/ui/InputField'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RequestPasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try{

       const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-password/request`, {
        method: "POST",
       credentials: "include",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
      });

      const res = await req.json();

      if(res.success){
        setIsLoading(false);
                 toast.success(res.message, {
          style: {
            background: 'rgba(30, 64, 175, 0.8)',
            color: '#fff',
            border: '1.5px solid rgba(59, 130, 246, 0.5)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 24px 0 rgba(30, 64, 175, 0.15)',
          },
          icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#2563EB" />
              <path d="M8 12.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        })
        router.push("/auth/verification-password-reset");
      }else{
         setIsLoading(false);
        toast.error(res.message || "An error occurred", {
          style: {
            background: 'rgba(220, 38, 38, 0.8)',
            color: '#fff',
            border: '1.5px solid rgba(239, 68, 68, 0.5)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 24px 0 rgba(220, 38, 38, 0.15)',
          },
        });
      }

    }catch(error){
      setIsLoading(false);
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again later.", {
        style: {
          background: 'rgba(220, 38, 38, 0.8)',
          color: '#fff',
          border: '1.5px solid rgba(239, 68, 68, 0.5)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 24px 0 rgba(220, 38, 38, 0.15)',
        },
      });
    }


  }

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl p-8 mx-auto">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/logo.svg"
              alt="Ragna Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="text-center space-y-2 w-full">
            <h1 className="text-2xl tracking-tight font-medium text-white">Reset Password</h1>
            <p className="text-sm text-white/70">Enter your email to receive an OTP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full mt-6">
            <InputField
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <SubmitButton
              type="submit"
              isLoading={isLoading}
              label="Get OTP"
              loadingLabel="Sending OTP..."
            />
          </form>

          <p className="text-center text-sm text-white/70 mt-4">
            Remember your password?{' '}
            <a
              href="/login"
              className="text-[#FD4C2D] transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
