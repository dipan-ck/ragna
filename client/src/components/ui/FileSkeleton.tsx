import React from 'react';

const FileSkeleton = () => (
  <div className="flex items-center justify-between p-5 border-b border-gray-800 animate-pulse">
    <div className="flex items-center space-x-4 flex-1">
      <div className="w-10 h-10 bg-gray-700 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="w-3/5 h-4 bg-gray-700 rounded" />
        <div className="w-2/5 h-3 bg-gray-800 rounded" />
      </div>
    </div>
    <div className="w-6 h-6 bg-gray-700 rounded" />
  </div>
);

export default FileSkeleton; 