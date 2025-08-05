import { cookies } from 'next/headers';
import Analytics from '../../../components/ui/Analytics';
import Projects from '../../../components/ui/Projects';
import Navbar from '../../../components/ui/Navbar';
import AddProjectButton from '@/components/ui/AddProjectButton';
import CreateProjectModal from '@/components/CreateProjectModal';
import { redirect } from 'next/navigation';

async function getUserData() {
  try {
    const cookieStore = cookies(); // Remove await
    const token = cookieStore.get('token')?.value; // Remove await

    if (!token) {
      console.log('No token found');
      return null;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/proxy/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: 'include',
      cache: 'no-store', // Add this to prevent caching issues
    });

    if (!res.ok) {
      console.log('User data fetch failed:', res.status);
      return null;
    }

    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

async function getUserProjects() {
  try {
    const cookieStore = cookies(); // Remove await
    const token = cookieStore.get('token')?.value;

    if (!token) {
      console.log('No token found for projects');
      return [];
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/proxy/project/get`, {
      credentials: 'include',
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store', // Add this to prevent caching issues
    });

    if (!res.ok) {
      console.log('Projects fetch failed:', res.status);
      return [];
    }

    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await getUserData();
  const projects = await getUserProjects();

  // Redirect to login if no user data
  if (!user) {
    redirect('/login'); // or wherever your login page is
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-black w-full text-white">
      <Navbar user={user} projects={projects} />
      
      <div className="flex flex-col items-center w-full text-white p-8">
        <div className="flex justify-between w-[90%] items-center mb-8">
          {/* Left: Text */}
          <div className="text-left">
            <h1 className="text-2xl tracking-tight font-medium">
              Hello, {user?.fullName || 'User'}
            </h1>
            <p className="text-gray-400 text-xs mt-2">
              Manage your AI, vector Databases and files.
            </p>
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