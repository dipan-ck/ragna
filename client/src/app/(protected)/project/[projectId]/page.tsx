
import ProjectDetail from '@/components/ui/ProjectDetail';
import { cookies } from 'next/headers';

async function getProjectData(projectId: string) {
 
    const cookieStore =  await cookies();
  const cookieHeader = cookieStore.toString();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/proxy/project/get/${projectId}`, {
    cache: 'no-store',
    headers: {
      'Cookie': cookieHeader, 
    }
  });



  const result = await res.json();

  if (!res.ok || !result.success || !result.data) {
  console.log(res);
  
  }

  return result.data;
}

export default async function Page({ params }: { params: { projectId: string } }) {


  const data = await getProjectData(params.projectId);

  return (
    <div className="min-h-screen flex flex-col items-center bg-black w-full">
      <ProjectDetail data={data} />
    </div>
  );
}
