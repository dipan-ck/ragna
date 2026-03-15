"use client";
import { useState } from "react";
import {
    useProjectFiles,
    useDeleteFile,
    useRetriggerEmbedding,
    useFileDownloadUrl,
} from "@/hooks/use-files";
import { FileUploadZone } from "./file-upload-zone";
import { FileStatusBadge } from "./file-status-badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Loader2,
    FileText,
    FolderOpen,
    Upload,
    MoreVertical,
    Trash2,
    RefreshCw,
    FileSpreadsheet,
    BookOpen,
    Download,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectFile } from "@/api/files";

function formatSize(bytes: number | null) {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string | null) {
    if (!mimeType) return FileText;
    if (mimeType.includes("word") || mimeType.includes("document"))
        return BookOpen;
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
        return FileSpreadsheet;
    return FileText;
}

function getFileLabel(mimeType: string | null) {
    if (!mimeType) return "FILE";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("document"))
        return "DOCX";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
        return "XLSX";
    if (mimeType.includes("markdown")) return "MD";
    return "FILE";
}

function FileActions({ file }: { file: ProjectFile }) {
    const { data, isLoading } = useFileDownloadUrl(file.id);
    if (isLoading)
        return (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        );
    if (!data) return null;
    return (
        <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
        >
            <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-background/90 text-foreground hover:bg-background shadow-sm transition-colors border border-border/50"
            >
                <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
                href={data.url}
                download={file.name}
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-background/90 text-foreground hover:bg-background shadow-sm transition-colors border border-border/50"
            >
                <Download className="h-3.5 w-3.5" />
            </a>
        </div>
    );
}

function FileCard({
    file,
    projectId,
}: {
    file: ProjectFile;
    projectId: string;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { mutate: deleteFile, isPending: isDeleting } =
        useDeleteFile(projectId);
    const { mutate: reembed, isPending: isReembedding } =
        useRetriggerEmbedding(projectId);
    const canReembed =
        file.status === "FAILED" ||
        file.status === "UPLOADED" ||
        file.status === "UPLOADING";
    const Icon = getFileIcon(file.mimeType);

    return (
        <>
            <div
                className={cn(
                    "group relative rounded-xl border border-border/50 bg-card overflow-hidden select-none",
                    "transition-all duration-200 ease-out",
                    "hover:border-border hover:shadow-sm hover:-translate-y-0.5",
                    "active:translate-y-0 active:shadow-none",
                )}
            >
                {/* thumbnail */}
                <div className="relative w-full aspect-[4/3] bg-muted/30 flex flex-col items-center justify-center gap-2 border-b border-border/40 overflow-hidden">
                    <div className="p-3 rounded-xl bg-background/60 shadow-sm transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {getFileLabel(file.mimeType)}
                    </span>

                    {file.status !== "READY" && (
                        <div className="absolute top-2 left-2">
                            <FileStatusBadge status={file.status} />
                        </div>
                    )}

                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FileActions file={file} />
                    </div>
                </div>

                {/* footer */}
                <div className="px-3 py-2.5 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate leading-tight">
                            {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            {formatSize(file.size)}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuGroup>
                                {canReembed && (
                                    <DropdownMenuItem
                                        onClick={() => reembed(file.id)}
                                        disabled={isReembedding}
                                    >
                                        {isReembedding ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                        )}
                                        Retry embedding
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setConfirmDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete file?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Permanently deletes <strong>{file.name}</strong> and
                            its embeddings.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteFile(file.id)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function FileGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-border overflow-hidden"
                >
                    <Skeleton className="w-full aspect-[4/3] rounded-none" />
                    <div className="p-2.5 space-y-1.5">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2.5 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FilesModal({
    projectId,
    open,
    onOpenChange,
}: {
    projectId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data: files, isLoading } = useProjectFiles(projectId);
    const fileCount = files?.length ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl h-[85vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Project Files
                        {fileCount > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({fileCount})
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <Tabs
                    defaultValue="files"
                    className="flex flex-col flex-1 min-h-0"
                >
                    <div className="px-6 pt-3 pb-0 border-b border-border/40 shrink-0">
                        <TabsList className="w-full grid grid-cols-2 rounded-none border-0 bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="files"
                                className="flex items-center gap-2 rounded-lg border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                Files
                                {fileCount > 0 && (
                                    <span className="text-xs opacity-50">
                                        ({fileCount})
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="upload"
                                className="flex items-center gap-2 rounded-lg border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Upload
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent
                        value="files"
                        className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden"
                    >
                        <div className="overflow-y-auto px-6 py-5 h-full">
                            {isLoading ? (
                                <FileGridSkeleton />
                            ) : fileCount === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            No files yet
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Upload files to get started
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {files?.map((file, i) => (
                                        <div
                                            key={file.id}
                                            className="animate-in fade-in slide-in-from-bottom-2"
                                            style={{
                                                animationDelay: `${i * 30}ms`,
                                                animationFillMode: "both",
                                            }}
                                        >
                                            <FileCard
                                                file={file}
                                                projectId={projectId}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="upload"
                        className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden"
                    >
                        <div className="overflow-y-auto px-6 py-5 h-full">
                            <FileUploadZone projectId={projectId} />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
