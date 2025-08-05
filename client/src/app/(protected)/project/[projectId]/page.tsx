'use client';

import { useEffect, useState } from 'react';
import ProjectDetail from '@/components/ui/ProjectDetail';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/ui/Loader';

interface Project {
  _id: string;
  name: string;
  userId: string;
  apiKey: string;
}

export default function ProjectPage() {
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const projectId = params?.projectId as string;
      if (!projectId) return;

      try {
        const resProject = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get/${projectId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const projectResult = await resProject.json();
        if (!resProject.ok || !projectResult.success) {
          console.error('Project fetch failed', projectResult.message);
          router.push('/auth/login');
          return;
        }

        const project = projectResult.data;
        setProjectData(project);

      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.projectId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Project not found or unauthorized.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black w-full">
      <ProjectDetail data={projectData}/>

    </div>
  );
}
