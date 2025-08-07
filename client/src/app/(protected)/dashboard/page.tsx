// app/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Analytics from '@/components/ui/Analytics'
import Projects from '@/components/ui/Projects'
import Navbar from '@/components/ui/Navbar'
import AddProjectButton from '@/components/ui/AddProjectButton'
import CreateProjectModal from '@/components/CreateProjectModal'
import { useUser } from '@/lib/hooks/useUser'
import Loader from '@/components/ui/Loader'



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


export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const {data: user} = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/get`, {
          credentials: 'include',

        })
        const data = await response.json()
        
        if (data.data) {
          setProjects(data.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])




  if(loading){
    return (
      <div className="min-h-screen flex flex-col items-center bg-black w-full text-white">
        <Loader/>
      </div>
    )
  }



  return (
    <main className="min-h-screen  flex flex-col items-center  w-full text-white">



      <Navbar projects={projects} />
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
        <Analytics/>
      
        <Projects fetchedProjects={projects} />
      
      </div>
      <CreateProjectModal />
    </main>
  )
}
