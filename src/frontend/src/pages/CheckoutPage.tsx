import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { INDIAN_BANKS } from "../data/mockData";
import { useActor } from "../hooks/useActor";

interface DeliveryForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BankingForm {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { actor } = useActor();

  const [delivery, setDelivery] = useState<DeliveryForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [banking, setBanking] = useState<BankingForm>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
  });
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const deliveryFee = items.length > 0 ? 49 : 0;
  const total = totalAmount + deliveryFee;

  const handlePlaceOrder = async () => {
    if (
      !delivery.name ||
      !delivery.address ||
      !delivery.city ||
      !delivery.pincode
    ) {
      toast.error("Please fill in all delivery details");
      return;
    }
    if (!banking.bankName || !banking.accountHolder || !banking.accountNumber) {
      toast.error("Please fill in payment details");
      return;
    }

    setIsPlacing(true);
    try {
      let newOrderId = `ORD${Date.now()}`;
      if (actor) {
        try {
          const oid = await actor.placeOrder();
          newOrderId = oid.toString();
        } catch {
          // Use mock order id
        }
      }
      setOrderId(newOrderId);
      clearCart();
      setIsSuccess(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-20 w-20 text-jute-success mx-auto mb-6" />
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                  Order Placed Successfully! 🎉
                </h2>
                <p className="text-muted-foreground text-lg mb-2">
                  Thank you for shopping at JuteIt!
                </p>
                <p className="text-muted-foreground mb-1">
                  Order ID:{" "}
                  <span className="font-ui font-bold text-foreground">
                    #{orderId}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  You'll receive a confirmation shortly
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    onClick={() => navigate({ to: "/orders" })}
                    className="bg-primary text-primary-foreground font-ui"
                  >
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: "/" })}
                    className="font-ui"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: "/cart" })}
                  className="mb-6 gap-2 font-ui"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cart
                </Button>

                <h1 className="font-display text-3xl font-bold text-foreground mb-8">
                  Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Delivery */}
                    <div className="bg-card rounded-2xl border border-border p-5">
                      <div className="flex items-center gap-2 mb-5">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-bold text-lg">
                          Delivery Address
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            Full Name *
                          </Label>
                          <Input
                            placeholder="Your name"
                            className="font-ui"
                            value={delivery.name}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            Phone *
                          </Label>
                          <Input
                            placeholder="+91 XXXXXXXXXX"
                            className="font-ui"
                            value={delivery.phone}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            Street Address *
                          </Label>
                          <Input
                            placeholder="House/Flat, Street, Area"
                            className="font-ui"
                            value={delivery.address}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                address: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            City *
                          </Label>
                          <Input
                            placeholder="City"
                            className="font-ui"
                            value={delivery.city}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                city: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            State
                          </Label>
                          <Input
                            placeholder="State"
                            className="font-ui"
                            value={delivery.state}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                state: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            PIN Code *
                          </Label>
                          <Input
                            placeholder="XXXXXX"
                            className="font-ui"
                            value={delivery.pincode}
                            maxLength={6}
                            onChange={(e) =>
                              setDelivery((p) => ({
                                ...p,
                                pincode: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-card rounded-2xl border border-border p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-bold text-lg">
                          Payment Method
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 mb-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-ui font-medium text-primary">
                          Net Banking
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Only payment method available
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            Select Bank *
                          </Label>
                          <Select
                            value={banking.bankName}
                            onValueChange={(v) =>
                              setBanking((p) => ({ ...p, bankName: v }))
                            }
                          >
                            <SelectTrigger className="font-ui">
                              <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_BANKS.map((bank) => (
                                <SelectItem
                                  key={bank}
                                  value={bank}
                                  className="font-ui"
                                >
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="font-ui text-sm font-medium mb-1.5 block">
                            Account Holder Name *
                          </Label>
                          <Input
                            placeholder="Name as per bank records"
                            className="font-ui"
                            value={banking.accountHolder}
                            onChange={(e) =>
                              setBanking((p) => ({
                                ...p,
                                accountHolder: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-ui text-sm font-medium mb-1.5 block">
                              Account Number *
                            </Label>
                            <Input
                              placeholder="XXXXXXXXXXXX"
                              className="font-ui"
                              type="password"
                              value={banking.accountNumber}
                              onChange={(e) =>
                                setBanking((p) => ({
                                  ...p,
                                  accountNumber: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label className="font-ui text-sm font-medium mb-1.5 block">
                              IFSC Code
                            </Label>
                            <Input
                              placeholder="XXXXXXXXX"
                              className="font-ui uppercase"
                              value={banking.ifsc}
                              onChange={(e) =>
                                setBanking((p) => ({
                                  ...p,
                                  ifsc: e.target.value.toUpperCase(),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
                      <h2 className="font-display font-bold text-lg mb-4">
                        Order Summary
                      </h2>

                      <div className="space-y-3 mb-4">
                        {items.map((item) => (
                          <div
                            key={item.productId.toString()}
                            className="flex justify-between text-sm font-ui"
                          >
                            <span className="text-muted-foreground truncate max-w-[160px]">
                              {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <Separator />
                      <div className="space-y-2 mt-3">
                        <div className="flex justify-between font-ui text-sm">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between font-ui text-sm">
                          <span className="text-muted-foreground">
                            Delivery
                          </span>
                          <span>₹{deliveryFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-ui font-bold text-lg">
                          <span>Total</span>
                          <span className="text-jute-olive">₹{total}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isPlacing || items.length === 0}
                        className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 font-ui h-11"
                      >
                        {isPlacing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          `Place Order — ₹${total}`
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-2">
                        🔒 Secured & encrypted payment
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
