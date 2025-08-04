import React from 'react';
import { FileText, File, FileSpreadsheet, RefreshCw } from 'lucide-react';

function getFileIcon(type?: string) {
  const iconClass = 'w-6 h-6 text-gray-400';
  switch (type?.toLowerCase()) {
    case 'pdf':
    case 'txt':
      return <FileText className={iconClass} />;
    case 'csv':
      return <FileSpreadsheet className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}

const LocalFileRow = ({ file }: { file: any }) => (
  <div className="flex items-center justify-between p-5 border-b border-gray-800">
    <div className="flex items-center space-x-4 flex-1">
      <div className="flex-shrink-0 p-2 rounded-lg">
        {getFileIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm mb-1 truncate">{file.name}</h4>
        <div className="flex items-center space-x-4 text-xs text-blue-300">
          <span>Uploading...</span>
          <span className="font-medium uppercase">{file.type}</span>
          <span>{file.size}</span>
        </div>
      </div>
    </div>
    <div className="w-6 h-6">
      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
    </div>
  </div>
);

export default LocalFileRow; 