import { prisma } from "../../config/prisma.js";

export async function getProjectConversations(
    projectId: string,
    userId: string,
) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });
    if (!project) return null;
    return prisma.conversation.findMany({
        where: { projectId },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
}

export async function createConversation(
    projectId: string,
    userId: string,
    title?: string,
) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });
    if (!project) return null;
    return prisma.conversation.create({
        data: { projectId, title: title ?? "New conversation" },
    });
}

export async function deleteConversation(
    conversationId: string,
    userId: string,
) {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, project: { userId } },
    });
    if (!conversation) return null;
    return prisma.conversation.delete({ where: { id: conversationId } });
}

export async function updateConversationTitle(
    conversationId: string,
    userId: string,
    title: string,
) {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, project: { userId } },
    });
    if (!conversation) return null;
    return prisma.conversation.update({
        where: { id: conversationId },
        data: { title },
    });
}
export async function getMessages(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, project: { userId } },
    });
    if (!conversation) return null;
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
    });
}

export async function sendMessage(
    conversationId: string,
    userId: string,
    content: string,
) {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, project: { userId } },
    });
    if (!conversation) return null;

    // save user message
    await prisma.message.create({
        data: { conversationId, content, role: "USER" },
    });

    // hardcoded AI response for now
    const aiMessage = await prisma.message.create({
        data: {
            conversationId,
            content: "Hello! I'm here to help.",
            role: "AI",
        },
    });

    // update conversation updatedAt
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    return aiMessage;
}
