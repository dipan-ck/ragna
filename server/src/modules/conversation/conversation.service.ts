import { ChatGroq } from "@langchain/groq";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from "@langchain/core/messages";
import { prisma } from "../../config/prisma.js";
import { retrieveContext } from "../../lib/retriever.js";
import { env } from "../../config/env.js";
import { ROUTER_SYSTEM_PROMPT } from "../../prompts/router.prompt.js";
import { buildAnswerSystemPrompt } from "../../prompts/answer.prompt.js";

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

const routerModel = new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0, // deterministic routing decisions
    maxTokens: 256, // routing only needs a short JSON response
});

const answerModel = new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    maxTokens: 4096,
    streaming: true,
});

interface RouterDecision {
    needsRetrieval: boolean;
    reason: string;
    refinedQuery?: string;
}

async function routeQuery(
    userMessage: string,
    conversationHistory: string,
): Promise<RouterDecision> {
    const contextualMessage = conversationHistory
        ? `Conversation so far:\n${conversationHistory}\n\nLatest user message: ${userMessage}`
        : userMessage;

    try {
        const response = await routerModel.invoke([
            new SystemMessage(ROUTER_SYSTEM_PROMPT),
            new HumanMessage(contextualMessage),
        ]);

        const text =
            typeof response.content === "string"
                ? response.content
                : JSON.stringify(response.content);

        const cleaned = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned) as RouterDecision;
    } catch {
        // If routing fails for any reason, default to retrieving
        return {
            needsRetrieval: true,
            reason: "Router failed — defaulting to retrieval",
            refinedQuery: userMessage,
        };
    }
}

function buildConversationSummary(
    messages: { role: string; content: string }[],
): string {
    return messages
        .slice(-6) // last 3 exchanges for context
        .map((m) => `${m.role === "USER" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");
}

export async function sendMessageStream(
    conversationId: string,
    userId: string,
    content: string,
    onChunk: (chunk: string) => void,
): Promise<void> {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, project: { userId } },
        include: { project: true },
    });
    if (!conversation) throw new Error("NOT_FOUND");

    // Save user message immediately
    await prisma.message.create({
        data: { conversationId, content, role: "USER" },
    });

    // Fetch conversation history for context
    const history = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 20,
    });

    // Build a short summary of recent history for the router
    const historySummary = buildConversationSummary(
        history.slice(0, -1), // exclude the message we just saved
    );

    // ── Step 1: Route — decide if retrieval is needed ──────────────────────
    const routerDecision = await routeQuery(content, historySummary);

    // ── Step 2: Retrieve context if needed ────────────────────────────────
    let context: string | null = null;
    if (routerDecision.needsRetrieval) {
        const searchQuery = routerDecision.refinedQuery ?? content;
        context = await retrieveContext(searchQuery, conversation.projectId);
    }

    // ── Step 3: Build LangChain message history ───────────────────────────
    const systemPrompt = buildAnswerSystemPrompt(
        conversation.project.instructions ?? null,
        context,
    );

    const langchainHistory = history
        .slice(0, -1)
        .map((m) =>
            m.role === "USER"
                ? new HumanMessage(m.content)
                : new AIMessage(m.content),
        );

    const messages = [
        new SystemMessage(systemPrompt),
        ...langchainHistory,
        new HumanMessage(content),
    ];

    // ── Step 4: Stream the answer ─────────────────────────────────────────
    let fullResponse = "";

    const stream = await answerModel.stream(messages);

    for await (const chunk of stream) {
        const text = typeof chunk.content === "string" ? chunk.content : "";
        if (text) {
            fullResponse += text;
            onChunk(text);
        }
    }

    // ── Step 5: Persist AI response ───────────────────────────────────────
    await prisma.message.create({
        data: { conversationId, content: fullResponse, role: "AI" },
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });
}
