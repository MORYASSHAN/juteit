import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function BuyerProfile() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phoneNumber: (user as any).phoneNumber || "",
                address: {
                    street: (user as any).address?.street || "",
                    city: (user as any).address?.city || "",
                    state: (user as any).address?.state || "",
                    pincode: (user as any).address?.pincode || "",
                },
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put(`/users/${user?._id}`, formData);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card dark:bg-card/50 rounded-3xl shadow-jute-md border border-border p-8 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-700 dark:text-amber-400">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-display">My Profile</h1>
                            <p className="text-muted-foreground text-sm">Manage your personal information</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-4">
                            <div>
                                <Label className="text-sm font-medium mb-1.5 block">Email Address (Fixed)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={user?.email || ""}
                                        disabled
                                        className="pl-9 bg-muted cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="John Doe"
                                        className="pl-9"
                                        value={formData.name}
                                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-1.5 block">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="9876543210"
                                        className="pl-9"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-amber-600" />
                                Shipping Address
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label className="text-sm font-medium mb-1.5 block">Street Address</Label>
                                    <Input
                                        placeholder="123 Jute Street"
                                        value={formData.address.street}
                                        onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, street: e.target.value } }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium mb-1.5 block">City</Label>
                                        <Input
                                            placeholder="Kolkata"
                                            value={formData.address.city}
                                            onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-1.5 block">State</Label>
                                        <Input
                                            placeholder="West Bengal"
                                            value={formData.address.state}
                                            onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium mb-1.5 block">Pincode</Label>
                                    <Input
                                        placeholder="700001"
                                        value={formData.address.pincode}
                                        onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, pincode: e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
