'use client'

import  GoogleSignInButton  from '@/components/ui/GoogleSignInButton'
import Image from 'next/image'
import Signup from '@/components/forms/signup'





export default function CreateAccount() {


  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <div className="w-full max-w-md rounded-3xl p-8 relative">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/logo.svg"
            alt="Ragna Logo"
            width={50}
            height={50}
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
            <span className="px-2 bg-[#000000] text-white/70">Or continue with email</span>
          </div>
        </div>

        <Signup/>

        <p className="text-center text-sm text-white/70 mt-4">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-[#2194FF] transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
