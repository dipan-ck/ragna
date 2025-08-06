import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectMongoDB from '@/lib/mongo';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';
import ProjectDetail from '@/components/ui/ProjectDetail';

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

function verifyToken(token: string): DecodedToken {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

function sanitizeProject(project: any) {
  return {
    _id: project._id.toString(),
    name: project.name,
    userId: project.userId.toString(),
    apiKey: project.apiKey,
  };
}

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/auth/login');

    const decoded = verifyToken(token);
    await connectMongoDB();

    const project = await Project.findById(params.projectId).lean();

    if (!project || project.userId.toString() !== decoded.id) {
      redirect('/auth/login');
    }

    const projectData = sanitizeProject(project);

    return (
      <div className="min-h-screen flex flex-col items-center bg-black w-full text-white">
        <ProjectDetail data={projectData} />
      </div>
    );
  } catch (err) {
    console.error('[SSR Project Error]', err);
    redirect('/auth/login');
  }
}
