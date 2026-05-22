import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        selectedSize: String,
        selectedColor: String,
        priceAtPurchase: Number
    }],
    totalProductsPrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phoneNumber: String,
        country: { type: String, default: 'India' }
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'confirmed'],
        default: 'pending'
    },
    paymentId: String,
    cancellationDeadline: {
        type: Date,
        default: () => new Date(Date.now() + 20 * 60 * 60 * 1000) // 20 hours from now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        index: { expires: 0 } // TTL index for automatic deletion
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Order = mongoose.model('Order', orderSchema);
