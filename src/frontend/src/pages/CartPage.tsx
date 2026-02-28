import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { isLoggedIn } = useAuth();

  const deliveryFee = items.length > 0 ? 49 : 0;
  const total = totalAmount + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="mb-6 gap-2 font-ui"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h2 className="font-display text-2xl font-semibold text-muted-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add some beautiful jute products to get started
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground font-ui"
              >
                <Link to="/">Browse Products</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
                          🧺
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-ui mt-0.5">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && " · "}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                      <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                        <span className="font-ui font-bold text-jute-olive">
                          ₹{item.price * item.quantity}
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-muted rounded-lg">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="h-7 w-7 flex items-center justify-center hover:bg-border rounded-l-lg transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-ui font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="h-7 w-7 flex items-center justify-center hover:bg-border rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="h-7 w-7 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
                  <h2 className="font-display font-bold text-xl text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between font-ui text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({items.length}{" "}
                        {items.length === 1 ? "item" : "items"})
                      </span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between font-ui text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-jute-success">₹{deliveryFee}</span>
                    </div>
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm font-ui"
                      >
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-ui font-bold text-lg">
                      <span>Total</span>
                      <span className="text-jute-olive">₹{total}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-ui h-11"
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate({ to: "/login" });
                      } else {
                        navigate({ to: "/checkout" });
                      }
                    }}
                  >
                    {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3 font-ui">
                    Free delivery on orders above ₹500
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
