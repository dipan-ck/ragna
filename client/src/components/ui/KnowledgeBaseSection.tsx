'use client';

import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, File, FileSpreadsheet, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { SuccessToast, ErrorToast } from './Toast';
import { useGetFile } from '@/lib/hooks/useGetFile';
import UploadSection from './UploadSection';
import FileList from './FileList';

// Types
interface Project {
  _id: string;
  name: string;
}

interface FileItem {
  id: number;
  name: string;
  type?: string;
  size: string;
  chunks: number;
  uploadedDate: string;
  uploading: boolean;
  progress: number;
}

interface RemoteFileItem {
  id: string | number;
  name: string;
  type?: string;
  size?: string;
  chunks?: number;
  uploadedDate?: string;
  createdAt?: string;
}

// Type for backend file object
type BackendFile = {
  _id?: string | number;
  id?: string | number;
  name: string;
  fileType?: string;
  sizeKB?: number;
  uploadedAt?: string;
  chunks?: number;
};

// API functions
const uploadFile = async (file: File, projectId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/upload/file`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

const uploadTextContent = async (content: string, projectId: string, name: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/upload/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      projectId,
      content,
      name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload text content');
  }

  return response.json();
};

const deleteFile = async (fileId: string | number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId }),  // ✅ send fileId in body
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete file');
  }

  return response.json();  // expected to return { success, message, data: updatedFiles }
};


// Components
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

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">Failed to load files</h3>
    <p className="text-gray-400 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <FileText className="w-16 h-16 text-gray-600 mb-4" />
    <h3 className="text-lg font-medium text-gray-300 mb-2">No files uploaded yet</h3>
    <p className="text-gray-500">Upload your first file or add text content to get started.</p>
  </div>
);

// Normalized file for FileRow
type NormalizedFile = {
  id: string | number;
  name: string;
  fileType?: string;
  sizeKB?: number;
  uploadedAt?: string;
  chunks?: number;
};

function normalizeFile(file: BackendFile): NormalizedFile {
  return {
    id: file._id ?? file.id ?? '',
    name: file.name,
    fileType: file.fileType,
    sizeKB: file.sizeKB,
    uploadedAt: file.uploadedAt,
    chunks: file.chunks,
  };
}

function KnowledgeBaseSection({ project }: { project: Project }) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [localFiles, setLocalFiles] = useState<FileItem[]>([]);
  
  const queryClient = useQueryClient();
  const {
    data: filesRaw = [],
    isLoading,
    error,
    refetch,
  } = useGetFile(project._id);

  // Always normalize file data from backend
  const files: NormalizedFile[] = Array.isArray(filesRaw)
    ? filesRaw.map(normalizeFile)
    : [];

  // File upload mutation
  const fileUploadMutation = useMutation({
    mutationFn: ({ file, projectId }: { file: File; projectId: string }) => 
      uploadFile(file, projectId),
    onSuccess: (data) => {
      SuccessToast(data.message || 'File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['file', project._id] });
      refetch();
    },
    onError: (error: Error) => {
      ErrorToast(error.message || 'Upload failed');
    },
  });

  // Text content upload mutation
  const textUploadMutation = useMutation({
    mutationFn: ({ content, projectId, name }: { content: string; projectId: string; name: string }) => 
      uploadTextContent(content, projectId, name),
    onSuccess: (data) => {
      SuccessToast(data.message || 'Text content added successfully');
      queryClient.invalidateQueries({ queryKey: ['file', project._id] });
      setTextContent('');
      setShowTextArea(false);
      refetch();
    },
    onError: (error: Error) => {
      ErrorToast(error.message || 'Failed to add text content');
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string | number) => deleteFile(fileId),
    onSuccess: (data) => {
      SuccessToast(data.message || 'File deleted successfully');
      // Normalize and update cache
      const normalized = Array.isArray(data.data) ? data.data.map(normalizeFile) : [];
      queryClient.setQueryData(['file', project._id], normalized);
      refetch();
    },
    onError: (error: Error) => {
      ErrorToast(error.message || 'Failed to delete file');
    },
  });
  

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `File type ${file.type} is not supported` };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    return { isValid: true };
  }, []);

  const handleFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file, index) => {
      const validation = validateFile(file);
      
      if (!validation.isValid) {
        ErrorToast(validation.error || 'Invalid file');
        return;
      }

      const newFile: FileItem = {
        id: Date.now() + index,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase(),
        size: formatFileSize(file.size),
        chunks: Math.ceil(file.size / 1000),
        uploadedDate: new Date().toLocaleDateString(),
        uploading: true,
        progress: 0,
      };

      setLocalFiles(prev => [...prev, newFile]);
      
      fileUploadMutation.mutate(
        { file, projectId: project._id },
        {
          onSettled: () => {
            setLocalFiles(prev => prev.filter(f => f.id !== newFile.id));
            refetch();
          },
        }
      );
    });
  }, [validateFile, formatFileSize, fileUploadMutation, project._id, refetch]);

  const handleAddContent = useCallback(() => {
    if (textContent.trim() === '') {
      ErrorToast('Content cannot be empty');
      return;
    }

    textUploadMutation.mutate({
      content: textContent,
      projectId: project._id,
      name: 'Text Content',
    });
  }, [textContent, textUploadMutation, project._id]);

  const handleDeleteFile = useCallback((fileId: string | number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteFileMutation.mutate(fileId);
    }
  }, [deleteFileMutation]);

  const getFileIcon = useCallback((type: string | undefined) => {
    const iconClass = "w-6 h-6 text-gray-400";
    switch (type?.toLowerCase()) {
      case 'pdf':
      case 'txt':
        return <FileText className={iconClass} />;
      case 'csv':
        return <FileSpreadsheet className={iconClass} />;
      default:
        return <File className={iconClass} />;
    }
  }, []);

  const renderFileRow = useCallback((file: NormalizedFile) => (
    <div
      key={file.id}
      className="flex items-center justify-between p-5 border-b border-gray-800 hover:bg-gray-900/50 transition-all duration-200"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex-shrink-0 p-2 bg-gray-800 rounded-lg">
          {getFileIcon(file.fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm mb-1 truncate">{file.name}</h4>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className="font-medium uppercase">{file.fileType}</span>
            <span>{file.sizeKB ? `${file.sizeKB} KB` : 'N/A'}</span>
            {typeof file.chunks === 'number' && (
              <span>{file.chunks} chunks</span>
            )}
            <span>
              {file.uploadedAt || (file.chunks 
                ? new Date(file.uploadedAt || '').toLocaleDateString()
                : 'Unknown date'
              )}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleDeleteFile(file.id)}
        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={deleteFileMutation.isPending}
        title="Delete file"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ), [getFileIcon, handleDeleteFile, deleteFileMutation.isPending]);

  const totalFiles = files.length + localFiles.length;
  const isUploading = fileUploadMutation.isPending || textUploadMutation.isPending;

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-28 mt-18">
      <UploadSection
        showTextArea={showTextArea}
        setShowTextArea={setShowTextArea}
        textContent={textContent}
        setTextContent={setTextContent}
        handleFiles={handleFiles}
        handleAddContent={handleAddContent}
        isUploading={isUploading}
        textUploadPending={textUploadMutation.isPending}
      />
      <FileList
        files={files}
        localFiles={localFiles}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        handleDeleteFile={handleDeleteFile}
        deleteFilePending={deleteFileMutation.isPending}
      />
    </div>
  );
}

export default KnowledgeBaseSection;