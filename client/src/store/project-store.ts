import { create } from "zustand";

type ProjectStore = {
    projectId: string | null;
    activeConversationId: string | null;
    pendingMessage: string | null;
    setProjectId: (id: string) => void;
    setActiveConversationId: (id: string | null) => void;
    setPendingMessage: (msg: string | null) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
    projectId: null,
    activeConversationId: null,
    pendingMessage: null,
    setProjectId: (id) => set({ projectId: id }),
    setActiveConversationId: (id) => set({ activeConversationId: id }),
    setPendingMessage: (msg) => set({ pendingMessage: msg }),
}));
