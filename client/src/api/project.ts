import { api } from "@/lib/axios";

export type Project = {
    id: string;
    name: string;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
};

export const projectsApi = {
    getAll: async (): Promise<Project[]> => {
        const { data } = await api.get("/api/project");
        return data;
    },
    create: async (payload: {
        name: string;
        instructions?: string;
    }): Promise<Project> => {
        const { data } = await api.post("/api/project/create", payload);
        return data;
    },
    updateTitle: async (id: string, name: string): Promise<Project> => {
        const { data } = await api.patch(`/api/project/${id}/title`, { name });
        return data;
    },
    updateInstructions: async (
        id: string,
        instructions: string,
    ): Promise<Project> => {
        const { data } = await api.patch(`/api/project/${id}/instructions`, {
            instructions,
        });
        return data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/project/${id}`);
    },
};
