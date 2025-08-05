import { cookies } from 'next/headers';
import Analytics from '../../../components/ui/Analytics';
import Projects from '../../../components/ui/Projects';
import Navbar from '../../../components/ui/Navbar';
import AddProjectButton from '@/components/ui/AddProjectButton';
import CreateProjectModal from '@/components/CreateProjectModal';

async function getUserData() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('token')?.value;

  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/me`, {
    headers: {
      Cookie: `token=${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) return null;

  const result = await res.json();
  return result.data;
}

async function getUserProjects() {
  const cookieStore = await cookies();
  const token =  cookieStore.get('token')?.value;

  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/project/get`, {
    credentials: 'include',
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!res.ok) return [];

  const result = await res.json();
  return result.data
}


export default async function DashboardPage() {
  const user = await getUserData();
  const projects = await getUserProjects();
  


  return (
    <main className="min-h-screen flex flex-col items-center bg-black w-full text-white">
      <Navbar user={user} projects={projects} />
       
      <div className="flex flex-col items-center w-full text-white p-8">
        <div className="flex justify-between w-[90%] items-center mb-8">
          {/* Left: Text */}
          <div className="text-left">
            <h1 className="text-2xl tracking-tight font-medium">Hello, {user.fullName}</h1>
            <p className="text-gray-400 text-xs mt-2">Manage your AI, vector Databases and files.</p>
          </div>
          {/* Right: Buttons */}
          <div className="flex items-center gap-4">
            <AddProjectButton />

          </div>
        </div>
        <Analytics serverUser={user} />
        <Projects serverProject={projects} />
      </div>
      <CreateProjectModal />
    </main>
  );
}
