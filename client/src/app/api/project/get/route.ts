import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get`, {
    headers: {
      Cookie: `token=${token}`,
    },
    credentials: 'include',
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
