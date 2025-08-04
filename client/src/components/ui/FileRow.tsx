import React from 'react';
import { FileText, File, FileSpreadsheet, Trash2 } from 'lucide-react';

interface FileRowProps {
  file: {
    id: string | number;
    name: string;
    fileType?: string;
    sizeKB?: number;
    uploadedAt?: string;
    chunks?: number;
  };
  handleDeleteFile: (fileId: string | number) => void;
  deleteFilePending: boolean;
}

function getFileIcon(fileType?: string) {
  const iconClass = 'w-6 h-6 text-[#2194FF]';
  switch (fileType?.toLowerCase()) {
    case 'pdf':
    case 'txt':
    case 'text':
      return <FileText className={iconClass} />;
    case 'csv':
      return <FileSpreadsheet className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}

const FileRow: React.FC<FileRowProps> = ({ file, handleDeleteFile, deleteFilePending }) => (
  <div
    className="flex items-center m-2 rounded-xl justify-between p-5 border-t-b border-gray-800 hover:bg-[#0a0a0a] transition-all duration-200"
  >
    <div className="flex items-center space-x-4 flex-1">
      <div className="flex-shrink-0 p-2 bg-[#0A1526] border-[1px] border-[#2194FF] rounded-lg">
        {getFileIcon(file.fileType)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm mb-1 truncate">{file.name}</h4>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span className="font-medium uppercase">{file.fileType || 'N/A'}</span>
          <span>{file.sizeKB ? `${file.sizeKB} KB` : 'N/A'}</span>
          {typeof file.chunks === 'number' && (
            <span>{file.chunks} chunks</span>
          )}
          <span>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Unknown date'}</span>
        </div>
      </div>
    </div>
    <button
      onClick={() => handleDeleteFile(file.id)}
      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={deleteFilePending}
      title="Delete file"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export default FileRow; 