import express from 'express';
import {
    getActiveBanners,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getActiveBanners);
router.get('/all', protect, admin, getAllBanners);
router.post('/', protect, admin, createBanner);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

export default router;
