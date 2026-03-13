import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = (product.images && product.images.length > 0) ? product.images : ["/placeholder.jpg"];

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const originalPrice = Number(product.originalPrice || 0);
  const discountedPrice = Number(product.discountedPrice || 0);

  const discount = originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    const productId = product._id || product.id || "";
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    addItem({
      productId: productId,
      quantity: 1,
      selectedSize: (product.sizes && product.sizes[0]) || "",
      selectedColor: (product.colors && product.colors[0]) || "",
      name: product.name || "Jute Product",
      price: discountedPrice,
      imageUrl: (product.images && product.images[0]) || "",
    });
    toast.success(`${product.name || "Product"} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: (product._id || product.id || "").toString() }}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-jute transition-all duration-300 border border-border flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square bg-muted">
            <img
              src={
                (() => {
                  const url = images[currentImageIndex];
                  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) return url;
                  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${url}`;
                })()
              }
              alt={product.name || "Product"}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Discount badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground font-ui font-bold text-xs px-2 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {discount}% OFF
                </Badge>
              </div>
            )}
            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-ui">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            {/* Category */}
            <Badge
              variant="outline"
              className="self-start text-xs font-ui text-jute-brown border-jute-brown/30"
            >
              {product.category}
            </Badge>

            {/* Name */}
            <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-lg font-ui font-bold text-jute-olive">
                ₹{Number(product.discountedPrice)}
              </span>
              {Number(product.originalPrice) !==
                Number(product.discountedPrice) && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Number(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* Add to Cart */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full mt-2 font-ui gap-2 ${product.inStock
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-destructive text-destructive-foreground disabled:opacity-90"
                }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
