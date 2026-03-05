import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'read', 'responded'],
        default: 'new'
    },
}, { timestamps: true });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
