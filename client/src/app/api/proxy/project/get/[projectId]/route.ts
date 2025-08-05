import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {

 const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;


  if (!token) {
    return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get/${params.projectId}`, {
      method: 'GET',
    headers: {
  Authorization: `Bearer ${token}`,
},

      credentials: 'include',
      cache: 'no-store',
    });

    const backendData = await backendRes.json();


    return NextResponse.json({
      success: backendData.success,
      data: backendData.data || null,
      message: backendData.message || '',
    }, { status: backendRes.status });
  } catch (error) {
    console.error('Proxy project/[id] failed', error);
    return NextResponse.json({ success: false, message: 'Internal error', data: null }, { status: 500 });
  }
}
