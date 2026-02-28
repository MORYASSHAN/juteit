import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

<<<<<<< HEAD
  const originalPrice = Number(product.originalPrice || 0);
  const discountedPrice = Number(product.discountedPrice || 0);

  const discount = originalPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;
=======
  const discount = Math.round(
    ((Number(product.originalPrice) - Number(product.discountedPrice)) /
      Number(product.originalPrice)) *
      100,
  );
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
<<<<<<< HEAD

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
      imageUrl: (product.imageUrls && product.imageUrls[0]) || "",
    });
    toast.success(`${product.name || "Product"} added to cart!`);
=======
    addItem({
      productId: product.id,
      quantity: 1,
      selectedSize: product.sizes[0] || "",
      selectedColor: product.colors[0] || "",
      name: product.name,
      price: Number(product.discountedPrice),
      imageUrl: product.imageUrls[0] || "",
    });
    toast.success(`${product.name} added to cart!`);
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group"
    >
<<<<<<< HEAD
      <Link to="/product/$id" params={{ id: (product._id || product.id || "").toString() }}>
=======
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-jute transition-all duration-300 border border-border flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square bg-muted">
            <img
              src={
                product.imageUrls[0] ||
                "https://picsum.photos/seed/jute/600/600"
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                <Badge variant="secondary" className="text-sm font-ui">
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
<<<<<<< HEAD
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Number(product.originalPrice)}
                  </span>
                )}
=======
                <span className="text-sm text-muted-foreground line-through">
                  ₹{Number(product.originalPrice)}
                </span>
              )}
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
            </div>

            {/* Add to Cart */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-ui gap-2"
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
