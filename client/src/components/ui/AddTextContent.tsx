'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';

export default function AddTextContent() {
  return (
    <div className="border-[1px] border-dashed h-full border-gray-600 rounded-4xl p-12 text-center hover:border-[#2185ff] transition-colors duration-300">
      <div className="flex flex-col items-center space-y-6">
        <FileText className="w-8 h-8 text-gray-500 mx-auto" />
        <h3 className="text-md font-medium text-white mb-2">Add Text Content</h3>
        <p className="text-gray-400 text-xs">Manually add text content to your knowledge base</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm">
          <Plus className="w-4 h-4" />
          Add Text
        </button>
      </div>
    </div>
  );
}
