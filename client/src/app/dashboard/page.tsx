// app/dashboard/page.tsx
import connectMongoDB from '@/lib/mongo'
import User from '@/models/User'
import Project from '@/models/Project'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { Types, connection } from 'mongoose'
import Analytics from '@/components/ui/Analytics'
import Projects from '@/components/ui/Projects'
import Navbar from '@/components/ui/Navbar'
import AddProjectButton from '@/components/ui/AddProjectButton'
import CreateProjectModal from '@/components/CreateProjectModal'
import { useUser } from '@/lib/hooks/useUser'

interface UserData {
  _id: string
  email: string
  fullName: string
  isVerified: boolean
  avatar?: string
  usage?: number
  subscriptionStatus?: string
  plan?: string
}

interface ProjectData {
  _id: string
  userId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  model?: string
  status?: string
}

// --- Utility to sanitize Mongo documents ---
function sanitize<T extends Record<string, any>>(obj: T): T {
  if (obj._id?.toString) obj._id = obj._id.toString()
  if (obj.userId?.toString) obj.userId = obj.userId.toString()
  if (obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString()
  if (obj.updatedAt instanceof Date) obj.updatedAt = obj.updatedAt.toISOString()
  return obj
}

// --- Auth ---
function parseToken(token: string): { id: string } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    if (!decoded.id) throw new Error('Invalid token payload')
    return decoded
  } catch {
    throw new Error('Unauthorized')
  }
}

// --- Fetch user + projects concurrently ---
async function getUserData(userId: string): Promise<{ user: UserData; projects: ProjectData[] }> {
  const [user, projects] = await Promise.all([
    User.findById(userId)
      .select('email fullName isVerified avatar usage subscriptionStatus plan')
      .lean(),
    Project.find({ userId })
      .select('name description createdAt updatedAt userId model status')
      .sort({ updatedAt: -1 })
      .lean()
  ])

  if (!user) throw new Error('User not found')

  return {
    user: sanitize(user) as UserData,
    projects: (projects || []).map(p => sanitize(p)) as ProjectData[]
  }
}

// --- Main Component ---
export default async function DashboardPage() {
  try {
    // Ensure DB connected
    if (connection.readyState === 0) await connectMongoDB()

    // Get token from cookie
    const token = await cookies().get('token')?.value
    if (!token) throw new Error('No token found')

    // Parse and validate token
    const { id: userId } = parseToken(token)
    if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID')

    // Fetch user and project data
    const { user, projects } = await getUserData(userId)

    if ( !user || !user.isVerified) redirect('/auth/login')



    return (
      <main className="min-h-screen flex flex-col items-center bg-black w-full text-white">
        <Navbar projects={projects} fetchedUser={user} />
        <div className="flex flex-col items-center w-full text-white p-8">
          <div className="flex justify-between w-[90%] items-center mb-8">
            <div className="text-left">
              <h1 className="text-2xl tracking-tight font-medium">Hello, {user.fullName}</h1>
              <p className="text-gray-400 text-xs mt-2">Manage your AI, vector databases and files.</p>
            </div>
            <div className="flex items-center gap-4">
              <AddProjectButton />
            </div>
          </div>
          <Analytics fetchedUser={user}/>

          <Projects fetchedProjects={projects} />
        </div>
        <CreateProjectModal />
      </main>
    )
  } catch (err) {
    console.error('Dashboard error:', err)
    redirect('/auth/login')
  }
}
