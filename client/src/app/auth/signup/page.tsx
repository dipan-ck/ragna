'use client'

import { useState } from 'react'
import { User, Mail, Check, X } from 'lucide-react'
import  GoogleSignInButton  from '@/components/ui/GoogleSignInButton'
import { SubmitButton } from '@/components/ui/submitButton'
import { InputField } from '@/components/ui/InputField'
import { PasswordField } from '@/components/ui/PasswordField'
import Image from 'next/image'
import { z } from 'zod'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function CreateAccount() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState<Partial<SignupFormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    setFormErrors({ ...formErrors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {

    
    e.preventDefault()
    setIsLoading(true)
    

    try{

      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
        method: "POST",
       credentials: "include",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const res = await req.json()

      if(res.success){
        localStorage.setItem("email", formData.email);
        setIsLoading(false)
        router.push("/auth/verify-email")
      }else{
        setIsLoading(false)
        setFormErrors(res.errors || {})
        toast.error(res.message || "An error occurred")
      }

      setIsLoading(false)

    }catch(error){
         console.log(error);
         
    }

  }

  const passwordChecks = {
    length: formData.password.length >= 6,
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <div className="w-full max-w-md rounded-3xl p-8 relative">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/logo.svg"
            alt="Ragna Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl tracking-tight font-medium text-white">Create your Ragna Account</h1>
          <p className="text-sm text-white/70">Enter your details to sign up</p>
        </div>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs font-medium">
            <span className="px-2 bg-[#0a0a0a] text-white/70">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            icon={<User className="h-4 w-4" />}
            error={formErrors.fullName}
            required
          />

          <InputField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="h-4 w-4" />}
            error={formErrors.email}
            required
          />

          <PasswordField
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2">
              {passwordChecks.length ? (
                <Check className="text-green-500 h-4 w-4" />
              ) : (
                <X className="text-red-500 h-4 w-4" />
              )}
              <p
                className={`text-xs ${
                  passwordChecks.length ? 'text-green-500' : 'text-white/70'
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

        <p className="text-center text-sm text-white/70 mt-4">
          Already have an account?{' '}
          <a
            href="/auth/signin"
            className="text-[#FD4C2D] transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
