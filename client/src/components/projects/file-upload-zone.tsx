"use client";
import { useRef, useState } from "react";
import { filesApi } from "@/api/files";
import { useQueryClient } from "@tanstack/react-query";
import { FILE_KEYS } from "@/hooks/use-files";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/markdown",
    "text/x-markdown",
];

type UploadItem = {
    file: File;
    progress: number;
    status: "uploading" | "done" | "error";
    error?: string;
};

export function FileUploadZone({ projectId }: { projectId: string }) {
    const [dragging, setDragging] = useState(false);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    function patch(index: number, update: Partial<UploadItem>) {
        setUploads((prev) =>
            prev.map((u, i) => (i === index ? { ...u, ...update } : u)),
        );
    }

    async function processFiles(files: FileList) {
        const valid = Array.from(files).filter((f) =>
            ALLOWED_TYPES.includes(f.type),
        );
        if (!valid.length) return;

        const start = uploads.length;
        setUploads((prev) => [
            ...prev,
            ...valid.map((file) => ({
                file,
                progress: 0,
                status: "uploading" as const,
            })),
        ]);

        for (let i = 0; i < valid.length; i++) {
            const idx = start + i;
            const file = valid[i];
            try {
                const { uploadUrl, s3Key } = await filesApi.getUploadUrl({
                    projectId,
                    filename: file.name,
                    mimeType: file.type,
                });
                await filesApi.uploadToS3(uploadUrl, file, (pct) =>
                    patch(idx, { progress: pct }),
                );
                await filesApi.confirmUpload({
                    projectId,
                    filename: file.name,
                    mimeType: file.type,
                    s3Key,
                    size: file.size,
                });
                patch(idx, { status: "done", progress: 100 });
                queryClient.invalidateQueries({
                    queryKey: FILE_KEYS.project(projectId),
                });
            } catch {
                patch(idx, { status: "error", error: "Upload failed" });
            }
        }
    }

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    "border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer select-none",
                    dragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/20",
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    processFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
            >
                <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                    Drop files or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    PDF, Word, Excel, Markdown
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.md"
                    onChange={(e) =>
                        e.target.files && processFiles(e.target.files)
                    }
                />
            </div>

            {uploads.length > 0 && (
                <div className="space-y-1.5">
                    {uploads.map((u, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30 border border-border/40"
                        >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                    {u.file.name}
                                </p>
                                {u.status === "uploading" && (
                                    <Progress
                                        value={u.progress}
                                        className="h-1 mt-1"
                                    />
                                )}
                                {u.status === "error" && (
                                    <p className="text-xs text-destructive mt-0.5">
                                        {u.error}
                                    </p>
                                )}
                                {u.status === "done" && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Queued for processing
                                    </p>
                                )}
                            </div>
                            {u.status === "uploading" && (
                                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                                    {u.progress}%
                                </span>
                            )}
                            {u.status === "done" && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            )}
                            {u.status === "error" && (
                                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                            )}
                            {u.status !== "uploading" && (
                                <button
                                    onClick={() =>
                                        setUploads((p) =>
                                            p.filter((_, j) => j !== i),
                                        )
                                    }
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </div>
                    ))}
                    {uploads.every((u) => u.status !== "uploading") && (
                        <button
                            className="text-xs text-muted-foreground hover:text-foreground ml-1"
                            onClick={() => setUploads([])}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
