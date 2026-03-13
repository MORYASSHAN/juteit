import express from 'express';
import multer from 'multer';
import { productStorage } from '../config/cloudinary.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({
    storage: productStorage,
    fileFilter: function (req, file, cb) {
        const filetypes = /png|jpg|jpeg|webp/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images Only! Only .png, .jpg, .jpeg and .webp formats are allowed.'));
        }
    },
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No files uploaded' });
    }

    // Cloudinary storage automatically adds 'path' (the URL) to each file object
    const fileUrls = req.files.map((file) => file.path);
    
    res.send({
        message: 'Images Uploaded Successfully to Cloudinary',
        urls: fileUrls,
    });
});

// @desc    Upload single image (e.g., for banners or settings)
// @route   POST /api/upload/single
router.post('/single', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    res.send({
        message: 'Image Uploaded Successfully to Cloudinary',
        url: req.file.path,
    });
});

export default router;
