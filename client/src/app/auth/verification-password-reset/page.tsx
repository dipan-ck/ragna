'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/ui/submitButton'
import Image from 'next/image'

export default function VerificationPasswordReset() {
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Handle verification logic here
    const verificationCode = otp.join('')

    try{
       const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-password/verify`, {
        method: "POST",
       credentials: "include",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
      });

      const res = await req.json();

    }catch(error){

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
            <h1 className="text-2xl tracking-tight font-medium text-white">Verify Your Email</h1>
            <p className="text-sm text-white/70">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full mt-8">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#FD4C2D] focus:ring-1 focus:ring-[#FD4C2D] outline-none"
                />
              ))}
            </div>

            <SubmitButton
              type="submit"
              isLoading={isLoading}
              label="Verify"
              loadingLabel="Verifying..."
            />
          </form>

          <p className="text-center text-sm text-white/70 mt-4">
            Didn't receive the code?{' '}
            <button
              className="text-[#FD4C2D] transition-colors duration-200"
              onClick={() => {/* Handle resend logic */}}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
