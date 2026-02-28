import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { OrderStatus } from "../backend.d";
import type { Order } from "../backend.d";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ORDER_STATUS_LABELS } from "../data/mockData";
import { MOCK_PRODUCTS } from "../data/mockData";
import { useActor } from "../hooks/useActor";

const MOCK_BUYER: Principal = {
  _isPrincipal: true,
  _arr: new Uint8Array(29),
  toText: () => "aaaaa-aa",
  toUint8Array: () => new Uint8Array(29),
  toHex: () => "",
  isAnonymous: () => false,
  compareTo: () => 0 as 0 | 1 | -1,
} as unknown as Principal;

const MOCK_ORDERS: Order[] = [
  {
    id: 1001n,
    status: OrderStatus.delivered,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalAmount: 678n,
    buyer: MOCK_BUYER,
    items: [
      {
        productId: 1n,
        quantity: 2n,
        selectedSize: "Medium",
        selectedColor: "Natural Brown",
      },
      {
        productId: 3n,
        quantity: 1n,
        selectedSize: "Standard (12x18 inch)",
        selectedColor: "Natural Brown",
      },
    ],
  },
  {
    id: 1002n,
    status: OrderStatus.shipped,
    paymentStatus: "paid",
    createdAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalAmount: 448n,
    buyer: MOCK_BUYER,
    items: [
      {
        productId: 5n,
        quantity: 1n,
        selectedSize: 'Medium (12")',
        selectedColor: "Natural Brown",
      },
    ],
  },
];

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
  const date = new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString(
    "en-IN",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const itemNames = order.items.map((item) => {
    const mockProduct = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    return mockProduct ? mockProduct.name : `Product #${item.productId}`;
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
              Order #{order.id.toString()}
            </div>
            <div className="text-xs text-muted-foreground font-ui">{date}</div>
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
              const mockProduct = MOCK_PRODUCTS.find(
                (p) => p.id === item.productId,
              );
              return (
                <div
                  key={`${item.productId.toString()}-${i}`}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  {mockProduct?.imageUrls[0] && (
                    <img
                      src={mockProduct.imageUrls[0]}
                      alt={mockProduct.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  )}
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
  const { actor, isFetching } = useActor();

  const { data: orders = MOCK_ORDERS, isLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return MOCK_ORDERS;
      try {
        const res = await actor.getMyOrders();
        return res.length > 0 ? res : MOCK_ORDERS;
      } catch {
        return MOCK_ORDERS;
      }
    },
    enabled: !isFetching,
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
              {orders.map((order) => (
                <OrderCard key={order.id.toString()} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
