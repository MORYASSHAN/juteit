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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, Megaphone, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { OfferBanner } from "../../backend.d";
import { MOCK_BANNERS } from "../../data/mockData";
import { api } from "../../lib/api";
import OwnerLayout from "./OwnerLayout";

interface BannerFormState {
  title: string;
  description: string;
  discountPercent: string;
  imageUrl: string;
  active: boolean;
}

function toBannerForm(banner: any): BannerFormState {
  return {
    title: banner.title,
    description: banner.description,
    discountPercent: banner.discountPercent.toString(),
    imageUrl: banner.imageUrl || "",
    active: banner.active,
  };
}

const EMPTY_FORM: BannerFormState = {
  title: "",
  description: "",
  discountPercent: "0",
  imageUrl: "",
  active: true,
};

export default function OwnerBanners() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);

  const { data: banners = MOCK_BANNERS, isLoading } = useQuery<any[]>({
    queryKey: ["owner-banners-list"],
    queryFn: async () => {
      try {
        return await api.get('/banners/all');
      } catch {
        return MOCK_BANNERS;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (banner: any) => {
      await api.post('/banners', banner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-banners-list"] });
      toast.success("Banner added!");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to add banner"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      banner,
    }: {
      id: string;
      banner: any;
    }) => {
      await api.put(`/banners/${id}`, banner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-banners-list"] });
      toast.success("Banner updated!");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to update banner"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-banners-list"] });
      toast.success("Banner deleted!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete banner"),
  });

  const openAdd = () => {
    setEditingBanner(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (banner: any) => {
    setEditingBanner(banner);
    setForm(toBannerForm(banner));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    const data: any = {
      title: form.title,
      description: form.description,
      discountPercent: Number(form.discountPercent || "0"),
      imageUrl: form.imageUrl || undefined,
      active: form.active,
    };
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id || editingBanner.id, banner: data });
    } else {
      addMutation.mutate(data);
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  const bgVariants = [
    "from-amber-700 to-amber-900",
    "from-green-700 to-green-900",
    "from-stone-600 to-stone-800",
    "from-orange-700 to-orange-900",
  ];

  return (
    <OwnerLayout
      title="Offer Banners"
      description="Create and manage promotional banners shown to customers"
    >
      {/* Add button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={openAdd}
          className="bg-primary text-primary-foreground font-ui gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Banners List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground font-ui">
          Loading banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="font-ui text-muted-foreground">No banners yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-gradient-to-r ${bgVariants[i % bgVariants.length]} rounded-2xl overflow-hidden`}
            >
              <div className="flex items-center justify-between p-5 text-white gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-base">
                        {banner.title}
                      </h3>
                      {Number(banner.discountPercent) > 0 && (
                        <Badge className="bg-yellow-400 text-yellow-900 font-ui text-xs border-0">
                          {banner.discountPercent.toString()}% OFF
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs font-ui border ${banner.active
                          ? "border-white/50 text-white"
                          : "border-white/20 text-white/50"
                          }`}
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm truncate mt-0.5">
                      {banner.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(banner)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-display">
                          Delete Banner?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-ui">
                          This will permanently delete "{banner.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-ui">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(banner.id)}
                          className="bg-destructive text-destructive-foreground font-ui"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Banner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Banner Title *
              </Label>
              <Input
                placeholder="e.g. 🌿 Summer Eco Sale"
                className="font-ui"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Description
              </Label>
              <Textarea
                placeholder="Banner description or offer details..."
                className="font-ui"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Discount Percentage
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 25"
                className="font-ui"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountPercent: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Image URL (optional)
              </Label>
              <Input
                placeholder="https://example.com/banner.jpg"
                className="font-ui"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))}
              />
              <Label className="font-ui text-sm font-medium">
                Active (shown to customers)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="font-ui"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-primary-foreground font-ui"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingBanner ? (
                "Update Banner"
              ) : (
                "Add Banner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
}
