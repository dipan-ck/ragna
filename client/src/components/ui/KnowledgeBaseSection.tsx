'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuccessToast, ErrorToast } from './Toast';
import { useGetFile } from '@/lib/hooks/useGetFile';
import UploadSection from './UploadSection';
import FileList from './FileList';
import { uploadFile, uploadTextContent, deleteFile } from '@/lib/fileService';
import { normalizeFile, validateFile, formatFileSize } from '@/lib/fileUtils';

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

function KnowledgeBaseSection({ project }: { project: Project }) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [localFiles, setLocalFiles] = useState<FileItem[]>([]);
  
  const queryClient = useQueryClient();
  const { data: filesRaw = [], isLoading, error, refetch } = useGetFile(project._id);

  const files = useMemo(() => 
    Array.isArray(filesRaw) ? filesRaw.map(normalizeFile) : [],
    [filesRaw]
  );

  const fileUploadMutation = useMutation({
    mutationFn: ({ file, projectId }: { file: File; projectId: string }) => uploadFile(file, projectId),
    onSuccess: (data) => {
      SuccessToast(data.message || 'File uploaded');
      queryClient.invalidateQueries({ queryKey: ['file', project._id] });
    },
    onError: (error: Error) => ErrorToast(error.message)
  });

  const textUploadMutation = useMutation({
    mutationFn: ({ content, projectId, name }: { content: string; projectId: string; name: string }) => 
      uploadTextContent(content, projectId, name),
    onSuccess: (data) => {
      SuccessToast(data.message || 'Text added');
      setTextContent('');
      setShowTextArea(false);
      queryClient.invalidateQueries({ queryKey: ['file', project._id] });
    },
    onError: (error: Error) => ErrorToast(error.message)
  });

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string | number) => deleteFile(fileId),
    onSuccess: (data) => {
      SuccessToast(data.message || 'File deleted');
      queryClient.setQueryData(['file', project._id], data.data?.map(normalizeFile) || []);
    },
    onError: (error: Error) => ErrorToast(error.message)
  });

const handleFiles = useCallback(
  async (fileList: FileList) => {
    for (const [index, file] of Array.from(fileList).entries()) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        ErrorToast(validation.error || 'Invalid file');
        continue;
      }

      const tempId = Date.now() + index;
      const newFile: FileItem = {
        id: tempId,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase(),
        size: formatFileSize(file.size),
        chunks: Math.ceil(file.size / 1000),
        uploadedDate: new Date().toLocaleDateString(),
        uploading: true,
        progress: 0,
      };

      setLocalFiles(prev => [...prev, newFile]);

      try {
        const res = await uploadFile(file, project._id);
        SuccessToast(res.message || 'File uploaded');
        queryClient.invalidateQueries({ queryKey: ['file', project._id] });
      } catch (err: any) {
        ErrorToast(err.message);
      } finally {
        setLocalFiles(prev => prev.filter(f => f.id !== tempId));
      }
    }
  },
  [project._id, queryClient]
);


  const handleAddContent = useCallback(() => {
    if (!textContent.trim()) return ErrorToast('Content cannot be empty');
    textUploadMutation.mutate({ content: textContent, projectId: project._id, name: 'Text Content' });
  }, [textContent, textUploadMutation, project._id]);

  const handleDeleteFile = useCallback((fileId: string | number) => {
    if (confirm('Delete this file?')) deleteFileMutation.mutate(fileId);
  }, [deleteFileMutation]);

  const totalFiles = useMemo(() => files.length + localFiles.length, [files, localFiles]);
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

export default React.memo(KnowledgeBaseSection);
