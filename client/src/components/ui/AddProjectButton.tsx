"use client"

import React from 'react';
import { LucidePlus } from 'lucide-react';
import useCreateProjectModalStore from '@/store/createProjectModalStore';

function AddProjectButton() {
  const { openModal } = useCreateProjectModalStore();

  return (
    <button
      className="bg-white cursor-pointer relative overflow-hidden text-sm text-black font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
      onClick={openModal} 
    >

        <LucidePlus /> {/* Add the plus icon */}
        Add New Project

    </button>
  );
}

export default AddProjectButton;