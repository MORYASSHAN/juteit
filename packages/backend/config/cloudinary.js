import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for product images
const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'juteit/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
        ],
    },
});

// Storage configuration for general/banner images
const generalStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'juteit/general',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { quality: 'auto:good', fetch_format: 'auto' }
        ],
    },
});

export { cloudinary, generalStorage, productStorage };
