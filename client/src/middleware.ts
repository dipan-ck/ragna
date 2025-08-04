import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes
const authPages = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/verification-password-reset',
]

const protectedPages = [
  '/dashboard',
  '/account',
  '/profile',
  "/project",
  "/feedback"
]

export default function middleware(request: NextRequest) {
  const jwt = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // 🔒 Block logged-in users from visiting auth pages
  if (jwt && authPages.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // or wherever you want to send logged-in users
    return NextResponse.redirect(url)
  }

  // 🔐 Block unauthenticated users from visiting protected pages
  if (!jwt && protectedPages.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login' // or your desired login page
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard',
    '/account',
    '/profile',
    "/project"
  ],
}
