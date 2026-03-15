import { Badge } from "@/components/ui/badge";
import type { FileStatus } from "@/api/files";
import { CheckCircle2, Clock, Loader2, XCircle, Upload } from "lucide-react";

const config: Record<
    FileStatus,
    {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
    }
> = {
    UPLOADING: {
        label: "Uploading",
        variant: "secondary",
        icon: <Upload className="h-3 w-3" />,
    },
    UPLOADED: {
        label: "Queued",
        variant: "secondary",
        icon: <Clock className="h-3 w-3" />,
    },
    PROCESSING: {
        label: "Processing",
        variant: "outline",
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    READY: {
        label: "Ready",
        variant: "default",
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    FAILED: {
        label: "Failed",
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
    },
};

export function FileStatusBadge({ status }: { status: FileStatus }) {
    const { label, variant, icon } = config[status];
    return (
        <Badge
            variant={variant}
            className="flex items-center gap-1 text-xs font-normal shrink-0"
        >
            {icon}
            {label}
        </Badge>
    );
}
