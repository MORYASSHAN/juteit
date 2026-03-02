import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }], // Array of URLs
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    inStock: { type: Boolean, default: true },
    deliveryEstimate: { type: String }, // e.g., "3-5 days"
    returnable: { type: Boolean, default: true },
    isHeadline: { type: Boolean, default: false } // For offer banners
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
