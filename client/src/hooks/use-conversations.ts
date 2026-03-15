import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversation";

export const CONVERSATION_KEYS = {
    project: (projectId: string) => ["conversations", projectId] as const,
};

export function useProjectConversations(projectId: string) {
    return useQuery({
        queryKey: CONVERSATION_KEYS.project(projectId),
        queryFn: () => conversationsApi.getProjectConversations(projectId),
    });
}

export function useCreateConversation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (title?: string) =>
            conversationsApi.create(projectId, title),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: CONVERSATION_KEYS.project(projectId),
            }),
    });
}

export function useDeleteConversation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: conversationsApi.delete,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: CONVERSATION_KEYS.project(projectId),
            }),
    });
}
export const MESSAGE_KEYS = {
    conversation: (conversationId: string) =>
        ["messages", conversationId] as const,
};

export function useMessages(conversationId: string | null) {
    return useQuery({
        queryKey: MESSAGE_KEYS.conversation(conversationId ?? ""),
        queryFn: () => conversationsApi.getMessages(conversationId!),
        enabled: !!conversationId,
    });
}

export function useSendMessage(conversationId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content: string) =>
            conversationsApi.sendMessage(conversationId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: MESSAGE_KEYS.conversation(conversationId),
            });
        },
    });
}
