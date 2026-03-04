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
import { ChevronDown, ClipboardList } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend.d";
import { ORDER_STATUS_LABELS } from "../../data/mockData";
import { MOCK_PRODUCTS } from "../../data/mockData";
import { api } from "../../lib/api";
import OwnerLayout from "./OwnerLayout";

const MOCK_ALL_ORDERS: any[] = [];

const STATUS_COLOR_MAP: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [OrderStatus.pending]: "secondary",
  [OrderStatus.confirmed]: "default",
  [OrderStatus.shipped]: "outline",
  [OrderStatus.delivered]: "default",
  [OrderStatus.cancelled]: "destructive",
};

export default function OwnerOrders() {
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: orders = MOCK_ALL_ORDERS, isLoading } = useQuery<any[]>({
    queryKey: ["owner-all-orders"],
    queryFn: async () => {
      try {
        return await api.get('/orders/all');
      } catch {
        return MOCK_ALL_ORDERS;
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    }) => {
      await api.put(`/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-all-orders"] });
      toast.success("Order status updated!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update status"),
  });

  return (
    <OwnerLayout title="Orders" description="Manage all customer orders">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="font-ui text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const isExpanded = expandedOrder === (order._id || order.id);

            return (
              <motion.div
                key={order._id || order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-ui font-semibold text-sm">
                        Order #{order._id?.slice(-8) || order.id}
                      </div>
                      <div className="text-xs text-muted-foreground font-ui">
                        {date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-ui font-bold text-jute-olive text-sm">
                      ₹{order.totalAmount}
                    </span>

                    <Badge
                      variant={STATUS_COLOR_MAP[order.status] ?? "default"}
                      className="font-ui"
                    >
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>

                    {/* Status Update */}
                    <Select
                      value={order.status}
                      onValueChange={(v) =>
                        updateStatusMutation.mutate({
                          id: order.id,
                          status: v as OrderStatus,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-36 text-xs font-ui">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="font-ui text-xs"
                          >
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Expanded items */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-border"
                  >
                    <div className="p-4">
                      <div className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Items ({order.items.length})
                      </div>
                      <div className="space-y-2">
                        {order.orderItems.map((item: any, j: number) => {
                          const product = item.product || {};
                          return (
                            <div
                              key={`${product._id || product.id}-${j}`}
                              className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                            >
                              {product.images?.[0] && (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-ui text-sm truncate">
                                  {product.name || `Product #${item.product}`}
                                </div>
                                <div className="text-xs text-muted-foreground font-ui">
                                  {item.selectedSize} · {item.selectedColor} ·
                                  Qty: {item.quantity} · ₹{item.priceAtPurchase}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground font-ui">
                        <div className="flex flex-col gap-1">
                          <div>Buyer: <span className="font-semibold text-foreground">{order.user?.name}</span> ({order.user?.email})</div>
                          <div className="truncate">Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}</div>
                        </div>
                      </div>
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
