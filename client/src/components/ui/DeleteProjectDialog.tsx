"use client";

import React from 'react';
import { Project } from '@/store/projectsStore';

interface DeleteProjectDialogProps {
  selectedProject: Project;
  closeDeleteDialog: () => void;
  confirmDelete: () => void;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  selectedProject,
  closeDeleteDialog,
  confirmDelete,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#000000ab] bg-opacity-60">
      <div className="bg-[#0A0A0A] border-[1px] border-[#2a2a2a] rounded-2xl p-8 shadow-2xl min-w-[320px] flex flex-col items-center">
        <span className="text-lg text-white mb-4">
          Are you sure you want to delete{" "}
          <span className="font-bold">{selectedProject.name}</span>?
        </span>
        <div className="flex gap-4 mt-2">
          <button
            className="px-4 py-2 rounded-xl border-[1px] border-[#252525] bg-[#090909] hover:bg-[#1b1b1b] transition-colors text-white"
            onClick={closeDeleteDialog}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-[#d73033] border-[#252525] text-white hover:bg-red-600 transition"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectDialog;
