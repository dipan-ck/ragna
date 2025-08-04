'use client';

import React, { useState } from 'react';
import { useProject } from '@/lib/hooks/useProject';
import { Project } from '@/store/projectsStore';
import ProjectCard from '@/components/ui/ProjectCard';
import DeleteProjectDialog from '@/components/ui/DeleteProjectDialog';
import { ErrorToast, SuccessToast } from './Toast';
import { useUser } from '@/lib/hooks/useUser';
import { useNotificationUnreadCheck } from "@/lib/hooks/useNotificationUnreadCheck";

interface ProjectsProps {
  serverProjects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ serverProject }) => {
  const { data: projects, isLoading, refetch} = useProject(serverProject);
  const {refetch : userFeatch} = useUser()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);
  const {refetch : notificationStatus} = useNotificationUnreadCheck();

  const handleDelete = async (project: Project) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/delete/${project._id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const resp = await res.json();

    if (!res.ok) {
      ErrorToast(resp.message);
    }else{
      setDeleteDialogOpen(false);
      refetch()
      notificationStatus()
      userFeatch()
      SuccessToast(resp.message);
    }

  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      handleDelete(selectedProject);
    }
    closeDeleteDialog();
  };

  if(isLoading){
    return null
  }

  return (
    <div className="w-[90%] mx-auto mt-8">
      <h2 className="text-xl font-medium tracking-tighter text-white mb-4">
        Your Projects
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[200px] rounded-4xl">
          <span className="mb-2">
            <span className="block w-10 h-10 border-4 border-[#fefefe] border-t-transparent rounded-full animate-spin"></span>
          </span>
          <span className="text-xl text-white">Loading projects...</span>
        </div>
      ) : Array.isArray(projects) && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] border-[1px] border-dashed border-[#2a2a2a] rounded-4xl">
          <span className="text-2xl tracking-tight font-medium text-white mb-2">
            Create your first project
          </span>
          <span className="text-base text-gray-400 mb-4">
            Start by adding a new model
          </span>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects?.map((project: Project, idx) => (
            <ProjectCard
              key={project._id}
              project={project}
              idx={idx}
              dropdownOpenIdx={dropdownOpenIdx}
              setDropdownOpenIdx={setDropdownOpenIdx}
              openDeleteDialog={openDeleteDialog}
            />
          ))}
        </div>
      )}

      {deleteDialogOpen && selectedProject && (
        <DeleteProjectDialog
          selectedProject={selectedProject}
          closeDeleteDialog={closeDeleteDialog}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default Projects;
