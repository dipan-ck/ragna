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
    const result = await conversationService.sendMessage(
        req.params.conversationId,
        req.user!.id,
        content,
    );
    if (!result)
        return void res.status(404).json({ error: "Conversation not found" });
    res.json(result);
}
