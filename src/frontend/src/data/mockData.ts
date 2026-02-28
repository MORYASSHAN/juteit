import { type OfferBanner, OrderStatus, type Product } from "../backend.d";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Jute Tote Bag",
    description:
      "A beautifully handcrafted jute tote bag perfect for everyday use. Made from 100% natural jute fiber with reinforced stitching for durability. This eco-friendly bag is perfect for grocery shopping, beach trips, or daily commutes.",
    category: "Bags",
    originalPrice: 299n,
    discountedPrice: 199n,
    sizes: ["Small", "Medium", "Large"],
    colors: ["Natural Brown", "Olive Green", "Cream"],
    inStock: true,
    deliveryEstimate: "3-5 business days",
    returnable: true,
    imageUrls: ["/assets/generated/product-tote-bag.dim_600x600.jpg"],
  },
  {
    id: 2n,
    name: "Jute Shopping Bag",
    description:
      "Spacious and sturdy jute shopping bag with comfortable handles. Ideal for weekly groceries or farmers market visits. The thick jute weave ensures it can carry heavy loads without tearing.",
    category: "Bags",
    originalPrice: 399n,
    discountedPrice: 279n,
    sizes: ["Standard", "XL"],
    colors: ["Natural Brown", "Dark Brown"],
    inStock: true,
    deliveryEstimate: "3-5 business days",
    returnable: true,
    imageUrls: ["/assets/generated/product-shopping-bag.dim_600x600.jpg"],
  },
  {
    id: 3n,
    name: "Jute Placemat Set",
    description:
      "Set of 4 handwoven jute placemats that bring natural warmth to your dining table. Each placemat is heat-resistant and adds rustic charm to any table setting. Easy to clean and maintain.",
    category: "Home Decor",
    originalPrice: 549n,
    discountedPrice: 399n,
    sizes: ["Standard (12x18 inch)"],
    colors: ["Natural Brown", "Bleached White", "Mixed"],
    inStock: true,
    deliveryEstimate: "5-7 business days",
    returnable: true,
    imageUrls: ["/assets/generated/product-placemat.dim_600x600.jpg"],
  },
  {
    id: 4n,
    name: "Jute Wall Hanging",
    description:
      "Artistic macrame-style jute wall hanging that transforms any plain wall into a bohemian paradise. Hand-knotted by skilled artisans with natural jute rope. Perfect for living rooms, bedrooms, or offices.",
    category: "Home Decor",
    originalPrice: 799n,
    discountedPrice: 599n,
    sizes: ['Small (12")', 'Medium (18")', 'Large (24")'],
    colors: ["Natural", "Bleached"],
    inStock: true,
    deliveryEstimate: "7-10 business days",
    returnable: false,
    imageUrls: ["/assets/generated/product-wall-hanging.dim_600x600.jpg"],
  },
  {
    id: 5n,
    name: "Jute Rope Basket",
    description:
      "Handwoven rope basket made from thick natural jute rope. Perfect for organizing toys, blankets, towels, or plants. The sturdy construction makes it ideal for both decorative and functional use.",
    category: "Storage",
    originalPrice: 649n,
    discountedPrice: 449n,
    sizes: ['Small (8")', 'Medium (12")', 'Large (16")'],
    colors: ["Natural Brown"],
    inStock: true,
    deliveryEstimate: "5-7 business days",
    returnable: true,
    imageUrls: ["/assets/generated/product-rope-basket.dim_600x600.jpg"],
  },
  {
    id: 6n,
    name: "Jute Laptop Sleeve",
    description:
      "Protect your laptop in eco-style with this handcrafted jute sleeve. Padded interior keeps your device safe while the natural exterior makes a sustainable statement. Fits most 13-15 inch laptops.",
    category: "Accessories",
    originalPrice: 899n,
    discountedPrice: 699n,
    sizes: ['13"', '14"', '15"'],
    colors: ["Natural Brown", "Dark Brown"],
    inStock: false,
    deliveryEstimate: "5-7 business days",
    returnable: true,
    imageUrls: ["/assets/generated/product-laptop-sleeve.dim_600x600.jpg"],
  },
];

export const MOCK_BANNERS: OfferBanner[] = [
  {
    id: 1n,
    title: "🌿 Summer Eco Sale",
    description: "Get up to 35% off on all bags and accessories!",
    discountPercent: 35n,
    active: true,
    imageUrl: "",
  },
  {
    id: 2n,
    title: "🏠 Home Decor Fiesta",
    description: "Transform your home with our handcrafted jute decor pieces.",
    discountPercent: 25n,
    active: true,
    imageUrl: "",
  },
  {
    id: 3n,
    title: "♻️ Buy More, Save More",
    description: "Buy 2 get 15% off. Buy 3 get 25% off on all products!",
    discountPercent: 25n,
    active: true,
    imageUrl: "",
  },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.confirmed]: "Confirmed",
  [OrderStatus.shipped]: "Shipped",
  [OrderStatus.delivered]: "Delivered",
  [OrderStatus.cancelled]: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [OrderStatus.pending]: "secondary",
  [OrderStatus.confirmed]: "default",
  [OrderStatus.shipped]: "outline",
  [OrderStatus.delivered]: "default",
  [OrderStatus.cancelled]: "destructive",
};

export const INDIAN_BANKS = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank (PNB)",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "Union Bank of India",
  "Canara Bank",
  "IndusInd Bank",
  "IDFC First Bank",
  "Yes Bank",
];
