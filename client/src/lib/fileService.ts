// /lib/services/fileService.ts

export const uploadFile = async (file: File, projectId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/upload/file`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

export const uploadTextContent = async (content: string, projectId: string, name: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/upload/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ projectId, content, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to upload text content');
  }

  return response.json();
};

export const deleteFile = async (fileId: string | number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete file');
  }

  return response.json();
};
