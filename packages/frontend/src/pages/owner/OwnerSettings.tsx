import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Banknote, Loader2, Mail, MessageSquare, Percent, QrCode, Save, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import OwnerLayout from "./OwnerLayout";

export default function OwnerSettings() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        ownerEmail: "",
        bankDetails: {
            accountName: "",
            accountNumber: "",
            ifscCode: "",
            upiId: "",
        },
        taxRate: 0,
        shippingCharge: 0,
        freeShippingThreshold: 0,
        cancellationWindow: 24,
        instagramUrl: "",
        heroImageUrl: "",
        qrCodeUrl: "",
        emailThankYouMsg: "",
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["owner-settings"],
        queryFn: async () => {
            return await api.get('/settings');
        },
    });

    useEffect(() => {
        if (settings) {
            setForm(prev => ({
                ...prev,
                ...settings,
                bankDetails: {
                    ...prev.bankDetails,
                    ...(settings.bankDetails || {})
                }
            }));
        }
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: async (newSettings: any) => {
            await api.put('/settings', newSettings);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owner-settings"] });
            toast.success("Settings updated successfully!");
        },
        onError: (err: any) => toast.error(err.message || "Failed to update settings"),
    });

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await api.post("/upload/single", formData);
            return res.url;
        } catch (err: any) {
            toast.error("Upload failed: " + err.message);
            return null;
        }
    };

    const normalizeUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) return url;
        return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${url}`;
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(form);
    };

    if (isLoading) {
        return (
            <OwnerLayout title="Settings" description="Loading your store configurations...">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout title="Settings" description="Configure your store's global details">
            <form onSubmit={handleSave}>
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl flex-wrap h-auto">
                        <TabsTrigger value="general" className="rounded-lg gap-2">
                            <Mail className="h-4 w-4" /> General
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="rounded-lg gap-2">
                            <Banknote className="h-4 w-4" /> Bank Details
                        </TabsTrigger>
                        <TabsTrigger value="communication" className="rounded-lg gap-2">
                            <MessageSquare className="h-4 w-4" /> Email & Payment
                        </TabsTrigger>
                        <TabsTrigger value="shipping" className="rounded-lg gap-2">
                            <Truck className="h-4 w-4" /> Tax & Shipping
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="font-display text-lg">Contact Information</CardTitle>
                                <CardDescription className="font-ui">Core contact details for notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Owner/Admin Email</Label>
                                    <Input
                                        type="email"
                                        value={form.ownerEmail || ""}
                                        onChange={e => setForm({ ...form, ownerEmail: e.target.value })}
                                        placeholder="admin@juteit.com"
                                        className="font-ui"
                                    />
                                    <p className="text-xs text-muted-foreground font-ui">This email receives new order notifications.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Instagram Link</Label>
                                    <Input
                                        value={form.instagramUrl || ""}
                                        onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                        className="font-ui"
                                    />
                                    <p className="text-xs text-muted-foreground font-ui">Your store's Instagram profile link.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Hero Collection Image URL</Label>
                                    <Input
                                        value={form.heroImageUrl || ""}
                                        onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
                                        placeholder="https://example.com/hero.jpg"
                                        className="font-ui"
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input
                                            type="file"
                                            className="h-8 text-xs font-ui"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = await uploadImage(file);
                                                    if (url) setForm({ ...form, heroImageUrl: url });
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-ui">Full-width image for the 'Juteit Collection' section.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payment">
                        <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="font-display text-lg">Bank Account Details</CardTitle>
                                <CardDescription className="font-ui">These details are shown to customers for Net Banking / UPI</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Account Holder Name</Label>
                                    <Input
                                        value={form.bankDetails.accountName || ""}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })}
                                        placeholder="Enter full name"
                                        className="font-ui"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Account Number</Label>
                                    <Input
                                        value={form.bankDetails.accountNumber || ""}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })}
                                        placeholder="Enter account number"
                                        className="font-ui"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">IFSC Code</Label>
                                    <Input
                                        value={form.bankDetails.ifscCode || ""}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })}
                                        placeholder="SBIN0001234"
                                        className="font-ui uppercase"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">UPI ID</Label>
                                    <Input
                                        value={form.bankDetails.upiId || ""}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, upiId: e.target.value } })}
                                        placeholder="juteit@okaxis"
                                        className="font-ui"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="communication">
                        <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="font-display text-lg">Email & Payment Setup</CardTitle>
                                <CardDescription className="font-ui">Settings for customer communication and payment collection</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="font-ui text-sm font-medium flex items-center gap-2">
                                        <QrCode className="h-4 w-4" /> UPI QR Code Image URL
                                    </Label>
                                    <Input
                                        value={form.qrCodeUrl || ""}
                                        onChange={e => setForm({ ...form, qrCodeUrl: e.target.value })}
                                        placeholder="https://example.com/my-qr.png"
                                        className="font-ui"
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input
                                            type="file"
                                            className="h-8 text-xs font-ui"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = await uploadImage(file);
                                                    if (url) setForm({ ...form, qrCodeUrl: url });
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-ui">
                                        Upload your UPI QR code or paste the direct image link here.
                                    </p>
                                    {form.qrCodeUrl && (
                                        <div className="mt-2 p-2 border rounded-lg bg-muted/20 w-max">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Preview:</p>
                                            <img src={normalizeUrl(form.qrCodeUrl)} alt="QR Preview" className="h-32 w-auto object-contain border rounded shadow-sm bg-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Label className="font-ui text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email Thank You Message
                                    </Label>
                                    <Textarea
                                        value={form.emailThankYouMsg || ""}
                                        onChange={e => setForm({ ...form, emailThankYouMsg: e.target.value })}
                                        placeholder="thank to order from juteit Your order"
                                        className="font-ui min-h-[100px] leading-relaxed"
                                    />
                                    <p className="text-xs text-muted-foreground font-ui">
                                        This message appears at the top of the order confirmation email.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shipping">
                        <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="font-display text-lg">Pricing & Logistics</CardTitle>
                                <CardDescription className="font-ui">Manage taxes and delivery fees</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium flex items-center gap-1.5">
                                        <Percent className="h-3.5 w-3.5" /> Tax Rate (%)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.taxRate}
                                        onChange={e => setForm({ ...form, taxRate: Number(e.target.value) })}
                                        className="font-ui"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium flex items-center gap-1.5">
                                        <Truck className="h-3.5 w-3.5" /> Shipping Charge (₹)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.shippingCharge}
                                        onChange={e => setForm({ ...form, shippingCharge: Number(e.target.value) })}
                                        className="font-ui"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Free Shipping Over (₹)</Label>
                                    <Input
                                        type="number"
                                        value={form.freeShippingThreshold}
                                        onChange={e => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                                        className="font-ui"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-ui text-sm font-medium">Cancellation Window (Hours)</Label>
                                    <Input
                                        type="number"
                                        value={form.cancellationWindow}
                                        onChange={e => setForm({ ...form, cancellationWindow: Number(e.target.value) })}
                                        className="font-ui"
                                        placeholder="e.g., 24"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Time frame for buyer to cancel after ordering.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="bg-primary text-primary-foreground font-ui px-8 gap-2 h-11 transition-all hover:scale-105 active:scale-95"
                        >
                            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </Tabs>
            </form>
        </OwnerLayout>
    );
}

