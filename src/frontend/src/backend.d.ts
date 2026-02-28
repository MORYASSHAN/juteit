import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface OfferBanner {
    id: bigint;
    title: string;
    active: boolean;
    description: string;
    discountPercent: bigint;
    imageUrl?: string;
}
export interface CartItem {
    selectedColor: string;
    productId: bigint;
    quantity: bigint;
    selectedSize: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentStatus: string;
    createdAt: Time;
    totalAmount: bigint;
    buyer: Principal;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface Product {
    id: bigint;
    deliveryEstimate: string;
    inStock: boolean;
    originalPrice: bigint;
    imageUrls: Array<string>;
    name: string;
    description: string;
    sizes: Array<string>;
    category: string;
    colors: Array<string>;
    discountedPrice: bigint;
    returnable: boolean;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBanner(b: OfferBanner): Promise<bigint>;
    addProduct(p: Product): Promise<bigint>;
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBanner(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getActiveBanners(): Promise<Array<OfferBanner>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(id: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(): Promise<bigint>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBanner(id: bigint, b: OfferBanner): Promise<void>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, p: Product): Promise<void>;
}
