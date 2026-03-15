import { z } from "zod";

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/markdown",
    "text/x-markdown",
] as const;

export const uploadUrlSchema = z.object({
    projectId: z.string(),
    filename: z.string().min(1),
    mimeType: z.enum(ALLOWED_MIME_TYPES),
});

export const confirmUploadSchema = z.object({
    projectId: z.string(),
    filename: z.string().min(1),
    mimeType: z.enum(ALLOWED_MIME_TYPES),
    s3Key: z.string().min(1),
    size: z.number(),
});
