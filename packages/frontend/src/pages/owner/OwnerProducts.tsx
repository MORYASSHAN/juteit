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
import { Edit2, Loader2, Package, Plus, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend.d";
import { MOCK_PRODUCTS } from "../../data/mockData";
import { api } from "../../lib/api";
import OwnerLayout from "./OwnerLayout";

const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: "",
  description: "",
  category: "",
  originalPrice: "0",
  discountedPrice: "0",
  sizes: "",
  colors: "",
  stock: 0,
  deliveryEstimate: "3-5 business days",
  returnable: true,
  images: "",
};

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  discountedPrice: string;
  sizes: string;
  colors: string;
  stock: number;
  deliveryEstimate: string;
  returnable: boolean;
  images: string;
}

function toFormState(product: any): ProductFormState {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    originalPrice: product.originalPrice.toString(),
    discountedPrice: product.discountedPrice.toString(),
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    stock: product.stock,
    deliveryEstimate: product.deliveryEstimate,
    returnable: product.returnable,
    images: product.images.join(", "),
  };
}

function fromFormState(form: ProductFormState): any {
  return {
    name: form.name,
    description: form.description,
    category: form.category,
    originalPrice: Number(form.originalPrice || "0"),
    discountedPrice: Number(form.discountedPrice || "0"),
    sizes: form.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    colors: form.colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    stock: Number(form.stock),
    deliveryEstimate: form.deliveryEstimate,
    returnable: form.returnable,
    images: form.images
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean),
  };
}

export default function OwnerProducts() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);

  const { data: products = MOCK_PRODUCTS, isLoading } = useQuery<any[]>({
    queryKey: ["owner-products-list"],
    queryFn: async () => {
      try {
        return await api.get('/products/admin');
      } catch {
        return MOCK_PRODUCTS;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (product: any) => {
      await api.post('/products', product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-products-list"] });
      toast.success("Product added successfully!");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      product,
    }: {
      id: string;
      product: any;
    }) => {
      await api.put(`/products/${id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-products-list"] });
      toast.success("Product updated!");
      setDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-products-list"] });
      toast.success("Product deleted!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete product"),
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(toFormState(product));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category) {
      toast.error("Name and category are required");
      return;
    }
    const data = fromFormState(form);
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, product: data });
    } else {
      addMutation.mutate(data);
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <OwnerLayout title="Products" description="Manage your product catalog">
      {/* Actions bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 font-ui"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary text-primary-foreground font-ui gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground font-ui">
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
            <p className="font-ui text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product._id || product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            (product.images && product.images[0]) ||
                            (product.imageUrls && product.imageUrls[0]) ||
                            "https://picsum.photos/seed/jute/60/60"
                          }
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-ui font-medium text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant="outline" className="font-ui text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-ui font-bold text-sm text-jute-olive">
                          ₹{Number(product.discountedPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground line-through">
                          ₹{Number(product.originalPrice)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge
                        className={
                          (product.stock > 0 || product.inStock)
                            ? "bg-jute-success/10 text-jute-success border-jute-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                        variant="outline"
                      >
                        {(product.stock > 0 || product.inStock) ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
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
                                Delete Product?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-ui">
                                This will permanently delete "{product.name}".
                                This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-ui">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteMutation.mutate(product._id || product.id)
                                }
                                className="bg-destructive text-destructive-foreground font-ui"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Product Name *
              </Label>
              <Input
                placeholder="e.g. Jute Tote Bag"
                className="font-ui"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Category *
              </Label>
              <Input
                placeholder="e.g. Bags"
                className="font-ui"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Delivery Estimate
              </Label>
              <Input
                placeholder="e.g. 3-5 business days"
                className="font-ui"
                value={form.deliveryEstimate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deliveryEstimate: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Original Price (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 399"
                className="font-ui"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((p) => ({ ...p, originalPrice: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Discounted Price (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 299"
                className="font-ui"
                value={form.discountedPrice}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountedPrice: e.target.value }))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Description
              </Label>
              <Textarea
                placeholder="Product description..."
                className="font-ui min-h-20"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Sizes (comma separated)
              </Label>
              <Input
                placeholder="Small, Medium, Large"
                className="font-ui"
                value={form.sizes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sizes: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Colors (comma separated)
              </Label>
              <Input
                placeholder="Natural Brown, Olive Green"
                className="font-ui"
                value={form.colors}
                onChange={(e) =>
                  setForm((p) => ({ ...p, colors: e.target.value }))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="font-ui text-sm font-medium mb-1.5 block">
                Images (comma separated)
              </Label>
              <Input
                placeholder="https://example.com/image.jpg"
                className="font-ui"
                value={form.images}
                onChange={(e) =>
                  setForm((p) => ({ ...p, images: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Stock quantity"
                className="w-24 font-ui"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
              />
              <Label className="font-ui text-sm font-medium">Stock Count</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.returnable}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, returnable: v }))
                }
              />
              <Label className="font-ui text-sm font-medium">Returnable</Label>
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
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
}
