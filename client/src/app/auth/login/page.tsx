import Login from '@/components/forms/Login'
import  GoogleSignInButton  from '@/components/ui/GoogleSignInButton'
import Image from 'next/image'


export default function Page() {



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
            <h1 className="text-2xl tracking-tight font-medium text-white">Welcome back Buddy</h1>
            <p className="text-sm text-white/70">Sign in to your account</p>
          </div>

          <div className="w-full mt-6">
            <GoogleSignInButton />
          </div>

          <div className="relative my-6 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs font-medium">
              <span className="px-2 bg-[#000000] text-white/70">Or continue with email</span>
            </div>
          </div>

           <Login/>

          <p className="text-center text-sm text-white/70 mt-4">
            Dont have an account?{' '}
            <a
              href="/auth/signup"
              className="text-[#2194FF] transition-colors duration-200"
            >
              Create account
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
