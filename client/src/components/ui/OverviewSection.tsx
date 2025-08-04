"use client";

import {
  CalendarDays,
  Cpu,
  FileText,
  Zap,
  Save,
  Loader2,
  Edit,
} from "lucide-react";
import React, { useState } from "react";

import { useGetProject } from "@/lib/hooks/useGetProject";
import OverviewSectionSkeleton from "../skeleton/OverviewSkeleton";
import { SuccessToast } from "./Toast";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "./submitButton";
import ModelSelect from "./ModelSelect";

interface OverviewSectionProps {
  project: {
    name: string;
    model?: string;
    createdAt: string;
    status: boolean;
    tokensUsed?: number;
    id: number;
    totalFiles?: number;
    apiKey?: string;
    _id: string;
    AgentInstructions?: string;
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OverviewSection: React.FC<OverviewSectionProps> = ({ project }) => {
  const { data, isLoading } = useGetProject(project._id, project);
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState(project.name);
  const [instructions, setInstructions] = useState(project.AgentInstructions || "");
  const [selectedModel, setSelectedModel] = useState(project.model || "gemini-2.0-flash");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function saveChanges() {
    setIsSaving(true);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/update/${project._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: projectName,
            AgentInstructions: instructions,
            model: selectedModel
          })
        }
      );

      if (!req.ok) {
        throw new Error('Failed to update project');
      }

      const result = await req.json();
      await queryClient.invalidateQueries({ queryKey: ["project"] });
      SuccessToast("Project updated successfully");
      setIsEditing(false);
      return result.data;
    } catch (err) {
      console.error("Failed to update project:", err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !data) {
    return <OverviewSectionSkeleton />;
  }

  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] p-8 rounded-2xl flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#ffffff]" />
            <p className="text-white font-medium">Saving changes...</p>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12 bg-black text-white">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              icon={<Cpu className="w-6 h-6 text-[#2194FF]" />}
              title="Model"
              value={data.model || "N/A"}
            />
            <Card
              icon={<Zap className="w-6 h-6 text-[#2194FF]" />}
              title="Tokens Used"
              value={data.tokensUsed?.toLocaleString() ?? 0}
            />
            <Card
              icon={<FileText className="w-6 h-6 text-[#2194FF]" />}
              title="Files"
              value={data.totalFiles ?? 0}
            />
            <Card
              icon={<CalendarDays className="w-6 h-6 text-[#2194FF]" />}
              title="Created"
              value={formatDate(data.createdAt)}
            />
          </div>
          <div className="rounded-3xl border border-[#151515] p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-medium tracking-tighter text-white">
                Project Settings
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-white text-sm font-medium bg-[#191919] py-2 px-4 rounded-full hover:bg-[#292929] cursor-pointer transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Project</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium mb-3 text-gray-300">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full bg-[#0A0A0A] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none ${isEditing ? 'focus:border-[#ffffff] focus:ring-1 focus:ring-[#ffffff]' : 'cursor-not-allowed opacity-70'} transition-all`}
                  />
                </div>

                <ModelSelect
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-3 text-gray-300">Agent Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={!isEditing}
                  rows={6}
                  className={`w-full bg-[#0A0A0A] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none ${isEditing ? 'focus:border-[#5b5b5b] focus:ring-1 focus:ring-[#ffffff]' : 'cursor-not-allowed opacity-70'} transition-all resize-none`}
                  placeholder="Enter instructions for the agent..."
                />
              </div>
            </div>

            {isEditing && (
              <SubmitButton
                onClick={saveChanges}
                label="Save Changes"
                loadingLabel="Saving..."
                icon={<Save className="w-4 h-4" />}
                className="mt-8 w-full sm:w-auto bg-white py-2 hover:bg-[#ccc] cursor-pointer transition-all duration-300"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Card = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) => (
  <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-[#1f1f1f] duration-300">
    <div className="flex flex-col gap-4">
      <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
        {icon} {title}
      </span>
      <span className="text-2xl font-medium bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {value}
      </span>
    </div>
  </div>
);

export default OverviewSection;
