// lib/getUserFromCookie.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getUserIdFromCookie(){
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  console.log(token);
  
  
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    return decoded.id
  } catch {
    return null
  }
}
