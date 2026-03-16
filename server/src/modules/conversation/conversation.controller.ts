import { Request, Response } from "express";
import * as conversationService from "./conversation.service.js";

export async function getProjectConversations(
    req: Request<{ projectId: string }>,
    res: Response,
) {
    const result = await conversationService.getProjectConversations(
        req.params.projectId,
        req.user!.id,
    );
    if (!result)
        return void res.status(404).json({ error: "Project not found" });
    res.json(result);
}

export async function createConversation(
    req: Request<{ projectId: string }>,
    res: Response,
) {
    const result = await conversationService.createConversation(
        req.params.projectId,
        req.user!.id,
        req.body.title,
    );
    if (!result)
        return void res.status(404).json({ error: "Project not found" });
    res.status(201).json(result);
}

export async function deleteConversation(
    req: Request<{ conversationId: string }>,
    res: Response,
) {
    const result = await conversationService.deleteConversation(
        req.params.conversationId,
        req.user!.id,
    );
    if (!result)
        return void res.status(404).json({ error: "Conversation not found" });
    res.json({ message: "Deleted" });
}

export async function updateConversationTitle(
    req: Request<{ conversationId: string }>,
    res: Response,
) {
    const { title } = req.body;
    if (!title) return void res.status(400).json({ error: "Title required" });
    const result = await conversationService.updateConversationTitle(
        req.params.conversationId,
        req.user!.id,
        title,
    );
    if (!result)
        return void res.status(404).json({ error: "Conversation not found" });
    res.json(result);
}
export async function getMessages(
    req: Request<{ conversationId: string }>,
    res: Response,
) {
    const result = await conversationService.getMessages(
        req.params.conversationId,
        req.user!.id,
    );
    if (!result)
        return void res.status(404).json({ error: "Conversation not found" });
    res.json(result);
}

export async function sendMessage(
    req: Request<{ conversationId: string }>,
    res: Response,
) {
    const { content } = req.body;
    if (!content?.trim())
        return void res.status(400).json({ error: "Content required" });

    // Set SSE headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // important for nginx
    res.flushHeaders();

    try {
        await conversationService.sendMessageStream(
            req.params.conversationId,
            req.user!.id,
            content,
            (chunk: string) => {
                res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
            },
        );
        // Signal stream end
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (err: any) {
        if (err.message === "NOT_FOUND") {
            res.write(
                `data: ${JSON.stringify({ error: "Conversation not found" })}\n\n`,
            );
        } else {
            res.write(
                `data: ${JSON.stringify({ error: "Something went wrong" })}\n\n`,
            );
        }
    } finally {
        res.end();
    }
}
