'use client';

import { useEffect, useState } from 'react';
import ProjectDetail from '@/components/ui/ProjectDetail';
import { useParams } from 'next/navigation';
import Loader from '@/components/ui/Loader';

interface ProjectData {
  _id: string;
  name: string;
  userId: string;
  apiKey: string;
}

export default function ProjectPage() {

  const params = useParams<{ projectId: string }>();




  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get/${params.projectId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProjectData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('[Project Fetch Error]', err);
      }
    };

    fetchProject();
  }, [params.projectId]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-black w-full text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-black w-full text-white">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black w-full text-white">
      <ProjectDetail data={projectData} />
    </div>
  );
}
