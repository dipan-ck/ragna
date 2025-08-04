'use client'

import { useState, useEffect, useRef } from 'react'
import { SubmitButton } from '@/components/ui/submitButton'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer((t) => t - 1), 1000)
    }
    if (resendTimer === 0) {
      setCanResend(true)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resendTimer, canResend])

  useEffect(() => {
    setCanResend(false)
    setResendTimer(60)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

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
    const verificationCode = otp.join('')
    const email = localStorage.getItem("email");
  
    try{
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-otp`, {
        method: "POST",
       credentials: "include",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: verificationCode,
          email: email
        }),
      })

      const res = await req.json();

      if(res.success){
        setIsLoading(false)
        localStorage.removeItem("email");
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
        router.push("/dashboard")
      }else{
        setIsLoading(false)
        toast.error(res.message || "An error occurred")
      }

    }catch(error){
      console.error("Error verifying OTP:", error);
      setIsLoading(false)
      toast.error("An error occurred while verifying OTP")
    }
  }

  async function resendOTP(){
    if (!canResend) return
    const email = localStorage.getItem("email");

    try{
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/resend-otp`, {
        method: "POST",
        credentials: "include",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const res = await req.json();

      if(res.success){
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
      }else{
        toast.error(res.message || "An error occurred")
      }
    }catch(error){
      // Optionally handle error
    }
    setCanResend(false)
    setResendTimer(60)
  }

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl p-8 mx-auto">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/logo.svg"
              alt="Ragna Logo"
              width={50}
              height={50}
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
              label="Confirm Email"
              loadingLabel="Confirming..."
            />
          </form>

          <p className="text-center text-sm text-white/70 mt-4">
            Didn't receive the code?{' '}
            <button
              className={`text-[#2194FF] cursor-pointer hover:underline hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={resendOTP}
              disabled={!canResend}
            >
              {canResend ? 'Resend' : `Resend (${resendTimer}s)`}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
