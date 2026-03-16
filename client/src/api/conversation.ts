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
        onChunk: (chunk: string) => void,
        onDone: () => void,
        onError: (err: string) => void,
    ): Promise<void> => {
        const baseURL =
            process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";
        const response = await fetch(
            `${baseURL}/api/conversation/${conversationId}/messages`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content }),
            },
        );

        if (!response.ok || !response.body) {
            onError("Failed to send message");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const lines = decoder.decode(value).split("\n");
            for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                try {
                    const parsed = JSON.parse(line.slice(6));
                    if (parsed.chunk) onChunk(parsed.chunk);
                    if (parsed.done) onDone();
                    if (parsed.error) onError(parsed.error);
                } catch {}
            }
        }
    },
};
