import Banner from '../models/Banner.js';

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
export const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/all
// @access  Private/Admin
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
    try {
        const { title, description, discountPercent, imageUrl, active } = req.body;
        const banner = new Banner({
            title,
            description,
            discountPercent,
            imageUrl,
            active,
        });
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            banner.title = req.body.title || banner.title;
            banner.description = req.body.description || banner.description;
            banner.discountPercent = req.body.discountPercent !== undefined ? req.body.discountPercent : banner.discountPercent;
            banner.imageUrl = req.body.imageUrl || banner.imageUrl;
            banner.active = req.body.active !== undefined ? req.body.active : banner.active;

            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
