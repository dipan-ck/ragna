import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProjectDetail from '@/components/ui/ProjectDetail';

async function getProjectData(projectId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get/${projectId}`, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!res.ok) {
    // Redirect on auth failure or project not found
    redirect('/auth/login');
  }

  const result = await res.json();
  return result.data;
}

export default async function Page({ params }: { params: { projectId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    // No token in cookies — block access
    redirect('/auth/login');
  }

  const data = await getProjectData(params.projectId, token);

  return (
    <div className="min-h-screen flex flex-col items-center bg-black w-full">
      <ProjectDetail data={data} />
    </div>
  );
}
