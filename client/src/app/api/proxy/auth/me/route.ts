// app/api/proxy/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: 'include',
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Proxy /auth/me failed', error);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
