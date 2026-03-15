import { api } from "@/lib/axios";

export type Conversation = {
    id: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
};
export type Message = {
    id: string;
    content: string;
    role: "USER" | "AI" | "SYSTEM";
    createdAt: string;
};
export const conversationsApi = {
    getProjectConversations: async (
        projectId: string,
    ): Promise<Conversation[]> => {
        const { data } = await api.get(
            `/api/conversation/project/${projectId}`,
        );
        return data;
    },
    create: async (
        projectId: string,
        title?: string,
    ): Promise<Conversation> => {
        const { data } = await api.post(
            `/api/conversation/project/${projectId}`,
            { title },
        );
        return data;
    },
    delete: async (conversationId: string) => {
        await api.delete(`/api/conversation/${conversationId}`);
    },
    updateTitle: async (
        conversationId: string,
        title: string,
    ): Promise<Conversation> => {
        const { data } = await api.patch(
            `/api/conversation/${conversationId}/title`,
            { title },
        );
        return data;
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        const { data } = await api.get(
            `/api/conversation/${conversationId}/messages`,
        );
        return data;
    },
    sendMessage: async (
        conversationId: string,
        content: string,
    ): Promise<Message> => {
        const { data } = await api.post(
            `/api/conversation/${conversationId}/messages`,
            { content },
        );
        return data;
    },
};
