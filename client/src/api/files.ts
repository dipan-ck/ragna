import { api } from "@/lib/axios";

export type FileStatus =
    | "UPLOADING"
    | "UPLOADED"
    | "PROCESSING"
    | "READY"
    | "FAILED";

export type ProjectFile = {
    id: string;
    name: string;
    mimeType: string | null;
    size: number | null;
    status: FileStatus;
    createdAt: string;
};

export const filesApi = {
    getProjectFiles: async (projectId: string): Promise<ProjectFile[]> => {
        const { data } = await api.get(`/api/file/project/${projectId}`);
        return data;
    },
    getUploadUrl: async (payload: {
        projectId: string;
        filename: string;
        mimeType: string;
    }) => {
        const { data } = await api.post("/api/file/upload-url", payload);
        return data as { uploadUrl: string; s3Key: string };
    },
    confirmUpload: async (payload: {
        projectId: string;
        filename: string;
        mimeType: string;
        s3Key: string;
        size: number;
    }) => {
        await api.post("/api/file/confirm-upload", payload);
    },
    deleteFile: async (fileId: string) => {
        await api.delete(`/api/file/${fileId}`);
    },
    retriggerEmbedding: async (fileId: string) => {
        await api.post(`/api/file/${fileId}/reembed`);
    },
    getDownloadUrl: async (
        fileId: string,
    ): Promise<{ url: string; name: string; mimeType: string | null }> => {
        const { data } = await api.get(`/api/file/${fileId}/download-url`);
        return data;
    },
    uploadToS3: (
        url: string,
        file: File,
        onProgress: (pct: number) => void,
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable)
                    onProgress(Math.round((e.loaded / e.total) * 100));
            });
            xhr.addEventListener("load", () =>
                xhr.status < 300
                    ? resolve()
                    : reject(new Error(`S3 upload failed: ${xhr.status}`)),
            );
            xhr.addEventListener("error", () =>
                reject(new Error("Upload failed")),
            );
            xhr.open("PUT", url);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
        });
    },
};
