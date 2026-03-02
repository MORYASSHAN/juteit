import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountPercent: {
        type: Number,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
