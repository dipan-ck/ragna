import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/project";

export const PROJECT_KEYS = {
    all: ["projects"] as const,
};

export function useProjects() {
    return useQuery({
        queryKey: PROJECT_KEYS.all,
        queryFn: projectsApi.getAll,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
    });
}

export function useUpdateProjectTitle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            projectsApi.updateTitle(id, name),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
    });
}
