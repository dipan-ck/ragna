import { prisma } from "../../config/prisma.js";
import { s3 } from "../../lib/s3.js";
import { env } from "../../config/env.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { embeddingQueue } from "../../queues/embedding.queue.js";
import crypto from "crypto";
import { getPineconeIndex } from "../../lib/pinecone.js";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export async function createUploadUrl({
    projectId,
    userId,
    filename,
    mimeType,
}: {
    projectId: string;
    userId: string;
    filename: string;
    mimeType: string;
}) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });
    if (!project) return null;

    const s3Key = `projects/${projectId}/${crypto.randomUUID()}-${filename}`;

    const command = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: s3Key,
        ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return { uploadUrl, s3Key }; // no DB insert here anymore
}

export async function confirmUpload({
    projectId,
    userId,
    filename,
    mimeType,
    s3Key,
    size,
}: {
    projectId: string;
    userId: string;
    filename: string;
    mimeType: string;
    s3Key: string;
    size: number;
}) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });
    if (!project) return null;

    const file = await prisma.file.create({
        data: {
            name: filename,
            mimeType,
            s3Key,
            projectId,
            size,
            status: "UPLOADED",
        },
    });

    await embeddingQueue.add("process-file", { fileId: file.id });
    return file;
}

export async function getProjectFiles(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
    });
    if (!project) return null;

    return prisma.file.findMany({
        where: { projectId },
        select: {
            id: true,
            name: true,
            mimeType: true,
            size: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getFile(fileId: string, userId: string) {
    return prisma.file.findFirst({
        where: { id: fileId, project: { userId } },
        select: {
            id: true,
            name: true,
            mimeType: true,
            size: true,
            status: true,
            createdAt: true,
        },
    });
}

export async function retriggerEmbedding(fileId: string, userId: string) {
    const file = await prisma.file.findFirst({
        where: { id: fileId, project: { userId } },
    });

    if (!file) return null;
    if (file.status === "READY") return "already_ready";

    await prisma.file.update({
        where: { id: fileId },
        data: { status: "UPLOADED" },
    });

    await embeddingQueue.add("process-file", { fileId });
    return "queued";
}

export async function deleteProjectFiles(projectId: string) {
    const files = await prisma.file.findMany({
        where: { projectId },
        select: { s3Key: true },
    });

    if (files.length > 0) {
        await s3.send(
            new DeleteObjectsCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Delete: { Objects: files.map((f) => ({ Key: f.s3Key })) },
            }),
        );
    }

    try {
        const index = getPineconeIndex().namespace(projectId);
        await index.deleteAll();
    } catch (error: any) {
        if (error?.name === "PineconeNotFoundError") return;
        throw error;
    }
}
export async function deleteFile(fileId: string, userId: string) {
    const file = await prisma.file.findFirst({
        where: { id: fileId, project: { userId } },
    });
    if (!file) return null;

    await s3.send(
        new DeleteObjectCommand({
            Bucket: env.AWS_BUCKET_NAME,
            Key: file.s3Key,
        }),
    );

    try {
        const index = getPineconeIndex().namespace(file.projectId);
        await index.deleteMany({ filter: { fileId: { $eq: fileId } } });
    } catch (error: any) {
        if (error?.name !== "PineconeNotFoundError") throw error;
    }

    await prisma.file.delete({ where: { id: fileId } });
    return true;
}

export async function downloadFileFromS3(s3Key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: s3Key,
    });
    const response = await s3.send(command);
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function getFileDownloadUrl(fileId: string, userId: string) {
    const file = await prisma.file.findFirst({
        where: { id: fileId, project: { userId } },
    });
    if (!file) return null;
    const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: file.s3Key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { url, name: file.name, mimeType: file.mimeType };
}
