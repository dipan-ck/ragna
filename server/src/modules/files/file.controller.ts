import { Request, Response } from "express";
import { uploadUrlSchema, confirmUploadSchema } from "./file.schema.js";
import * as fileService from "./file.service.js";
import { z } from "zod";

export async function getUploadUrl(req: Request, res: Response) {
    const parsed = uploadUrlSchema.safeParse(req.body);
    if (!parsed.success)
        return void res.status(400).json(z.treeifyError(parsed.error));

    const result = await fileService.createUploadUrl({
        ...parsed.data,
        userId: req.user!.id,
    });
    if (!result)
        return void res.status(404).json({ error: "Project not found" });

    res.json(result);
}

export async function confirmUpload(req: Request, res: Response) {
    const parsed = confirmUploadSchema.safeParse(req.body);
    if (!parsed.success)
        return void res.status(400).json(z.treeifyError(parsed.error));

    const file = await fileService.confirmUpload(
        parsed.data.fileId,
        req.user!.id,
    );
    if (!file) return void res.status(404).json({ error: "File not found" });

    res.json({ success: true });
}

export async function getProjectFiles(
    req: Request<{ projectId: string }>,
    res: Response,
) {
    const files = await fileService.getProjectFiles(
        req.params.projectId,
        req.user!.id,
    );
    if (!files)
        return void res.status(404).json({ error: "Project not found" });
    res.json(files);
}

export async function getFile(req: Request<{ fileId: string }>, res: Response) {
    const file = await fileService.getFile(req.params.fileId, req.user!.id);
    if (!file) return void res.status(404).json({ error: "File not found" });
    res.json(file);
}

export async function retriggerEmbedding(
    req: Request<{ fileId: string }>,
    res: Response,
) {
    const result = await fileService.retriggerEmbedding(
        req.params.fileId,
        req.user!.id,
    );
    if (!result) return void res.status(404).json({ error: "File not found" });
    if (result === "already_ready")
        return void res.status(400).json({ error: "File is already ready" });
    res.json({ success: true });
}
export async function deleteFile(
    req: Request<{ fileId: string }>,
    res: Response,
) {
    const result = await fileService.deleteFile(
        req.params.fileId,
        req.user!.id,
    );
    if (!result) return void res.status(404).json({ error: "File not found" });
    res.json({ message: "File deleted" });
}
