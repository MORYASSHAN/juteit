import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    ownerEmail: { type: String, required: true },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        upiId: String
    },
    taxRate: { type: Number, default: 0 }, // Percentage
    baseShippingCharge: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 0 },
    instagramUrl: { type: String },
    heroImageUrl: { type: String },
    qrCodeUrl: { type: String },
    emailThankYouMsg: { type: String, default: "thank to order from juteit Your order" },
    cancellationWindow: { type: Number, default: 24 } // In hours
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Settings = mongoose.model('Settings', settingsSchema);
