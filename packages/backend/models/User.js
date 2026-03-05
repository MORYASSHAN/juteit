import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    role: { type: String, enum: ['owner', 'buyer'], default: 'buyer' },
    oauthId: { type: String }, // Google/iOS identifier
    phoneNumber: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: {
            type: String,
            match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian pincode']
        },
        country: { type: String, default: 'India' }
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
