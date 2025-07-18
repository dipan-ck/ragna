// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import Analytics from './Analytics';
import Models from './Models';
import { LucidePlus, LucideBookOpen } from 'lucide-react'; // Import icons from Lucide
import Navbar from './Navbar';

interface User {
  email: string;
  fullName: string;
  isVerified: boolean;
  avatar: string;
  usage: number;
  subscriptionStatus: string;
  plan: string;
}

async function getUserData(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) return null;

    const result = await res.json();
    return result.data;
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUserData();

  if (!user) {
    // If user is not authenticated, redirect to login
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>User not authenticated. Redirecting...</p>
        <meta httpEquiv="refresh" content="1; url=/login" />
      </main>
    );
  }

  const models = [];

  return (
    <main className="min-h-screen flex flex-col items-center bg-black w-full text-white">
      {/* Navbar */}
      <Navbar user={user}/>


      {/* Main content */}
      <div className="flex flex-col items-center w-full text-white p-8">
        {/* Header section */}
        <div className="flex justify-between w-[90%] items-center mb-8">
          <div>
            <h1 className="text-3xl tracking-tight font-medium">Hello, {user.fullName}</h1>
            <p className="text-gray-400 mt-2">Manage your AI, vector Databases and files.</p>
          </div>
          <button className="bg-white cursor-pointer text-black font-medium px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <LucidePlus /> {/* Add the plus icon */}
            Create New Project
          </button>
        </div>

        <Analytics usage={user.usage} />

        <Models models={models} />
      </div>
    </main>
  );
}
