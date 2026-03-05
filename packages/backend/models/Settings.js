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
    instagramUrl: { type: String }
}, { timestamps: true });

export const Settings = mongoose.model('Settings', settingsSchema);
