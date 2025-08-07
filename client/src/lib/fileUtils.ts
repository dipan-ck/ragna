// /lib/utils/fileUtils.ts

export type BackendFile = {
  _id?: string | number;
  id?: string | number;
  name: string;
  fileType?: string;
  sizeKB?: number;
  uploadedAt?: string;
  chunks?: number;
};

export type NormalizedFile = {
  id: string | number;
  name: string;
  fileType?: string;
  sizeKB?: number;
  uploadedAt?: string;
  chunks?: number;
};

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Convert backend file object into a consistent format for UI
 */
export function normalizeFile(file: BackendFile): NormalizedFile {
  return {
    id: file._id ?? file.id ?? '',
    name: file.name,
    fileType: file.fileType,
    sizeKB: file.sizeKB,
    uploadedAt: file.uploadedAt,
    chunks: file.chunks,
  };
}

/**
 * Human-readable file size formatter
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Validates file type and size
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} is not supported` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }
  return { isValid: true };
}
