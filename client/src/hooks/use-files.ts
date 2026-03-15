import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "@/api/files";

export const FILE_KEYS = {
    project: (projectId: string) => ["files", projectId] as const,
    downloadUrl: (fileId: string) => ["file-download-url", fileId] as const,
};

export function useProjectFiles(projectId: string) {
    return useQuery({
        queryKey: FILE_KEYS.project(projectId),
        queryFn: () => filesApi.getProjectFiles(projectId),
        enabled: !!projectId,
    });
}

export function useFileDownloadUrl(fileId: string | null) {
    return useQuery({
        queryKey: FILE_KEYS.downloadUrl(fileId ?? ""),
        queryFn: () => filesApi.getDownloadUrl(fileId!),
        enabled: !!fileId,
        staleTime: 50 * 60 * 1000, // 50 min, URL expires in 60
    });
}

export function useDeleteFile(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: filesApi.deleteFile,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: FILE_KEYS.project(projectId),
            }),
    });
}

export function useRetriggerEmbedding(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: filesApi.retriggerEmbedding,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: FILE_KEYS.project(projectId),
            }),
    });
}
