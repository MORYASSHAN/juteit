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
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ClipboardList } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend.d";
import type { Order } from "../../backend.d";
import { ORDER_STATUS_LABELS } from "../../data/mockData";
import { MOCK_PRODUCTS } from "../../data/mockData";
import { useActor } from "../../hooks/useActor";
import OwnerLayout from "./OwnerLayout";

// Create a minimal mock principal for display
function makeMockPrincipal(text: string): Principal {
  return {
    _isPrincipal: true,
    toText: () => text,
    toUint8Array: () => new Uint8Array(29),
    toHex: () => "",
    isAnonymous: () => false,
    compareTo: () => 0 as 0 | 1 | -1,
  } as unknown as Principal;
}

const MOCK_ALL_ORDERS: Order[] = [
  {
    id: 2001n,
    status: OrderStatus.pending,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 1 * 60 * 60 * 1000),
    totalAmount: 498n,
    buyer: makeMockPrincipal("user1-principal"),
    items: [
      {
        productId: 1n,
        quantity: 1n,
        selectedSize: "Medium",
        selectedColor: "Natural Brown",
      },
      {
        productId: 2n,
        quantity: 1n,
        selectedSize: "Standard",
        selectedColor: "Dark Brown",
      },
    ],
  },
  {
    id: 2002n,
    status: OrderStatus.confirmed,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 3 * 60 * 60 * 1000),
    totalAmount: 399n,
    buyer: makeMockPrincipal("user2-principal"),
    items: [
      {
        productId: 3n,
        quantity: 1n,
        selectedSize: "Standard (12x18 inch)",
        selectedColor: "Natural Brown",
      },
    ],
  },
  {
    id: 2003n,
    status: OrderStatus.shipped,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalAmount: 699n,
    buyer: makeMockPrincipal("user3-principal"),
    items: [
      {
        productId: 6n,
        quantity: 1n,
        selectedSize: '15"',
        selectedColor: "Natural Brown",
      },
    ],
  },
  {
    id: 2004n,
    status: OrderStatus.delivered,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalAmount: 849n,
    buyer: makeMockPrincipal("user4-principal"),
    items: [
      {
        productId: 4n,
        quantity: 1n,
        selectedSize: 'Large (24")',
        selectedColor: "Natural",
      },
      {
        productId: 5n,
        quantity: 1n,
        selectedSize: 'Small (8")',
        selectedColor: "Natural Brown",
      },
    ],
  },
];

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
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<bigint | null>(null);

  const { data: orders = MOCK_ALL_ORDERS, isLoading } = useQuery<Order[]>({
    queryKey: ["owner-all-orders"],
    queryFn: async () => {
      if (!actor) return MOCK_ALL_ORDERS;
      try {
        const res = await actor.getAllOrders();
        return res.length > 0 ? res : MOCK_ALL_ORDERS;
      } catch {
        return MOCK_ALL_ORDERS;
      }
    },
    enabled: !isFetching,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-all-orders"] });
      toast.success("Order status updated!");
    },
    onError: () => toast.error("Failed to update status"),
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
            const date = new Date(
              Number(order.createdAt) / 1_000_000,
            ).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const isExpanded = expandedOrder === order.id;

            return (
              <motion.div
                key={order.id.toString()}
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
                        Order #{order.id.toString()}
                      </div>
                      <div className="text-xs text-muted-foreground font-ui">
                        {date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-ui font-bold text-jute-olive text-sm">
                      ₹{Number(order.totalAmount)}
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
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
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
                        {order.items.map((item, j) => {
                          const mockProduct = MOCK_PRODUCTS.find(
                            (p) => p.id === item.productId,
                          );
                          return (
                            <div
                              key={`${item.productId.toString()}-${j}`}
                              className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                            >
                              {mockProduct?.imageUrls[0] && (
                                <img
                                  src={mockProduct.imageUrls[0]}
                                  alt=""
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-ui text-sm truncate">
                                  {mockProduct?.name ||
                                    `Product #${item.productId}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.selectedSize} · {item.selectedColor} ·
                                  Qty: {Number(item.quantity)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground font-ui truncate">
                        Buyer:{" "}
                        <span className="font-mono">
                          {typeof order.buyer.toText === "function"
                            ? order.buyer.toText()
                            : "Unknown"}
                        </span>
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
