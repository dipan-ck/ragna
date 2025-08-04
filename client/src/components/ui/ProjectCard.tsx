"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/store/projectsStore";
import { LineChart, MoreVertical, Database, Calendar } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  idx: number;
  dropdownOpenIdx: number | null;
  setDropdownOpenIdx: React.Dispatch<React.SetStateAction<number | null>>;
  openDeleteDialog: (project: Project) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  idx,
  dropdownOpenIdx,
  setDropdownOpenIdx,
  openDeleteDialog,
}) => {
  const router = useRouter();

  return (
    <div
      key={project._id}
      className="bg-[#0A0A0A] border-[1px] border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-colors duration-200 hover:bg-[#101010] relative opacity-0 translate-y-4 animate-fadein"
      style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "forwards" }}
      onClick={() => router.push(`/project/${project._id}`)}
    >
      {/* Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="p-1 rounded-full hover:bg-[#131313] focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpenIdx(dropdownOpenIdx === idx ? null : idx);
          }}
        >
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
        {dropdownOpenIdx === idx && (
          <div className="absolute right-0 mt-2 w-28 bg-[#101010] border border-[#23262F] rounded-lg shadow-lg py-1 z-20">
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#0c0c0c] rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpenIdx(null);
                openDeleteDialog(project);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white">{project.name}</span>
          <div className="flex items-center gap-2 mt-1">
            {project.status === "active" ? (
              <span className="flex items-center px-2 py-[4px] rounded-full text-[10px]  border-[1px] border-[#2194FF] bg-[#0a1526] text-[#2194FF]">
                <LineChart className="w-3 h-3 mr-1" />
                {project.status}
              </span>
            ) : (
              <span className="px-2 py-[4px] rounded-full text-[10px]  border-[1px] border-[#ca3838] bg-[#260a0c] text-[#ca3838]">
                {project.status}
              </span>
            )}
            <span className="px-3 py-[5px] rounded-full text-[10px]  font-medium bg-[#16171b00] text-[#ffffff] border border-[#303030]">
              {project.model}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Database className="w-4 h-4" />
          <span>Tokens used</span>
          <span className="ml-auto text-white font-medium">{project.tokensUsed}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="w-4 h-4" />
          <span>Created</span>
          <span className="ml-auto text-white font-medium">{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
