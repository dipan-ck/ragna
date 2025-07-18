'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/ui/submitButton'
import Image from 'next/image'

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Handle password reset logic here
    console.log('New password:', passwords.newPassword)
    setIsLoading(false)
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
            <p className="text-sm text-white/70">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full mt-8">
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FD4C2D] focus:ring-1 focus:ring-[#FD4C2D] outline-none"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FD4C2D] focus:ring-1 focus:ring-[#FD4C2D] outline-none"
                />
              </div>
            </div>

            <SubmitButton
              type="submit"
              isLoading={isLoading}
              label="Change Password"
              loadingLabel="Changing Password..."
            />
          </form>
        </div>
      </div>
    </main>
  )
}
