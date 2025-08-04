'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export default function UploadFileDropzone({ onFiles }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-[1px] border-dashed rounded-4xl p-12 h-full text-center transition-all duration-300 ${
        dragActive ? 'border-gray-400 bg-gray-900/20' : 'border-gray-600 hover:border-[#2185ff]'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.csv"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center space-y-6">
        <Upload className="w-8 h-8 text-gray-500 mx-auto mb-4" />
        <h3 className="text-md font-medium text-white mb-2">Upload Files</h3>
        <p className="text-gray-400 text-xs mb-3">Drag & drop files or click to browse</p>
        <p className="text-gray-500 text-xs">Supports PDF, DOCX, TXT, CSV (Max 10MB)</p>
        <button
          onClick={openFileDialog}
          className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm"
        >
          Choose Files
        </button>
      </div>

      {dragActive && (
        <div className="absolute inset-0 bg-gray-800/20 rounded-lg flex items-center justify-center">
          <div className="text-gray-300 font-medium">Drop files here</div>
        </div>
      )}
    </div>
  );
}
