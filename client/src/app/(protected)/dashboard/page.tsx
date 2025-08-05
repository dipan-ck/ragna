'use client';

import { useEffect, useState } from 'react';
import Analytics from '@/components/ui/Analytics';
import Projects from '@/components/ui/Projects';
import Navbar from '@/components/ui/Navbar';
import AddProjectButton from '@/components/ui/AddProjectButton';
import CreateProjectModal from '@/components/CreateProjectModal';
import Loader from '@/components/ui/Loader';
import { useUser } from '@/lib/hooks/useUser';
import { useProject } from '@/lib/hooks/useProject';


export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [userRes, projectRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
            credentials: 'include',
          }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get`, {
            credentials: 'include',
          }),
        ]);

        const userData = await userRes.json();
        const projectData = await projectRes.json();

        if (userData.success) {
          setUser(userData.data);
        } else {
          console.error('User fetch failed', userData.message);
        }

        if (projectData.success) {
          setProjects(projectData.data);
        } else {
          console.error('Project fetch failed', projectData.message);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

         useUser(user);
       

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader/>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-black w-full text-white">
      <Navbar projects={projects} />

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

        <Analytics/>
        <Projects fetchedProjects={projects}/>
      </div>

      <CreateProjectModal />
    </main>
  );
}
