import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, MessageSquare, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import OwnerLayout from "./OwnerLayout";

const STATUS_LABELS: Record<string, string> = {
    new: "New",
    read: "Read",
    responded: "Responded",
};

const STATUS_COLORS: Record<string, string> = {
    new: "bg-primary/10 text-primary border-primary/20",
    read: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    responded: "bg-green-500/10 text-green-600 border-green-500/20",
};

export default function OwnerInquiries() {
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState<string | null>(null);

    const { data: inquiries = [], isLoading } = useQuery<any[]>({
        queryKey: ["owner-inquiries"],
        queryFn: () => api.get("/inquiries"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            api.put(`/inquiries/${id}`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owner-inquiries"] });
            toast.success("Inquiry status updated!");
        },
        onError: (err: any) => toast.error(err.message || "Failed to update"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/inquiries/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owner-inquiries"] });
            toast.success("Inquiry deleted!");
        },
        onError: (err: any) => toast.error(err.message || "Failed to delete"),
    });

    const newCount = inquiries.filter((i) => i.status === "new").length;

    return (
        <OwnerLayout
            title={`Inquiries${newCount > 0 ? ` (${newCount} new)` : ""}`}
            description="View and manage customer product inquiries"
        >
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                </div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-16">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
                    <p className="font-ui text-muted-foreground">No inquiries yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {inquiries.map((inq, i) => {
                        const isExpanded = expanded === inq._id;
                        const date = new Date(inq.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        return (
                            <motion.div
                                key={inq._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-card rounded-2xl border border-border overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <MessageSquare className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-ui font-semibold text-sm truncate">
                                                {inq.name}
                                                <span className="font-normal text-muted-foreground ml-1.5">
                                                    &lt;{inq.email}&gt;
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground font-ui">
                                                {inq.productName
                                                    ? `Re: ${inq.productName} · `
                                                    : "General · "}
                                                {date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge
                                            variant="outline"
                                            className={`font-ui text-xs ${STATUS_COLORS[inq.status]}`}
                                        >
                                            {STATUS_LABELS[inq.status] ?? inq.status}
                                        </Badge>

                                        <Select
                                            value={inq.status}
                                            onValueChange={(v) =>
                                                updateMutation.mutate({ id: inq._id, status: v })
                                            }
                                        >
                                            <SelectTrigger className="h-8 w-32 text-xs font-ui">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                                    <SelectItem key={val} value={val} className="text-xs font-ui">
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setExpanded(isExpanded ? null : inq._id)}
                                        >
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                            />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-display">
                                                        Delete Inquiry?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="font-ui">
                                                        This will permanently delete this inquiry from {inq.name}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="font-ui">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteMutation.mutate(inq._id)}
                                                        className="bg-destructive text-destructive-foreground font-ui"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="border-t border-border"
                                    >
                                        <div className="p-4">
                                            <div className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                                Message
                                            </div>
                                            <p className="font-ui text-sm text-foreground leading-relaxed">
                                                {inq.message}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </OwnerLayout>
    );
}
