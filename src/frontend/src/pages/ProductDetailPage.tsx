import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { MOCK_PRODUCTS } from "../data/mockData";
import { api } from "../lib/api";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [imageIndex, setImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<any | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        return await api.get(`/products/${id}`);
      } catch {
        return MOCK_PRODUCTS.find((p) => (p._id || p.id || "").toString() === id) || null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Product not found
            </h2>
            <Button onClick={() => navigate({ to: "/" })} variant="outline">
              Back to Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const originalPrice = Number(product.originalPrice || 0);
  const discountedPrice = Number(product.discountedPrice || 0);

  const discount = originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.imageUrls && product.imageUrls.length > 0)
      ? product.imageUrls
      : ["https://picsum.photos/seed/jute/600/600"];

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }
    const size = selectedSize || (product.sizes && product.sizes[0]) || "";
    const color = selectedColor || (product.colors && product.colors[0]) || "";

    addItem({
      productId: product._id || product.id || id,
      quantity: 1,
      selectedSize: size,
      selectedColor: color,
      name: product.name || "Jute Product",
      price: discountedPrice,
      imageUrl: images[0] || "",
    });
    toast.success(`${product.name || "Product"} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="mb-6 gap-2 font-ui"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Main image */}
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl border border-border group">
                <motion.img
                  layoutId={`product-image-${product._id || product.id || id}`}
                  src={images[imageIndex]}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-ui font-bold text-sm px-3 py-1.5">
                      {discount}% OFF
                    </Badge>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 font-ui"
                    >
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Image navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex(
                          (prev) => (prev - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setImageIndex(idx)}
                      className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${idx === imageIndex
                        ? "border-primary"
                        : "border-border opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5"
            >
              <div>
                <Badge
                  variant="outline"
                  className="font-ui text-jute-brown border-jute-brown/30 mb-3"
                >
                  {product.category}
                </Badge>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-jute-olive">
                  ₹{discountedPrice}
                </span>
                {originalPrice !== discountedPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{originalPrice}
                    </span>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-ui font-semibold">
                      Save ₹{originalPrice - discountedPrice}
                    </Badge>
                  </>
                )}
              </div>

              <Separator />

              {/* Availability */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-jute-success" />
                    <span className="font-ui text-jute-success font-medium">
                      In Stock
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-ui text-destructive font-medium">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="font-ui font-semibold text-sm mb-2">
                    Size:{" "}
                    <span className="font-normal text-muted-foreground">
                      {selectedSize || (product.sizes && product.sizes[0])}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-ui transition-all ${(selectedSize || product.sizes[0]) === size
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="font-ui font-semibold text-sm mb-2">
                    Color:{" "}
                    <span className="font-normal text-muted-foreground">
                      {selectedColor || (product.colors && product.colors[0])}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-ui transition-all ${(selectedColor || product.colors[0]) === color
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-jute-brown shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                      Delivery
                    </div>
                    <div className="text-sm font-ui text-foreground">
                      {product.deliveryEstimate}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RotateCcw className="h-5 w-5 text-jute-brown shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                      Returns
                    </div>
                    <div className="text-sm font-ui text-foreground">
                      {product.returnable ? "7-day return" : "Non-returnable"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-jute-brown shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                      Category
                    </div>
                    <div className="text-sm font-ui text-foreground">
                      {product.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 font-ui gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-ui"
                >
                  Buy Now
                </Button>
              </div>

              {/* Description */}
              <Separator />
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Product Details
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
