import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversation";
import { useState } from "react";

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
    const [isStreaming, setIsStreaming] = useState(false);

    const send = async (
        content: string,
        options: {
            onChunk: (chunk: string) => void;
            onSuccess: () => void;
            onError: (err: string) => void;
        },
    ) => {
        setIsStreaming(true);
        await conversationsApi.sendMessage(
            conversationId,
            content,
            options.onChunk,
            () => {
                setIsStreaming(false);
                queryClient.invalidateQueries({
                    queryKey: MESSAGE_KEYS.conversation(conversationId),
                });
                options.onSuccess();
            },
            (err) => {
                setIsStreaming(false);
                options.onError(err);
            },
        );
    };

    return { send, isStreaming };
}
