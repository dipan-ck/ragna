import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <FileText className="w-16 h-16 text-gray-600 mb-4" />
    <h3 className="text-lg font-medium text-gray-300 mb-2">No files uploaded yet</h3>
    <p className="text-gray-500">Upload your first file or add text content to get started.</p>
  </div>
);

export default EmptyState; 