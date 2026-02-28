import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { OrderStatus } from "../backend.d";
import type { Order } from "../backend.d";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ORDER_STATUS_LABELS } from "../data/mockData";
import { MOCK_PRODUCTS } from "../data/mockData";

import { api } from "../lib/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, XCircle } from "lucide-react";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const colorMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    [OrderStatus.pending]: "secondary",
    [OrderStatus.confirmed]: "default",
    [OrderStatus.shipped]: "outline",
    [OrderStatus.delivered]: "default",
    [OrderStatus.cancelled]: "destructive",
  };

  return (
    <Badge variant={colorMap[status] ?? "default"} className="font-ui">
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const createdDate = new Date(order.createdAt);
  const dateFormatted = createdDate.toLocaleDateString(
    "en-IN",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  // 20 hour cancellation window
  const canCancel = (order.status === OrderStatus.pending || order.status === OrderStatus.confirmed) &&
    (Date.now() - createdDate.getTime() < 20 * 60 * 60 * 1000);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/orders/${order._id || order.id}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order cancelled successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to cancel order"),
  });

  const itemNames = order.items.map((item) => {
    // In a real app, we'd fetch product names or they'd be in the order response
    return `Product #${item.productId}`;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-ui font-semibold text-foreground">
              Order #{(order._id || order.id || "").toString().slice(-6).toUpperCase()}
            </div>
            <div className="text-xs text-muted-foreground font-ui">{dateFormatted}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-ui font-bold text-jute-olive">
              ₹{Number(order.totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground font-ui capitalize">
              {order.paymentStatus}
            </div>
          </div>
          <OrderStatusBadge status={order.status} />

          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5 font-ui"
            >
              {cancelMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Cancel
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Items */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-border"
        >
          <div className="p-5 space-y-3">
            <h4 className="font-ui font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Items
            </h4>
            {order.items.map((item, i) => {
              return (
                <div
                  key={`${item.productId}-${i}`}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-ui font-medium text-sm truncate">
                      {itemNames[i]}
                    </div>
                    <div className="text-xs text-muted-foreground font-ui">
                      {item.selectedSize} · {item.selectedColor} ·{" "}
                      {Number(item.quantity)} pc
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      try {
        return await api.get('/orders/my');
      } catch {
        return [];
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground font-ui mb-8">
            Track and manage your JuteIt orders
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <h2 className="font-display text-xl font-semibold text-muted-foreground mb-2">
                No orders yet
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your order history will appear here
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground font-ui"
              >
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <OrderCard key={order._id || order.id || Math.random().toString()} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
