import React from 'react';
import FileSkeleton from './FileSkeleton';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import FileRow from './FileRow';
import LocalFileRow from './LocalFileRow';

interface FileListProps {
  files: any[];
  localFiles: any[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
  handleDeleteFile: (fileId: string | number) => void;
  deleteFilePending: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  localFiles,
  isLoading,
  error,
  refetch,
  handleDeleteFile,
  deleteFilePending,
}) => {
  const totalFiles = files.length + localFiles.length;
  return (
    <div className="border border-gray-700 rounded-2xl overflow-hidden ">
      <div className="px-6 py-4 border-b border-gray-800 ">
        <h3 className="text-lg font-medium tracking-tight text-white flex items-center justify-between">
          Knowledge Base Files ({totalFiles})
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {error ? (
          <ErrorState error={error as Error} onRetry={refetch} />
        ) : isLoading ? (
          <>
            <FileSkeleton />
            <FileSkeleton />
            <FileSkeleton />
          </>
        ) : (
          <>
            {localFiles.map((file) => (
              <LocalFileRow key={file.id} file={file} />
            ))}
            {files.length > 0 ? (
              files.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  handleDeleteFile={handleDeleteFile}
                  deleteFilePending={deleteFilePending}
                />
              ))
            ) : localFiles.length === 0 ? (
              <EmptyState />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default FileList; 