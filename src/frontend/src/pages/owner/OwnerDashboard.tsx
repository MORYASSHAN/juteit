import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Megaphone,
  Package,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import type { OfferBanner, Product } from "../../backend.d";
import { MOCK_BANNERS, MOCK_PRODUCTS } from "../../data/mockData";
import { useActor } from "../../hooks/useActor";
import OwnerLayout from "./OwnerLayout";

const STATS_GRADIENT = [
  "from-amber-700 to-amber-600",
  "from-green-700 to-green-600",
  "from-stone-600 to-stone-500",
  "from-orange-700 to-orange-600",
];

export default function OwnerDashboard() {
  const { actor, isFetching } = useActor();

  const { data: products = MOCK_PRODUCTS } = useQuery<Product[]>({
    queryKey: ["owner-products"],
    queryFn: async () => {
      if (!actor) return MOCK_PRODUCTS;
      try {
        const res = await actor.listProducts();
        return res.length > 0 ? res : MOCK_PRODUCTS;
      } catch {
        return MOCK_PRODUCTS;
      }
    },
    enabled: !isFetching,
  });

  const { data: banners = MOCK_BANNERS } = useQuery<OfferBanner[]>({
    queryKey: ["owner-banners"],
    queryFn: async () => {
      if (!actor) return MOCK_BANNERS;
      try {
        const res = await actor.getActiveBanners();
        return res.length > 0 ? res : MOCK_BANNERS;
      } catch {
        return MOCK_BANNERS;
      }
    },
    enabled: !isFetching,
  });

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      href: "/owner/products" as const,
      gradient: STATS_GRADIENT[0],
    },
    {
      label: "Active Banners",
      value: banners.filter((b) => b.active).length,
      icon: Megaphone,
      href: "/owner/banners" as const,
      gradient: STATS_GRADIENT[1],
    },
    {
      label: "In Stock",
      value: products.filter((p) => p.inStock).length,
      icon: TrendingUp,
      href: "/owner/products" as const,
      gradient: STATS_GRADIENT[2],
    },
    {
      label: "Categories",
      value: new Set(products.map((p) => p.category)).size,
      icon: ClipboardList,
      href: "/owner/products" as const,
      gradient: STATS_GRADIENT[3],
    },
  ];

  const quickActions = [
    {
      label: "Manage Products",
      desc: "Add, edit or remove products",
      href: "/owner/products" as const,
      icon: Package,
    },
    {
      label: "Offer Banners",
      desc: "Create or update promotional banners",
      href: "/owner/banners" as const,
      icon: Megaphone,
    },
    {
      label: "View Orders",
      desc: "Track and update order statuses",
      href: "/owner/orders" as const,
      icon: ClipboardList,
    },
  ];

  return (
    <OwnerLayout
      title="Dashboard"
      description="Welcome back! Here's your store overview."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={stat.href}>
              <div
                className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="h-6 w-6 opacity-80" />
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </div>
                <div className="font-display text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm font-ui mt-0.5">
                  {stat.label}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <Link to={action.href}>
              <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-jute transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-ui font-semibold text-foreground mb-1">
                  {action.label}
                </h3>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Products */}
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">
        Recent Products
      </h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {products.slice(0, 5).map((product, i) => (
          <div
            key={product.id.toString()}
            className={`flex items-center gap-4 p-4 ${
              i < 4 ? "border-b border-border" : ""
            }`}
          >
            <img
              src={
                product.imageUrls[0] || "https://picsum.photos/seed/jute/80/80"
              }
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-ui font-medium text-sm truncate">
                {product.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {product.category}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-ui font-bold text-jute-olive text-sm">
                ₹{Number(product.discountedPrice)}
              </div>
              <div
                className={`text-xs font-ui ${
                  product.inStock ? "text-jute-success" : "text-destructive"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </div>
        ))}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full font-ui"
          >
            <Link to="/owner/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </OwnerLayout>
  );
}
